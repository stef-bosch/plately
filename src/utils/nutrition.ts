import { getRecipeById } from '../data/recipes';
import type { DayMeals, Micronutrients, Nutrition } from '../types';
import type { ResolveSettings } from './resolveRecipe';

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

/**
 * Sums the macro totals for one day of meals (1 serving each). Pass `settings`
 * so reactive dishes (e.g. breakfasts) are summed at the right portion.
 */
export function getDailyTotals(
  meals: DayMeals,
  settings?: ResolveSettings,
): DailyTotals {
  const ids = [meals.ontbijt, meals.lunch, meals.diner, ...meals.tussendoortje];

  return ids.reduce((totals, id) => {
    const recipe = getRecipeById(id, settings);
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
  { key: 'phosphorus', label: 'Fosfor', unit: 'mg' },
  { key: 'zinc', label: 'Zink', unit: 'mg' },
  { key: 'vitaminC', label: 'Vitamine C', unit: 'mg' },
  { key: 'vitaminA', label: 'Vitamine A', unit: 'µg' },
  { key: 'folate', label: 'Foliumzuur', unit: 'µg' },
  { key: 'vitaminB12', label: 'Vitamine B12', unit: 'µg' },
  { key: 'vitaminD', label: 'Vitamine D', unit: 'µg' },
  { key: 'selenium', label: 'Selenium', unit: 'µg' },
  { key: 'iodine', label: 'Jodium', unit: 'µg' },
];

export interface MacroMeta {
  key: keyof DailyTotals;
  label: string;
  unit: string;
  color: string;
}
