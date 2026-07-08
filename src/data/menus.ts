// Menus are stored in Supabase and loaded by the content store (./content).
// The lookups are re-exported here so existing imports of `getMenuById` /
// `getCourseForRecipe` / `getMenus` keep working unchanged.
export { getMenuById, getCourseForRecipe, getMenus } from './content';
