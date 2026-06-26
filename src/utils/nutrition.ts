import { getRecipeById } from '../data/recipes';
import type { DayMeals, Micronutrients, Nutrition } from '../types';

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

export interface MicronutrientMeta {
  key: keyof Micronutrients;
  label: string;
  unit: string;
}

/** Display order + Dutch labels + units for micronutrients. */
export const micronutrientMeta: MicronutrientMeta[] = [
  { key: 'iron', label: 'IJzer', unit: 'mg' },
  { key: 'calcium', label: 'Calcium', unit: 'mg' },
  { key: 'potassium', label: 'Kalium', unit: 'mg' },
  { key: 'magnesium', label: 'Magnesium', unit: 'mg' },
  { key: 'vitaminC', label: 'Vitamine C', unit: 'mg' },
  { key: 'vitaminA', label: 'Vitamine A', unit: 'µg' },
  { key: 'folate', label: 'Foliumzuur', unit: 'µg' },
];

export interface MacroMeta {
  key: keyof DailyTotals;
  label: string;
  unit: string;
  color: string;
}
