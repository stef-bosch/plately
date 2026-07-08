import type { ImageSourcePropType } from 'react-native';

import type { Recipe } from '../types';

/**
 * Shared placeholder photo used for every recipe that doesn't define its own
 * `image`. Set a dish's `image` field (in the admin panel) to use a real photo
 * without touching any UI.
 */
export const recipePlaceholder: ImageSourcePropType = require('../assets/placeholder-recipe.png');

/** Returns the recipe's own photo, falling back to the shared placeholder. */
export function getRecipeImage(
  recipe: Pick<Recipe, 'image'>,
): ImageSourcePropType {
  return recipe.image ?? recipePlaceholder;
}
