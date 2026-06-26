/**
 * Core domain models for Plately.
 *
 * The data structure is intentionally explicit so that recipes, weekly plans
 * and nutrition values can all be edited or replaced later with minimal effort.
 */

export type MealType = 'ontbijt' | 'lunch' | 'diner' | 'tussendoortje';

export type Season = 'lente-zomer' | 'herfst-winter';

export type WeekDayName =
  | 'maandag'
  | 'dinsdag'
  | 'woensdag'
  | 'donderdag'
  | 'vrijdag'
  | 'zaterdag'
  | 'zondag';

/**
 * Logical groups used to organise an ingredient list on the recipe detail
 * screen. New categories can be added freely; the UI renders whatever is there.
 */
export type IngredientCategory =
  | 'Basis'
  | 'Smaakmakers'
  | 'Marinade'
  | 'Chutney'
  | 'Smoor'
  | 'Saus'
  | 'Topping'
  | 'Dressing'
  | 'Salade'
  | 'Garnering'
  | 'Optioneel';

export type RecipeTag =
  | 'Vegetarisch'
  | 'Eiwitrijk'
  | 'Vezelrijk'
  | 'Meal prep proof'
  | 'Snel klaar'
  | 'Restaurantwaardig'
  | 'Gezond'
  | 'Sportief'
  | 'BBQ'
  | 'Cocktails'
  | 'Sauzen';

export interface Ingredient {
  name: string;
  /**
   * Numeric amount for scalable ingredients (e.g. 85, 0.5).
   * For "to taste" ingredients use a string (e.g. 'naar smaak') and set
   * scalable to false.
   */
  quantity: number | string;
  unit: string;
  /** Optional clarification, e.g. "uitgelekt en afgespoeld". */
  note?: string;
  /** When false the quantity is never multiplied (e.g. peper naar smaak). */
  scalable: boolean;
  /**
   * Optional override for how the base quantity is shown. Useful for things
   * like "½ aubergine" where the raw number (0.5) reads poorly on its own.
   */
  display?: string;
}

export interface IngredientGroup {
  category: IngredientCategory;
  items: Ingredient[];
}

export interface Micronutrients {
  /** mg */
  iron?: number;
  /** mg */
  calcium?: number;
  /** mg */
  potassium?: number;
  /** mg */
  magnesium?: number;
  /** mg */
  vitaminC?: number;
  /** µg */
  vitaminA?: number;
  /** µg */
  folate?: number;
}

export interface Nutrition {
  /** All macro values are per single serving. */
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  micronutrients: Micronutrients;
  /**
   * Indicative flag. The MVP uses recipe-level values; the structure already
   * supports swapping in exact ingredient-level calculations later.
   */
  isIndicative: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  /** Short tagline shown on cards and the detail header. */
  subtitle?: string;
  /**
   * Recipe photo. Use a `require(...)` for a bundled asset or `{ uri }` for a
   * remote image. When omitted the shared placeholder photo is shown.
   */
  image?: import('react-native').ImageSourcePropType;
  mealType: MealType;
  seasons: Season[];
  /** Servings the base ingredient quantities are written for (usually 1). */
  baseServings: number;
  /** Minutes. */
  prepTime: number;
  /** Minutes. */
  cookTime: number;
  tags: RecipeTag[];
  ingredients: IngredientGroup[];
  instructions: string[];
  nutrition: Nutrition;
}

/* ---------- Menus ---------- */

/**
 * A course within a multi-dish menu. `type` drives the icon/emoji and ordering;
 * `recipeIds` reference full recipes in ../data/recipes.ts so each dish keeps
 * its own detail screen, scaling and nutrition.
 */
export type MenuCourseType =
  | 'welkom'
  | 'voorgerecht'
  | 'hoofdgerecht'
  | 'bijgerecht'
  | 'nagerecht';

export interface MenuCourse {
  type: MenuCourseType;
  /** Section heading, e.g. "Hoofdgerechten". */
  title: string;
  recipeIds: string[];
}

/**
 * A complete, multi-course menu shown as one entity. The individual dishes are
 * regular recipes (so they also surface in the recipe list and reuse the recipe
 * detail screen); the menu just groups them into courses.
 */
export interface Menu {
  id: string;
  title: string;
  /** Short tagline shown on the menu card and detail header. */
  subtitle?: string;
  /** Longer intro paragraph shown at the top of the menu detail screen. */
  description?: string;
  image?: import('react-native').ImageSourcePropType;
  /** Servings the menu (and its dishes) are written for. */
  baseServings: number;
  tags: RecipeTag[];
  courses: MenuCourse[];
}

export interface DayMeals {
  ontbijt: string;
  lunch: string;
  tussendoortje: string[];
  diner: string;
}

export interface WeekDay {
  day: WeekDayName;
  meals: DayMeals;
}

export interface WeeklyPlan {
  season: Season;
  days: WeekDay[];
}

/* ---------- Settings ---------- */

export type Goal = 'gezond-eten' | 'spierbehoud' | 'afvallen' | 'aankomen';

export type DietaryPreference =
  | 'vegetarisch'
  | 'glutenvrij'
  | 'lactosevrij'
  | 'notenvrij';

export interface Settings {
  goal: Goal;
  defaultServings: number;
  preferredSeason: Season;
  dietaryPreferences: DietaryPreference[];
  showMicronutrients: boolean;
}
