import type {
  DietaryPreference,
  Nutrition,
  Recipe,
  ReactiveRecipe,
  Settings,
} from '../types';

/** Settings that influence how a reactive recipe resolves. */
export type ResolveSettings = Pick<Settings, 'energyNeed' | 'dietaryPreferences'>;

/** Default resolution: the medium portion. */
export const DEFAULT_RESOLVE: ResolveSettings = {
  energyNeed: 'gemiddeld',
  dietaryPreferences: [],
};

/**
 * Collapses a reactive recipe into a concrete `Recipe` for the given settings.
 * Only the energy need matters here (it picks the portion + nutrition); dietary
 * preferences are handled by filtering the list, not by morphing the recipe.
 */
export function resolveRecipe(
  base: ReactiveRecipe,
  settings: ResolveSettings = DEFAULT_RESOLVE,
): Recipe {
  const energy = base.energy[settings.energyNeed] ?? base.energy.gemiddeld;
  const nutrition: Nutrition = energy.nutrition;

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
    nutrition,
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
