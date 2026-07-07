import type { FoodItemIndex, RecipeIngredient } from '../types';
import type { ScaleCandidate } from './RecipeScaler';

/** Roles that are never scaled automatically (flavour drivers). */
export const NEVER_AUTOSCALE_ROLES = new Set(['flavouring']);

/**
 * Generate every valid scaling move in the requested direction. An ingredient
 * only qualifies when it is scalable, has a step size, is not a flavouring, and
 * the move keeps it within [min_g, max_g].
 */
export function generateCandidates(
  ingredients: RecipeIngredient[],
  foods: FoodItemIndex,
  direction: 'up' | 'down',
): ScaleCandidate[] {
  const out: ScaleCandidate[] = [];

  for (const ing of ingredients) {
    if (!ing.scalable) continue;
    if (NEVER_AUTOSCALE_ROLES.has(ing.role)) continue;

    const step = ing.stepG;
    if (!step || step <= 0) continue;

    const food = foods.get(ing.foodItemId);
    if (!food) continue;

    const min = ing.minG ?? 0;
    const max = ing.maxG ?? Number.POSITIVE_INFINITY;
    const kcalPerStep = (step / 100) * (food.kcalPer100g ?? 0);

    if (direction === 'up') {
      const next = round1(ing.amountG + step);
      if (next > max) continue;
      out.push({
        ingredientId: ing.id,
        direction,
        stepG: step,
        role: ing.role,
        estimatedKcalDelta: kcalPerStep,
        resultingAmountG: next,
        valid: true,
      });
    } else {
      const next = round1(ing.amountG - step);
      // Required ingredients and vegetables can't drop below their minimum
      // (seed data sets a vegetable's min_g to its base amount).
      if (next < min) continue;
      out.push({
        ingredientId: ing.id,
        direction,
        stepG: step,
        role: ing.role,
        estimatedKcalDelta: -kcalPerStep,
        resultingAmountG: next,
        valid: true,
      });
    }
  }

  return out;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
