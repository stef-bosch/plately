import { resolveConfig, type SystemConfig } from '../domain/config';
import { generateMealPlan, type MealPick, type MealPlanResult } from '../domain/mealPlan';
import { roundNutrition } from '../domain/nutrition';
import { calculateUserTarget, type TargetOptions } from '../domain/targets';
import type { MacroTarget, MealType, RecipeBlueprint, User } from '../domain/types';
import { GreedyRecipeScaler } from '../domain/scaling';
import type { ScaledRecipeResult } from '../domain/scaling/RecipeScaler';
import type { DataRepository } from '../data/repository';

const scaler = new GreedyRecipeScaler();

/** Shape of the scaled-recipe API response (spec §15). */
export interface ScaleOutput {
  recipe_id: string;
  name: string;
  target_kcal: number;
  actual_kcal: number;
  nutrition: { kcal: number; protein_g: number; carbs_g: number; fat_g: number };
  ingredients: { name: string; base_amount_g: number; scaled_amount_g: number; change_g: number }[];
  changes_summary: string[];
  warnings: string[];
}

export function toScaleOutput(
  recipe: RecipeBlueprint,
  targetKcal: number,
  result: ScaledRecipeResult,
): ScaleOutput {
  const n = roundNutrition(result.nutrition);
  return {
    recipe_id: recipe.id,
    name: recipe.name,
    target_kcal: Math.round(targetKcal),
    actual_kcal: n.kcal,
    nutrition: { kcal: n.kcal, protein_g: n.proteinG, carbs_g: n.carbsG, fat_g: n.fatG },
    ingredients: result.changes.map((c) => ({
      name: c.name,
      base_amount_g: c.baseAmountG,
      scaled_amount_g: c.scaledAmountG,
      change_g: c.changeG,
    })),
    changes_summary: result.changesSummary,
    warnings: result.warnings,
  };
}

export async function calculateTarget(
  repo: DataRepository,
  userId: string,
  options: TargetOptions & { config?: Partial<SystemConfig> } = {},
) {
  const user = await repo.getUser(userId);
  if (!user) return null;
  const config = resolveConfig(options.config);
  const t = calculateUserTarget(user, config, options);
  return {
    bmr: t.bmr,
    tdee: t.tdee,
    target_kcal: t.targetKcal,
    source: t.source,
    macro_targets: {
      protein_g: t.macroTargets.proteinG,
      carbs_g: t.macroTargets.carbsG,
      fat_g: t.macroTargets.fatG,
      protein_min_g: t.macroTargets.proteinMinG,
    },
  };
}

export async function scaleRecipe(
  repo: DataRepository,
  recipeId: string,
  targetKcal: number,
  macroTarget?: MacroTarget,
  configOverride?: Partial<SystemConfig>,
): Promise<ScaleOutput | null> {
  const recipe = await repo.getRecipe(recipeId);
  if (!recipe) return null;
  const foods = await repo.foodIndex();
  const config = resolveConfig(configOverride);
  const result = scaler.scaleRecipeToTarget(recipe, targetKcal, { foods, config, macroTarget });
  return toScaleOutput(recipe, targetKcal, result);
}

export interface MealPlanRequest {
  userId: string;
  date?: string;
  targetKcal?: number;
  meals?: MealType[];
  recipeIdsByMeal?: Partial<Record<MealType, string>>;
  excludedIngredients?: string[];
  config?: Partial<SystemConfig>;
}

const DEFAULT_MEALS: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner'];

/** Pick a recipe per requested meal — explicit id first, else first match. */
async function pickRecipes(
  repo: DataRepository,
  meals: MealType[],
  request: MealPlanRequest,
  user: User,
): Promise<MealPick[]> {
  const recipes = await repo.listRecipes();
  const excludedFoodIds = new Set(request.excludedIngredients ?? []);
  const dislikes = new Set(user.dislikedIngredients);

  const picks: MealPick[] = [];
  for (const mealType of meals) {
    const explicitId = request.recipeIdsByMeal?.[mealType];
    let recipe = explicitId ? recipes.find((r) => r.id === explicitId) : undefined;
    if (!recipe) {
      recipe = recipes.find(
        (r) =>
          r.mealType === mealType &&
          !r.ingredients.some((i) => excludedFoodIds.has(i.foodItemId) || dislikes.has(i.foodItemId)),
      );
    }
    if (recipe) picks.push({ mealType, recipe });
  }
  return picks;
}

export async function generatePlan(
  repo: DataRepository,
  request: MealPlanRequest,
): Promise<
  | ({ date?: string; actual_kcal: number; meals: unknown[] } & Record<string, unknown>)
  | null
> {
  const user = await repo.getUser(request.userId);
  if (!user) return null;

  const config = resolveConfig(request.config);
  const foods = await repo.foodIndex();
  const meals = request.meals ?? DEFAULT_MEALS;

  const target = calculateUserTarget(user, config);
  const targetKcal = request.targetKcal ?? target.targetKcal;
  const dayMacro = target.macroTargets;

  const picks = await pickRecipes(repo, meals, request, user);
  const plan: MealPlanResult = generateMealPlan({
    targetKcal,
    dayMacro,
    picks,
    foods,
    scaler,
    config,
  });

  // Persist each scaled meal.
  for (const meal of plan.meals) {
    await repo.saveScaledMealOutput({
      userId: user.id,
      recipeId: meal.recipe.id,
      targetKcal: meal.target.kcal,
      actualKcal: Math.round(meal.result.nutrition.kcal),
      protein: Math.round(meal.result.nutrition.proteinG),
      carbs: Math.round(meal.result.nutrition.carbsG),
      fat: Math.round(meal.result.nutrition.fatG),
      scaledIngredients: meal.result.changes,
    });
  }

  return {
    date: request.date,
    target_kcal: plan.targetKcal,
    actual_kcal: plan.actualKcal,
    macro_targets: {
      protein_g: dayMacro.proteinG,
      carbs_g: dayMacro.carbsG,
      fat_g: dayMacro.fatG,
    },
    nutrition: {
      kcal: plan.nutrition.kcal,
      protein_g: plan.nutrition.proteinG,
      carbs_g: plan.nutrition.carbsG,
      fat_g: plan.nutrition.fatG,
    },
    vegetable_g: plan.vegetableG,
    fruit_g: plan.fruitG,
    meals: plan.meals.map((m) => ({
      meal_type: m.mealType,
      ...toScaleOutput(m.recipe, m.target.kcal, m.result),
    })),
    warnings: plan.warnings,
  };
}
