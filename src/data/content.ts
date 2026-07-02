import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Menu, MenuCourseType, Recipe, ReactiveRecipe } from '../types';
import {
  DEFAULT_RESOLVE,
  resolveRecipe,
  type ResolveSettings,
} from '../utils/resolveRecipe';

/**
 * Content store for dishes and menus.
 *
 * All content comes from Supabase (the backend is the single source of truth).
 * The store starts empty and is filled by `loadContent` at startup (called from
 * App during the splash), so the synchronous lookups keep working unchanged.
 *
 * Reactive dishes (with energy variants) and static dishes are kept apart; a
 * dish is "reactive" when its data carries an `energy.gemiddeld` variant.
 */

interface DishState {
  staticDishes: Recipe[];
  reactiveDishes: ReactiveRecipe[];
  staticById: Record<string, Recipe>;
  reactiveById: Record<string, ReactiveRecipe>;
}

function byId<T extends { id: string }>(items: T[]): Record<string, T> {
  return items.reduce<Record<string, T>>((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
}

function buildState(
  staticDishes: Recipe[],
  reactiveDishes: ReactiveRecipe[],
): DishState {
  return {
    staticDishes,
    reactiveDishes,
    staticById: byId(staticDishes),
    reactiveById: byId(reactiveDishes),
  };
}

// The store starts empty; it's populated from Supabase by `loadContent`.
let state: DishState = buildState([], []);
function dishState(): DishState {
  return state;
}

interface MenuState {
  menus: Menu[];
  menuById: Record<string, Menu>;
  courseByRecipeId: Record<string, MenuCourseType>;
}

function buildMenuState(menus: Menu[]): MenuState {
  const courseByRecipeId: Record<string, MenuCourseType> = {};
  menus.forEach((menu) =>
    menu.courses.forEach((course) =>
      course.recipeIds.forEach((id) => {
        courseByRecipeId[id] = course.type;
      }),
    ),
  );
  return { menus, menuById: byId(menus), courseByRecipeId };
}

let menus: MenuState = buildMenuState([]);
function menuState(): MenuState {
  return menus;
}

/** True once dishes have been replaced by data loaded from Supabase. */
export let loadedFromBackend = false;

function isReactive(data: unknown): data is ReactiveRecipe {
  return (
    typeof data === 'object' &&
    data !== null &&
    'energy' in data &&
    typeof (data as ReactiveRecipe).energy?.gemiddeld === 'object'
  );
}

/**
 * Loads dishes from Supabase and replaces the bundled set. On any error, or
 * when there are no rows yet, the bundled fallback is kept. Safe to call when
 * Supabase isn't configured (it's a no-op).
 */
export async function loadContent(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const [dishRes, menuRes] = await Promise.all([
      supabase.from('dishes').select('kind, data'),
      supabase.from('menus').select('data'),
    ]);

    const dishRows = dishRes.data as { kind: string; data: unknown }[] | null;
    if (!dishRes.error && dishRows && dishRows.length > 0) {
      const staticDishes: Recipe[] = [];
      const reactiveDishes: ReactiveRecipe[] = [];
      for (const row of dishRows) {
        if (row.kind === 'reactive' && isReactive(row.data)) {
          reactiveDishes.push(row.data);
        } else {
          staticDishes.push(row.data as Recipe);
        }
      }
      state = buildState(staticDishes, reactiveDishes);
      loadedFromBackend = true;
    }

    const menuRows = menuRes.data as { data: Menu }[] | null;
    if (!menuRes.error && menuRows && menuRows.length > 0) {
      menus = buildMenuState(menuRows.map((row) => row.data));
    }
  } catch {
    // Network/down — keep the bundled fallback.
  }
}

/** Re-loads dishes from Supabase (e.g. after an admin edit). */
export async function reloadContent(): Promise<void> {
  await loadContent();
}

/**
 * Resolves a recipe by id. Reactive dishes are collapsed to the right portion
 * for the given settings; static dishes are returned as-is.
 */
export function getRecipeById(
  id: string,
  settings: ResolveSettings = DEFAULT_RESOLVE,
): Recipe | undefined {
  const s = dishState();
  const reactive = s.reactiveById[id];
  if (reactive) return resolveRecipe(reactive, settings);
  return s.staticById[id];
}

/**
 * The full browseable recipe list (reactive dishes + static dishes), resolved
 * for the given settings. Used by the recipe overview.
 */
export function getAllRecipes(
  settings: ResolveSettings = DEFAULT_RESOLVE,
): Recipe[] {
  const s = dishState();
  const resolvedReactive = s.reactiveDishes.map((recipe) =>
    resolveRecipe(recipe, settings),
  );
  return [...resolvedReactive, ...s.staticDishes];
}

/** All menus (from Supabase when loaded, else bundled). */
export function getMenus(): Menu[] {
  return menuState().menus;
}

export function getMenuById(id: string): Menu | undefined {
  return menuState().menuById[id];
}

/** The menu course a dish belongs to, if it's part of a menu. */
export function getCourseForRecipe(id: string): MenuCourseType | undefined {
  return menuState().courseByRecipeId[id];
}
