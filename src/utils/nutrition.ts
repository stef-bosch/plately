import type { Nutrition, Recipe } from '../types';

/**
 * Nutrition aggregation helpers.
 *
 * Recipe nutrition is stored per serving and flagged indicative. `sumNutrition`
 * adds up a list of dishes so the dashboard can show the day menu's totals.
 */

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

const EMPTY_TOTALS: DailyTotals = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
};

function addNutrition(totals: DailyTotals, nutrition: Nutrition): DailyTotals {
  return {
    calories: totals.calories + nutrition.calories,
    protein: totals.protein + nutrition.protein,
    carbs: totals.carbs + nutrition.carbs,
    fat: totals.fat + nutrition.fat,
    fiber: totals.fiber + nutrition.fiber,
  };
}

/** Sums the macro totals for a list of dishes (1 serving each). */
export function sumNutrition(recipes: Recipe[]): DailyTotals {
  return recipes.reduce(
    (totals, r) => addNutrition(totals, r.nutrition),
    EMPTY_TOTALS,
  );
}
