// Dishes are stored in Supabase and loaded by the content store (./content).
// The recipe lookups are re-exported here so existing imports of
// `getRecipeById` / `getAllRecipes` keep working unchanged.
export { getRecipeById, getAllRecipes } from './content';
