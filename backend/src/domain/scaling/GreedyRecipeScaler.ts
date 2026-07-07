import { calculateRecipeNutrition } from '../nutrition';
import type { IngredientRole, Nutrition, RecipeBlueprint, RecipeIngredient } from '../types';
import { generateCandidates } from './candidates';
import type {
  IngredientChange,
  RecipeScaler,
  ScaledRecipeResult,
  ScalingContext,
} from './RecipeScaler';
import { scoreCandidate } from './scoring';

/**
 * A robust greedy optimizer: each iteration it enumerates valid single-step
 * moves in the needed direction, scores them, and applies the best one — never
 * scaling a recipe linearly as a whole. It stops on tolerance, when no move
 * gets closer, or at the iteration cap, returning the closest attempt.
 */
export class GreedyRecipeScaler implements RecipeScaler {
  scaleRecipeToTarget(
    recipe: RecipeBlueprint,
    targetKcal: number,
    context: ScalingContext,
  ): ScaledRecipeResult {
    const { foods, config, macroTarget } = context;

    // Work on a copy so the blueprint is never mutated.
    const ings: RecipeIngredient[] = recipe.ingredients.map((i) => ({ ...i }));
    const baseAmounts = new Map(recipe.ingredients.map((i) => [i.id, i.amountG]));

    let nutrition = calculateRecipeNutrition(ings, foods);
    const tol = targetKcal * config.kcalTolerance;
    const within = () => Math.abs(nutrition.kcal - targetKcal) <= tol;

    let best = { amounts: snapshot(ings), nutrition, err: Math.abs(nutrition.kcal - targetKcal) };
    let iterations = 0;

    while (iterations < config.maxIterations && !within()) {
      const direction = targetKcal - nutrition.kcal > 0 ? 'up' : 'down';
      const candidates = generateCandidates(ings, foods, direction);
      if (candidates.length === 0) break;

      let chosen = null as (typeof candidates)[number] | null;
      let bestScore = Number.POSITIVE_INFINITY;
      for (const c of candidates) {
        const { score } = scoreCandidate({
          candidate: c,
          ingredients: ings,
          foods,
          targetKcal,
          config,
          macroTarget,
          baseAmounts,
          current: nutrition,
        });
        if (score < bestScore) {
          bestScore = score;
          chosen = c;
        }
      }
      if (!chosen) break;

      // Overshoot guard: if the best move doesn't get us closer to target, stop.
      const errBefore = Math.abs(targetKcal - nutrition.kcal);
      const errAfter = Math.abs(targetKcal - (nutrition.kcal + chosen.estimatedKcalDelta));
      if (errAfter >= errBefore) break;

      const ing = ings.find((i) => i.id === chosen!.ingredientId)!;
      ing.amountG = chosen.resultingAmountG;
      nutrition = calculateRecipeNutrition(ings, foods);
      iterations++;

      const err = Math.abs(nutrition.kcal - targetKcal);
      if (err < best.err) best = { amounts: snapshot(ings), nutrition, err };
    }

    // Return the closest state we reached.
    restore(ings, best.amounts);
    nutrition = best.nutrition;

    const changes: IngredientChange[] = ings.map((i) => {
      const base = baseAmounts.get(i.id) ?? i.amountG;
      return {
        ingredientId: i.id,
        name: i.displayName,
        baseAmountG: round(base),
        scaledAmountG: round(i.amountG),
        changeG: round(i.amountG - base),
      };
    });

    const warnings = buildWarnings(ings, foods, nutrition, targetKcal, tol, context);
    const changesSummary = buildSummary(changes, ings, warnings);

    const scaledRecipe: RecipeBlueprint = { ...recipe, ingredients: ings };
    return { recipe: scaledRecipe, nutrition, changes, changesSummary, warnings, iterations };
  }
}

