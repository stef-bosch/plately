import type { Menu, MenuCourseType } from '../types';

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
        title: 'Welkomstmocktail',
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

/** Fast lookup by id, used by the menu detail screen. */
export const menusById: Record<string, Menu> = menus.reduce(
  (acc, menu) => {
    acc[menu.id] = menu;
    return acc;
  },
  {} as Record<string, Menu>,
);

export function getMenuById(id: string): Menu | undefined {
  return menusById[id];
}

/**
 * Maps each dish (recipe id) that appears in a menu to its course type, so the
 * recipe browser can offer course-based filters (aperitief, voorgerecht, …)
 * without duplicating that information onto the recipes themselves.
 */
export const courseByRecipeId: Record<string, MenuCourseType> = menus.reduce(
  (acc, menu) => {
    menu.courses.forEach((course) => {
      course.recipeIds.forEach((id) => {
        acc[id] = course.type;
      });
    });
    return acc;
  },
  {} as Record<string, MenuCourseType>,
);

export function getCourseForRecipe(recipeId: string): MenuCourseType | undefined {
  return courseByRecipeId[recipeId];
}
