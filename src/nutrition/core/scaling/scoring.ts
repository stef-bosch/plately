import type { SystemConfig } from '../config';
import type {
  FoodItemIndex,
  MacroTarget,
  Nutrition,
  RecipeIngredient,
} from '../types';
import type { ScaleCandidate } from './RecipeScaler';

export interface ScoreInputs {
  candidate: ScaleCandidate;
  ingredients: RecipeIngredient[];
  foods: FoodItemIndex;
  targetKcal: number;
  config: SystemConfig;
  macroTarget?: MacroTarget;
  baseAmounts: Map<string, number>;
  current: Nutrition;
}

export interface ScoreBreakdown {
  score: number;
  kcalError: number;
  macroPenalty: number;
  portionPenalty: number;
  realismPenalty: number;
  deviationFromBase: number;
  rolePriorityBonus: number;
  schijfBonus: number;
  saltPenalty: number;
  saturatedFatPenalty: number;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Lower is better. */
export function scoreCandidate(inputs: ScoreInputs): ScoreBreakdown {
  const { candidate, ingredients, foods, targetKcal, config, macroTarget, baseAmounts, current } = inputs;
  const w = config.scoreWeights;

  const ing = ingredients.find((i) => i.id === candidate.ingredientId)!;
  const food = foods.get(ing.foodItemId);
  const sign = candidate.direction === 'up' ? 1 : -1;
  const gramDelta = sign * candidate.stepG;
  const f = gramDelta / 100;

  const kcalAfter = current.kcal + candidate.estimatedKcalDelta;
  const kcalError = Math.abs(targetKcal - kcalAfter) / Math.max(1, targetKcal);

  const macroPenalty = computeMacroPenalty(current, food, f, macroTarget);
  const portionPenalty = computePortionPenalty(ing, candidate);
  const realismPenalty = computeRealismPenalty(ing, candidate, baseAmounts, config);
  const deviationFromBase = computeDeviationFromBase(ingredients, candidate, baseAmounts);
  const rolePriorityBonus = computeRolePriorityBonus(candidate, current, targetKcal, config, macroTarget);
  const schijfBonus = computeSchijfBonus(candidate, food);
  const saltPenalty = computeSaltPenalty(candidate, food);
  const saturatedFatPenalty = computeSatFatPenalty(candidate, food);

  const score =
    kcalError * w.kcalError +
    macroPenalty * w.macro +
    portionPenalty * w.portion +
    realismPenalty * w.realism +
    deviationFromBase * w.deviationFromBase +
    saltPenalty * w.salt +
    saturatedFatPenalty * w.saturatedFat -
    rolePriorityBonus * w.rolePriorityBonus -
    schijfBonus * w.schijfVanVijf;

  return {
    score,
    kcalError,
    macroPenalty,
    portionPenalty,
    realismPenalty,
    deviationFromBase,
    rolePriorityBonus,
    schijfBonus,
    saltPenalty,
    saturatedFatPenalty,
  };
}

function computeMacroPenalty(
  current: Nutrition,
  food: { proteinPer100g: number; carbsPer100g: number; fatPer100g: number } | undefined,
  f: number,
  macro?: MacroTarget,
): number {
  if (!macro || !food) return 0;
  const proteinAfter = current.proteinG + food.proteinPer100g * f;
  const carbsAfter = current.carbsG + food.carbsPer100g * f;
  const fatAfter = current.fatG + food.fatPer100g * f;

  const proteinDeficit = Math.max(0, macro.proteinMinG - proteinAfter) / Math.max(1, macro.proteinG);
  const proteinExcess = Math.max(0, proteinAfter - macro.proteinG * 1.3) / Math.max(1, macro.proteinG);
  const carbDev = Math.abs(carbsAfter - macro.carbsG) / Math.max(1, macro.carbsG);
  const fatDev = Math.abs(fatAfter - macro.fatG) / Math.max(1, macro.fatG);

  return proteinDeficit * 1.5 + proteinExcess * 0.5 + carbDev * 0.5 + fatDev * 0.5;
}

function computePortionPenalty(ing: RecipeIngredient, candidate: ScaleCandidate): number {
  const min = ing.minG ?? 0;
  const max = ing.maxG ?? Number.POSITIVE_INFINITY;
  if (!Number.isFinite(max) || max <= min) return 0;
  const frac = (candidate.resultingAmountG - min) / (max - min);
  let p = 0;
  if (candidate.direction === 'up' && frac > 0.85) p += (frac - 0.85) / 0.15;
  if (candidate.direction === 'down' && frac < 0.15) p += (0.15 - frac) / 0.15;
  return clamp(p, 0, 1.5);
}

function computeRealismPenalty(
  ing: RecipeIngredient,
  candidate: ScaleCandidate,
  baseAmounts: Map<string, number>,
  config: SystemConfig,
): number {
  const base = baseAmounts.get(ing.id) ?? ing.amountG;
  if (base <= 0) return 0;
  const rel = Math.abs(candidate.resultingAmountG - base) / base;
  const allowed = config.identityRelChange[ing.role] ?? 1.2;
  return clamp(rel > allowed ? rel - allowed : 0, 0, 2);
}

function computeDeviationFromBase(
  ingredients: RecipeIngredient[],
  candidate: ScaleCandidate,
  baseAmounts: Map<string, number>,
): number {
  let dev = 0;
  let baseTotal = 0;
  for (const i of ingredients) {
    const base = baseAmounts.get(i.id) ?? i.amountG;
    const amt = i.id === candidate.ingredientId ? candidate.resultingAmountG : i.amountG;
    dev += Math.abs(amt - base);
    baseTotal += base;
  }
  return baseTotal > 0 ? dev / baseTotal : 0;
}

function computeRolePriorityBonus(
  candidate: ScaleCandidate,
  current: Nutrition,
  targetKcal: number,
  config: SystemConfig,
  macro?: MacroTarget,
): number {
  const table = candidate.direction === 'up' ? config.rolePriorityUp : config.rolePriorityDown;
  let bonus = table[candidate.role] ?? 0;

  if (macro) {
    const proteinUnder = current.proteinG < macro.proteinMinG;
    const proteinAmple = current.proteinG > macro.proteinG * 1.2;

    if (candidate.role === 'protein_base') {
      if (candidate.direction === 'up') {
        if (proteinUnder) bonus += 0.6;
        else if (proteinAmple) bonus *= 0.4;
      } else {
        // Only comfortable lowering protein when there's plenty of it.
        bonus = proteinAmple ? bonus + 0.3 : bonus * 0.3;
      }
    }

    if (candidate.role === 'fat_source' && candidate.direction === 'up') {
      const err = Math.abs(targetKcal - current.kcal) / Math.max(1, targetKcal);
      if (err > 0.15) bonus *= 0.7; // fat is best for small corrections, not big gaps
    }
  }

  return bonus;
}

function computeSchijfBonus(
  candidate: ScaleCandidate,
  food?: { schijfVanVijf: boolean },
): number {
  if (candidate.direction !== 'up' || !food) return 0;
  // Reward healthy staples going up; gently discourage adding non-staples.
  return food.schijfVanVijf ? 1 : -0.3;
}

function computeSaltPenalty(
  candidate: ScaleCandidate,
  food?: { saltPer100g?: number | null },
): number {
  if (candidate.direction !== 'up' || !food?.saltPer100g) return 0;
  const added = (candidate.stepG / 100) * food.saltPer100g;
  return clamp(added / 6, 0, 1); // ~6 g/day reference
}

function computeSatFatPenalty(
  candidate: ScaleCandidate,
  food?: { saturatedFatPer100g?: number | null },
): number {
  if (candidate.direction !== 'up' || !food?.saturatedFatPer100g) return 0;
  const added = (candidate.stepG / 100) * food.saturatedFatPer100g;
  return clamp(added / 20, 0, 1); // ~20 g/day reference
}
