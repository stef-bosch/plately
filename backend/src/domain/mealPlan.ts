import type { SystemConfig } from './config';
import { applyDayCorrection, computeDayHealth, type ScaledMeal } from './dayCorrection';
import { splitDayTargets } from './mealSplit';
import { roundNutrition } from './nutrition';
import type { FoodItemIndex, MacroTarget, MealType, Nutrition, RecipeBlueprint } from './types';
import type { RecipeScaler } from './scaling/RecipeScaler';

export interface MealPick {
  mealType: MealType;
  recipe: RecipeBlueprint;
}

export interface GenerateMealPlanParams {
  targetKcal: number;
  dayMacro: MacroTarget;
  picks: MealPick[];
  foods: FoodItemIndex;
  scaler: RecipeScaler;
  config: SystemConfig;
}

export interface MealPlanResult {
  targetKcal: number;
  actualKcal: number;
  nutrition: Nutrition;
  macroTargets: MacroTarget;
  meals: ScaledMeal[];
  vegetableG: number;
  fruitG: number;
  warnings: string[];
}

/**
 * Scale each picked recipe to its meal target, then run a day-level correction
 * + health check. The heavy lifting stays in the pluggable `RecipeScaler`.
 */
export function generateMealPlan(params: GenerateMealPlanParams): MealPlanResult {
  const { targetKcal, dayMacro, picks, foods, scaler, config } = params;

  const mealTypes = picks.map((p) => p.mealType);
  const mealTargets = splitDayTargets(targetKcal, dayMacro, mealTypes, config);

  const meals: ScaledMeal[] = picks.map((pick, i) => {
    const target = mealTargets[i];
    const result = scaler.scaleRecipeToTarget(pick.recipe, target.kcal, {
      foods,
      config,
      macroTarget: target.macro,
    });
    return { mealType: pick.mealType, recipe: pick.recipe, target, result };
  });

  const { warnings } = applyDayCorrection(meals, targetKcal, dayMacro, foods, scaler, config);
  const health = computeDayHealth(meals, foods);

  return {
    targetKcal,
    actualKcal: Math.round(health.nutrition.kcal),
    nutrition: roundNutrition(health.nutrition),
    macroTargets: dayMacro,
    meals,
    vegetableG: health.vegetableG,
    fruitG: health.fruitG,
    warnings,
  };
}
