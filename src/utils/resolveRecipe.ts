import type { DietaryPreference, Recipe, ReactiveRecipe } from '../types';

/**
 * Collapses a reactive recipe into a concrete `Recipe`. Reactive dishes carry
 * portion variants; the app shows the medium (`gemiddeld`) portion. Dietary
 * preferences are handled by filtering the list, not by morphing the recipe.
 */
export function resolveRecipe(base: ReactiveRecipe): Recipe {
  const energy = base.energy.gemiddeld;

  return {
    id: base.id,
    title: base.title,
    subtitle: base.subtitle,
    image: base.image,
    mealType: base.mealType,
    seasons: base.seasons,
    baseServings: base.baseServings,
    prepTime: base.prepTime,
    cookTime: base.cookTime,
    tags: base.tags,
    ingredients: energy.ingredients,
    instructions: base.instructions,
    nutrition: energy.nutrition,
    suitableFor: base.suitableFor,
    dietSwaps: base.dietSwaps,
  };
}

/**
 * Whether a recipe satisfies a single dietary preference — either declared
 * outright, reachable via a trivial swap, or (for `vegetarisch`) inferred from
 * the recipe's tags so existing dishes filter sensibly without re-tagging.
 */
export function recipeSatisfiesDiet(
  recipe: Recipe,
  diet: DietaryPreference,
): boolean {
  if (recipe.suitableFor?.includes(diet)) return true;
  if (recipe.dietSwaps?.some((swap) => swap.diet === diet)) return true;
  if (diet === 'vegetarisch' && recipe.tags.includes('Vegetarisch')) return true;
  return false;
}

/** Whether a recipe satisfies every selected dietary preference. */
export function recipeMatchesDiets(
  recipe: Recipe,
  diets: DietaryPreference[],
): boolean {
  return diets.every((diet) => recipeSatisfiesDiet(recipe, diet));
}
