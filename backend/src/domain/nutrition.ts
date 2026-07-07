import type { FoodItem, FoodItemIndex, Nutrition, RecipeIngredient } from './types';

export function zeroNutrition(): Nutrition {
  return { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0, saltG: 0, saturatedFatG: 0 };
}

export function addNutrition(a: Nutrition, b: Nutrition): Nutrition {
  return {
    kcal: a.kcal + b.kcal,
    proteinG: a.proteinG + b.proteinG,
    carbsG: a.carbsG + b.carbsG,
    fatG: a.fatG + b.fatG,
    fiberG: a.fiberG + b.fiberG,
    saltG: a.saltG + b.saltG,
    saturatedFatG: a.saturatedFatG + b.saturatedFatG,
  };
}

/** Nutrition contributed by a single ingredient at its current amount. */
export function ingredientNutrition(ingredient: RecipeIngredient, food: FoodItem): Nutrition {
  const f = ingredient.amountG / 100;
  return {
    kcal: (food.kcalPer100g ?? 0) * f,
    proteinG: (food.proteinPer100g ?? 0) * f,
    carbsG: (food.carbsPer100g ?? 0) * f,
    fatG: (food.fatPer100g ?? 0) * f,
    fiberG: (food.fiberPer100g ?? 0) * f,
    saltG: (food.saltPer100g ?? 0) * f,
    saturatedFatG: (food.saturatedFatPer100g ?? 0) * f,
  };
}

/** Total nutrition of a set of ingredients, given the food-item index. */
export function calculateRecipeNutrition(
  ingredients: RecipeIngredient[],
  foods: FoodItemIndex,
): Nutrition {
  return ingredients.reduce((acc, ing) => {
    const food = foods.get(ing.foodItemId);
    if (!food) throw new Error(`Missing food item "${ing.foodItemId}" for ingredient "${ing.displayName}"`);
    return addNutrition(acc, ingredientNutrition(ing, food));
  }, zeroNutrition());
}

export function roundNutrition(n: Nutrition): Nutrition {
  return {
    kcal: Math.round(n.kcal),
    proteinG: Math.round(n.proteinG),
    carbsG: Math.round(n.carbsG),
    fatG: Math.round(n.fatG),
    fiberG: Math.round(n.fiberG),
    saltG: Math.round(n.saltG * 10) / 10,
    saturatedFatG: Math.round(n.saturatedFatG * 10) / 10,
  };
}
