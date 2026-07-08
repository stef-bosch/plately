import { getRecipeById } from '../data/recipes';
import type { DayMeals, Nutrition } from '../types';

/**
 * Nutrition aggregation helpers.
 *
 * Recipe nutrition is stored per serving and flagged indicative. These helpers
 * sum a day's meals so the dashboard can show daily totals. Snacks may contain
 * multiple recipes, so they are summed individually.
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

/** Sums the macro totals for one day of meals (1 serving each). */
export function getDailyTotals(meals: DayMeals): DailyTotals {
  const ids = [meals.ontbijt, meals.lunch, meals.diner, ...meals.tussendoortje];

  return ids.reduce((totals, id) => {
    const recipe = getRecipeById(id);
    if (!recipe) return totals;
    return addNutrition(totals, recipe.nutrition);
  }, EMPTY_TOTALS);
}
