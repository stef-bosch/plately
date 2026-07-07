import type { MealType as AppMealType, NutritionProfile, Recipe } from '../types';
import { computeDailyTarget } from './appTargets';
import {
  DEFAULT_CONFIG,
  GreedyRecipeScaler,
  type FoodItemIndex,
  type MealType as CoreMealType,
  type RecipeBlueprint,
  type RecipeIngredient,
  type SystemConfig,
} from './core';

const MEALTYPE_MAP: Record<AppMealType, CoreMealType> = {
  ontbijt: 'breakfast',
  lunch: 'lunch',
  diner: 'dinner',
  tussendoortje: 'snack',
};

const scaler = new GreedyRecipeScaler();

export interface PersonalizedIngredient {
  name: string;
  baseG: number;
  scaledG: number;
  changeG: number;
}

export interface PersonalizedRecipe {
  /** True when at least one ingredient carries scaling metadata. */
  scalable: boolean;
  targetKcal: number;
  nutrition: { kcal: number; proteinG: number; carbsG: number; fatG: number };
  changes: PersonalizedIngredient[];
  changesSummary: string[];
  warnings: string[];
}

interface Adapted {
  blueprint: RecipeBlueprint;
  foods: FoodItemIndex;
  scalableCount: number;
}

const FIXED_ID = 'fixed_remainder';

/**
 * Turn an app Recipe into a core RecipeBlueprint. Only ingredients with scaling
 * metadata + a gram amount become scalable components; everything else is folded
 * into one fixed "remainder" ingredient so the recipe's authored per-portion
 * nutrition stays the base.
 */
function adaptRecipe(recipe: Recipe): Adapted {
  const foods: FoodItemIndex = new Map();
  const ings: RecipeIngredient[] = [];
  const scalableBase = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  let counter = 0;
  let scalableCount = 0;

  for (const group of recipe.ingredients) {
    for (const it of group.items) {
      const s = it.scaling;
      const grams = typeof it.quantity === 'number' ? it.quantity : NaN;
      if (s && !Number.isNaN(grams) && grams > 0) {
        const fid = `f${counter}`;
        foods.set(fid, {
          id: fid,
          name: it.name,
          kcalPer100g: s.kcalPer100g,
          proteinPer100g: s.proteinPer100g,
          carbsPer100g: s.carbsPer100g,
          fatPer100g: s.fatPer100g,
          fiberPer100g: null,
          saltPer100g: null,
          saturatedFatPer100g: null,
          foodGroup: s.role,
          schijfVanVijf: false,
        });
        ings.push({
          id: `i${counter}`,
          foodItemId: fid,
          displayName: it.name,
          amountG: grams,
          unit: 'g',
          state: 'raw',
          role: s.role,
          scalable: it.scalable !== false && s.role !== 'flavouring',
          minG: s.minG ?? null,
          maxG: s.maxG ?? null,
          stepG: s.stepG ?? null,
          scalePriorityUp: 0,
          scalePriorityDown: 0,
          scalingGroup: null,
          required: true,
        });
        const f = grams / 100;
        scalableBase.kcal += s.kcalPer100g * f;
        scalableBase.protein += s.proteinPer100g * f;
        scalableBase.carbs += s.carbsPer100g * f;
        scalableBase.fat += s.fatPer100g * f;
        scalableCount++;
      }
      counter++;
    }
  }

  const total = recipe.nutrition;
  foods.set(FIXED_ID, {
    id: FIXED_ID,
    name: 'overige ingrediënten',
    kcalPer100g: Math.max(0, total.calories - scalableBase.kcal),
    proteinPer100g: Math.max(0, total.protein - scalableBase.protein),
    carbsPer100g: Math.max(0, total.carbs - scalableBase.carbs),
    fatPer100g: Math.max(0, total.fat - scalableBase.fat),
    fiberPer100g: null,
    saltPer100g: null,
    saturatedFatPer100g: null,
    foodGroup: 'fixed',
    schijfVanVijf: false,
  });
  ings.push({
    id: FIXED_ID,
    foodItemId: FIXED_ID,
    displayName: 'overige ingrediënten',
    amountG: 100,
    unit: 'g',
    state: 'raw',
    role: 'garnish',
    scalable: false,
    minG: null,
    maxG: null,
    stepG: null,
    scalePriorityUp: 0,
    scalePriorityDown: 0,
    scalingGroup: null,
    required: true,
  });

  return {
    blueprint: {
      id: recipe.id,
      name: recipe.title,
      mealType: MEALTYPE_MAP[recipe.mealType],
      baseServings: 1,
      ingredients: ings,
    },
    foods,
    scalableCount,
  };
}

/** Personalise one recipe to the user's target for that meal. */
export function personalizeRecipe(
  recipe: Recipe,
  profile: NutritionProfile,
  config: SystemConfig = DEFAULT_CONFIG,
): PersonalizedRecipe {
  const { blueprint, foods, scalableCount } = adaptRecipe(recipe);
  const day = computeDailyTarget(profile, config);

  const share = config.mealSplit[blueprint.mealType] ?? 0.3;
  const mealKcal = Math.round(day.targetKcal * share);
  const mealMacro = {
    proteinG: Math.round(day.macro.proteinG * share),
    carbsG: Math.round(day.macro.carbsG * share),
    fatG: Math.round(day.macro.fatG * share),
    proteinMinG: Math.round(day.macro.proteinMinG * share * 0.9),
  };

  const result = scaler.scaleRecipeToTarget(blueprint, mealKcal, { foods, config, macroTarget: mealMacro });

  const changes: PersonalizedIngredient[] = result.changes
    .filter((c) => c.ingredientId !== FIXED_ID && Math.abs(c.changeG) >= 0.5)
    .map((c) => ({ name: c.name, baseG: c.baseAmountG, scaledG: c.scaledAmountG, changeG: c.changeG }));

  return {
    scalable: scalableCount > 0,
    targetKcal: mealKcal,
    nutrition: {
      kcal: Math.round(result.nutrition.kcal),
      proteinG: Math.round(result.nutrition.proteinG),
      carbsG: Math.round(result.nutrition.carbsG),
      fatG: Math.round(result.nutrition.fatG),
    },
    changes,
    changesSummary: result.changesSummary.filter((s) => !s.toLowerCase().includes('overige')),
    warnings: result.warnings,
  };
}
