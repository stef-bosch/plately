import { getRecipeById } from '../data/recipes';
import type { DayMeals, Nutrition, Recipe } from '../types';

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

/** One day's meals, resolved to dishes. Slots without a dish stay undefined. */
export interface DayRecipes {
  ontbijt?: Recipe;
  lunch?: Recipe;
  diner?: Recipe;
  snacks: Recipe[];
}

/** Resolves a day's meal ids to the dishes they point at. */
export function resolveDayMeals(meals: DayMeals): DayRecipes {
  return {
    ontbijt: getRecipeById(meals.ontbijt),
    lunch: getRecipeById(meals.lunch),
    diner: getRecipeById(meals.diner),
    snacks: meals.tussendoortje
      .map((id) => getRecipeById(id))
      .filter((r): r is Recipe => Boolean(r)),
  };
}

/** Sums the macro totals for one day of resolved meals (1 serving each). */
export function getDailyTotals(day: DayRecipes): DailyTotals {
  const all = [day.ontbijt, day.lunch, ...day.snacks, day.diner].filter(
    (r): r is Recipe => Boolean(r),
  );
  return all.reduce((totals, r) => addNutrition(totals, r.nutrition), EMPTY_TOTALS);
}
