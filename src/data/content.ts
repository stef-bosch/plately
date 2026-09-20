import type { Recipe } from '../types';
import { BUNDLED_DISHES } from './dishes.generated';
import { DISH_IMAGES } from './dishImages';

/**
 * Standalone content store.
 *
 * Dishes are bundled with the app (see `dishes.generated.ts`) — there is no
 * backend. Each dish's photo lives in `dishImages.ts` and is attached here by
 * id at module load, so the synchronous lookups below keep working unchanged.
 */

const dishes: Recipe[] = BUNDLED_DISHES.map((d) => {
  const image = DISH_IMAGES[d.id];
  return image ? { ...d, image } : d;
});

const byId: Record<string, Recipe> = dishes.reduce<Record<string, Recipe>>(
  (acc, d) => {
    acc[d.id] = d;
    return acc;
  },
  {},
);

/** Resolves a recipe by id (undefined when it doesn't exist). */
export function getRecipeById(id: string): Recipe | undefined {
  return byId[id];
}

/**
 * The browseable recipe library. Concept dishes are left out so unfinished
 * recipes don't surface; everything bundled today is published, but the filter
 * stays so a future concept dish won't appear before it's ready.
 */
export function getAllRecipes(): Recipe[] {
  return dishes.filter((r) => r.status !== 'concept');
}
