import type { Menu } from '../types';

/**
 * Complete, multi-course menus for Plately.
 *
 * A menu groups existing recipes (see ./recipes.ts) into courses so it can be
 * presented as one cohesive whole. Every dish is a normal recipe, so it keeps
 * its own detail screen, scaling and nutrition — the menu only adds structure.
 *
 * To add a menu: append an object below and reference dish ids from recipes.ts.
 */

export const menus: Menu[] = [
  {
    id: 'menu-zuid-afrikaanse-bbq',
    title: 'Zuid-Afrikaans BBQ-menu',
    subtitle: 'Vijfgangen barbecue, warm en kruidig',
    baseServings: 4,
    tags: ['BBQ', 'Gezond'],
    courses: [
      {
        type: 'welkom',
        title: 'Aperitief',
        recipeIds: ['bbq-za-mocktail'],
      },
      {
        type: 'voorgerecht',
        title: 'Voorgerecht',
        recipeIds: ['bbq-za-mielie-fritters'],
      },
      {
        type: 'hoofdgerecht',
        title: 'Hoofdgerechten',
        recipeIds: [
          'bbq-za-boerewors',
          'bbq-za-cape-malay-kip',
          'bbq-za-sosaties',
        ],
      },
      {
        type: 'bijgerecht',
        title: 'Bijgerechten',
        recipeIds: [
          'bbq-za-groenten',
          'bbq-za-aardappel',
          'bbq-za-perzik-salade',
        ],
      },
      {
        type: 'nagerecht',
        title: 'Nagerecht',
        recipeIds: ['bbq-za-banaan'],
      },
    ],
  },
];

// Menus can be loaded from Supabase (with the array above as the fallback).
// The lookups live in the content store; re-exported here so existing imports
// of `getMenuById` / `getCourseForRecipe` / `getMenus` keep working.
export { getMenuById, getCourseForRecipe, getMenus } from './content';
