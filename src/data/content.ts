import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type {
  Menu,
  MenuCourseType,
  Recipe,
  ReactiveRecipe,
  StoredWeekMenu,
} from '../types';
import { resolveRecipe } from '../utils/resolveRecipe';

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

/** Hand-built week menus by ISO week id ("2026-W30"). */
let weekMenus: Record<string, StoredWeekMenu> = {};

/** The stored week menu for an ISO week id, if one was built in the admin. */
export function getStoredWeekMenu(id: string): StoredWeekMenu | undefined {
  return weekMenus[id];
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

const EMPTY_NUTRITION = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  micronutrients: {},
  isIndicative: true,
};

/**
 * Defensive fill for a dish coming from the backend so a partially-formed row
 * can't crash a screen. The stored fields win; only missing ones get defaults.
 */
function normalizeRecipe(data: unknown): Recipe {
  const r = (data ?? {}) as Partial<Recipe>;
  return {
    ...(r as Recipe),
    seasons: Array.isArray(r.seasons) && r.seasons.length ? r.seasons : ['lente-zomer'],
    tags: Array.isArray(r.tags) ? r.tags : [],
    ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
    instructions: Array.isArray(r.instructions) ? r.instructions : [],
    prepTime: typeof r.prepTime === 'number' ? r.prepTime : 0,
    cookTime: typeof r.cookTime === 'number' ? r.cookTime : 0,
    baseServings: typeof r.baseServings === 'number' ? r.baseServings : 1,
    nutrition: r.nutrition ? { ...EMPTY_NUTRITION, ...r.nutrition } : EMPTY_NUTRITION,
  };
}

/**
 * Loads dishes and menus from Supabase into the content store. On any error, or
 * when there are no rows yet, the store keeps whatever it already had (empty on
 * first load). Safe to call when Supabase isn't configured (it's a no-op).
 */
export async function loadContent(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const [dishRes, menuRes, weekRes] = await Promise.all([
      supabase.from('dishes').select('kind, data'),
      supabase.from('menus').select('data'),
      // The week_menus table is optional; a missing table just means no
      // hand-built weeks yet, so the generated plan keeps being used.
      supabase.from('week_menus').select('id, data'),
    ]);

    const dishRows = dishRes.data as { kind: string; data: unknown }[] | null;
    if (!dishRes.error && dishRows && dishRows.length > 0) {
      const staticDishes: Recipe[] = [];
      const reactiveDishes: ReactiveRecipe[] = [];
      for (const row of dishRows) {
        if (row.kind === 'reactive' && isReactive(row.data)) {
          reactiveDishes.push(row.data);
        } else {
          staticDishes.push(normalizeRecipe(row.data));
        }
      }
      state = buildState(staticDishes, reactiveDishes);
      loadedFromBackend = true;
    }

    const menuRows = menuRes.data as { data: Menu }[] | null;
    if (!menuRes.error && menuRows && menuRows.length > 0) {
      menus = buildMenuState(menuRows.map((row) => row.data));
    }

    const weekRows = weekRes.data as { id: string; data: StoredWeekMenu }[] | null;
    if (!weekRes.error && weekRows) {
      weekMenus = weekRows.reduce<Record<string, StoredWeekMenu>>((acc, row) => {
        if (row.data) acc[row.id] = row.data;
        return acc;
      }, {});
    }
  } catch {
    // Network/down — keep whatever is already loaded.
  }
}

/** Re-loads dishes from Supabase (e.g. after an admin edit). */
export async function reloadContent(): Promise<void> {
  await loadContent();
}

/**
 * Resolves a recipe by id. Reactive dishes are collapsed to their portion;
 * static dishes are returned as-is.
 */
export function getRecipeById(id: string): Recipe | undefined {
  const s = dishState();
  const reactive = s.reactiveById[id];
  if (reactive) return resolveRecipe(reactive);
  return s.staticById[id];
}

/**
 * The browseable recipe library. Concepts are left out so unfinished recipes
 * don't surface in the app; `getRecipeById` still resolves them, so a recipe
 * that is explicitly planned keeps rendering.
 */
export function getAllRecipes(): Recipe[] {
  const s = dishState();
  const resolvedReactive = s.reactiveDishes.map((recipe) => resolveRecipe(recipe));
  return [...resolvedReactive, ...s.staticDishes].filter((r) => r.status !== 'concept');
}

/** All menus loaded from Supabase (empty until loadContent runs). */
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
