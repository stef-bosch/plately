import type { SystemConfig } from './config';
import { addNutrition, ingredientNutrition, zeroNutrition } from './nutrition';
import type { FoodItemIndex, IngredientRole, MacroTarget, Nutrition, RecipeBlueprint } from './types';
import type { RecipeScaler, ScaledRecipeResult } from './scaling/RecipeScaler';
import type { MealTargets } from './mealSplit';

export interface ScaledMeal {
  mealType: MealTargets['mealType'];
  /** The original blueprint, kept so a correction pass can re-scale from base. */
  recipe: RecipeBlueprint;
  target: MealTargets;
  result: ScaledRecipeResult;
}

export interface DayHealth {
  nutrition: Nutrition;
  vegetableG: number;
  fruitG: number;
  nonSchijfKcalShare: number;
}

export function computeDayHealth(meals: ScaledMeal[], foods: FoodItemIndex): DayHealth {
  let nutrition = zeroNutrition();
  let vegetableG = 0;
  let fruitG = 0;
  let nonSchijfKcal = 0;

  for (const meal of meals) {
    for (const ing of meal.result.recipe.ingredients) {
      const food = foods.get(ing.foodItemId);
      if (!food) continue;
      const n = ingredientNutrition(ing, food);
      nutrition = addNutrition(nutrition, n);
      if (ing.role === 'vegetable') vegetableG += ing.amountG;
      if (ing.role === 'fruit') fruitG += ing.amountG;
      if (!food.schijfVanVijf) nonSchijfKcal += n.kcal;
    }
  }

  return {
    nutrition,
    vegetableG: Math.round(vegetableG),
    fruitG: Math.round(fruitG),
    nonSchijfKcalShare: nutrition.kcal > 0 ? nonSchijfKcal / nutrition.kcal : 0,
  };
}

/** Rough kcal headroom a meal still has in a given direction. */
function mealHeadroomKcal(meal: ScaledMeal, direction: 'up' | 'down', foods: FoodItemIndex): number {
  let headroom = 0;
  for (const ing of meal.result.recipe.ingredients) {
    if (!ing.scalable || ing.role === 'flavouring') continue;
    const food = foods.get(ing.foodItemId);
    if (!food) continue;
    const kcalPerG = (food.kcalPer100g ?? 0) / 100;
    if (direction === 'up') {
      const max = ing.maxG ?? Number.POSITIVE_INFINITY;
      if (Number.isFinite(max)) headroom += Math.max(0, max - ing.amountG) * kcalPerG;
    } else {
      const min = ing.minG ?? 0;
      headroom += Math.max(0, ing.amountG - min) * kcalPerG;
    }
  }
  return headroom;
}

/**
 * If the day total drifts outside tolerance, re-scale the meal with the most
 * remaining headroom to absorb the gap. One pass keeps it predictable.
 */
export function applyDayCorrection(
  meals: ScaledMeal[],
  dayTargetKcal: number,
  dayMacro: MacroTarget,
  foods: FoodItemIndex,
  scaler: RecipeScaler,
  config: SystemConfig,
): { meals: ScaledMeal[]; warnings: string[] } {
  const warnings: string[] = [];
  const health = computeDayHealth(meals, foods);
  const gap = dayTargetKcal - health.nutrition.kcal;

  if (Math.abs(gap) > dayTargetKcal * config.kcalTolerance) {
    const direction: 'up' | 'down' = gap > 0 ? 'up' : 'down';
    let bestMeal: ScaledMeal | null = null;
    let bestHeadroom = 0;
    for (const meal of meals) {
      const h = mealHeadroomKcal(meal, direction, foods);
      if (h > bestHeadroom) {
        bestHeadroom = h;
        bestMeal = meal;
      }
    }
    if (bestMeal) {
      const newTarget = Math.round(bestMeal.result.nutrition.kcal + gap);
      bestMeal.result = scaler.scaleRecipeToTarget(bestMeal.recipe, newTarget, {
        foods,
        config,
        macroTarget: bestMeal.target.macro,
      });
    }
  }

  // Re-evaluate after correction and add day-level health warnings.
  const after = computeDayHealth(meals, foods);
  if (Math.abs(dayTargetKcal - after.nutrition.kcal) > dayTargetKcal * config.kcalTolerance) {
    warnings.push('Dagtotaal kcal niet volledig binnen doel gebracht binnen normale porties.');
  }
  if (after.nutrition.proteinG < dayMacro.proteinMinG) {
    warnings.push('Dag-eiwitdoel niet gehaald; overweeg een eiwitrijke snack.');
  }
  if (after.vegetableG < config.day.minVegetableG) {
    warnings.push(`Groente onder ${config.day.minVegetableG} g per dag (${after.vegetableG} g).`);
  }
  if (after.fruitG < config.day.minFruitG) {
    warnings.push(`Fruit onder ${config.day.minFruitG} g per dag (${after.fruitG} g).`);
  }
  if (after.nonSchijfKcalShare > config.day.maxNonSchijfKcalShare) {
    warnings.push('Relatief veel kcal uit niet-Schijf-van-Vijf producten.');
  }

  return { meals, warnings };
}

export function roleGramsAcrossDay(
  meals: ScaledMeal[],
  role: IngredientRole,
): number {
  let g = 0;
  for (const meal of meals) {
    for (const ing of meal.result.recipe.ingredients) {
      if (ing.role === role) g += ing.amountG;
    }
  }
  return Math.round(g);
}