function snapshot(ings: RecipeIngredient[]): Map<string, number> {
  return new Map(ings.map((i) => [i.id, i.amountG]));
}
function restore(ings: RecipeIngredient[], amounts: Map<string, number>): void {
  for (const i of ings) i.amountG = amounts.get(i.id) ?? i.amountG;
}
const round = (n: number) => Math.round(n * 10) / 10;

function buildWarnings(
  ings: RecipeIngredient[],
  foods: ScalingContext['foods'],
  nutrition: Nutrition,
  targetKcal: number,
  tol: number,
  context: ScalingContext,
): string[] {
  const warnings: string[] = [];
  const off = Math.abs(nutrition.kcal - targetKcal);

  if (off > tol) {
    warnings.push('Target kcal niet volledig haalbaar binnen normale portiegrenzen.');
    warnings.push('Overweeg een extra snack toe te voegen of het gerecht te wisselen.');

    const needMore = nutrition.kcal < targetKcal;
    if (needMore) {
      if (atMax(ings, 'carb_base')) warnings.push('Koolhydraatbasis heeft maximum bereikt.');
      if (atMax(ings, 'fat_source')) warnings.push('Vetbron heeft maximum bereikt.');
      if (atMax(ings, 'protein_base')) warnings.push('Eiwitbron heeft maximum bereikt.');
    }
  }

  const macro = context.macroTarget;
  if (macro && nutrition.proteinG < macro.proteinMinG) {
    warnings.push('Eiwitdoel niet gehaald met dit gerecht.');
  }
  void foods;
  return warnings;
}

function atMax(ings: RecipeIngredient[], role: IngredientRole): boolean {
  const ofRole = ings.filter((i) => i.role === role && i.scalable && (i.maxG ?? null) != null);
  if (ofRole.length === 0) return false;
  return ofRole.every((i) => i.amountG >= (i.maxG as number) - 0.001);
}

function buildSummary(
  changes: IngredientChange[],
  ings: RecipeIngredient[],
  warnings: string[],
): string[] {
  const byId = new Map(ings.map((i) => [i.id, i]));
  const lines: string[] = [];

  for (const c of changes) {
    if (Math.abs(c.changeG) < 0.1) continue;
    const role = byId.get(c.ingredientId)?.role;
    const up = c.changeG > 0;
    lines.push(describeChange(c.name, role, up));
  }

  const vegUnchanged = ings.some((i) => i.role === 'vegetable') &&
    changes.filter((c) => byId.get(c.ingredientId)?.role === 'vegetable').every((c) => Math.abs(c.changeG) < 0.1);
  if (vegUnchanged) lines.push('Groente minimaal gelijk gehouden.');

  if (ings.some((i) => i.role === 'flavouring')) {
    lines.push('Specerijen en smaakmakers niet automatisch geschaald.');
  }

  if (lines.length === 0 && warnings.length === 0) {
    lines.push('Basisrecept viel al binnen het kcal-doel; geen aanpassing nodig.');
  }
  return lines;
}

function describeChange(name: string, role: IngredientRole | undefined, up: boolean): string {
  const verb = up ? 'verhoogd' : 'verlaagd';
  switch (role) {
    case 'carb_base':
      return `${name} ${verb} ${up ? 'voor extra koolhydraten' : 'om kcal te verlagen'}.`;
    case 'protein_base':
      return `${name} ${verb} ${up ? 'om het eiwitdoel te behouden' : '(eiwit bleef voldoende)'}.`;
    case 'fat_source':
      return `${name} beperkt ${verb} ${up ? 'voor extra energie' : 'om vet/kcal te verlagen'}.`;
    case 'dairy_sauce':
      return `${name} ${verb}.`;
    case 'vegetable':
      return `${name} ${verb} (binnen gezonde grenzen).`;
    case 'fruit':
      return `${name} ${verb} (beperkt).`;
    case 'sauce_base':
      return `Sausbasis (${name}) beperkt ${verb}.`;
    default:
      return `${name} ${verb}.`;
  }
}
