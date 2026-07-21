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
  | 'Optioneel'
  // Admins can type any custom heading (e.g. "Voor de bowl"); the UI renders
  // whatever string is stored. This keeps the literals above as suggestions.
  | (string & {});

export type RecipeTag =
  | 'Vegetarisch'
  | 'Vegan'
  | 'Lactosevrij'
  | 'Glutenvrij'
  | 'Notenvrij'
  | 'Halal'
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
  phosphorus?: number;
  /** mg */
  zinc?: number;
  /** mg */
  vitaminC?: number;
  /** µg */
  vitaminA?: number;
  /** µg */
  folate?: number;
  /** µg */
  vitaminB12?: number;
  /** µg */
  vitaminD?: number;
  /** µg */
  selenium?: number;
  /** µg */
  iodine?: number;
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
  /** Diets this dish satisfies as written (used by the recipe filter). */
  suitableFor?: DietaryPreference[];
  /** Diets reachable via one trivial swap, shown as a hint on the detail. */
  dietSwaps?: DietSwap[];
  /**
   * Free-text "Overig" category (e.g. "Cocktail", "Saus", "Smoothie"). When set,
   * the dish lives under the app's "Overig" tab instead of the normal dish list,
   * and the value feeds that tab's category filter (added automatically as new
   * categories appear). Empty/undefined means a normal dish.
   */
  overigCategory?: string;
}

/* ---------- Menus ---------- */

/**
 * A course within a multi-dish menu. `type` drives the icon/emoji and ordering;
 * `recipeIds` reference full dishes (stored in Supabase) so each keeps its own
 * detail screen, scaling and nutrition.
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

/** The meal slots a week-menu day can hold. */
export type MealSlot = 'ontbijt' | 'lunch' | 'diner' | 'tussendoortje';

/**
 * A week menu assembled by hand in the admin, stored per ISO week. Weeks
 * without a stored menu fall back to the automatically generated plan.
 */
export interface StoredWeekMenu {
  /** ISO week id, e.g. "2026-W30". */
  id: string;
  year: number;
  week: number;
  days: Record<WeekDayName, DayMeals>;
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

export type DietaryPreference =
  | 'vegetarisch'
  | 'vegan'
  | 'lactosevrij'
  | 'glutenvrij'
  | 'halal';

/* Fields the nutrition calc-engine needs to personalise portions. */
export type BodySex = 'male' | 'female' | 'other';
export type CalcActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';
export type CalcGoal = 'maintain' | 'lose' | 'gain' | 'muscle_gain';
export type ProteinProfile = 'standard' | 'active' | 'muscle';

export interface NutritionProfile {
  sex: BodySex;
  ageYears: number;
  heightCm: number;
  weightKg: number;
  activityLevel: CalcActivityLevel;
  goal: CalcGoal;
  proteinProfile: ProteinProfile;
  /** When set (>0) it overrides the calculated kcal target. */
  manualKcalTarget: number | null;
}

export interface Settings {
  defaultServings: number;
  preferredSeason: Season;
  dietaryPreferences: DietaryPreference[];
  /** Body/goal data used to compute the daily kcal + macro targets. */
  nutritionProfile: NutritionProfile;
}

/* ---------- Reactive recipes ---------- */

/**
 * A recipe authored with several portion sizes. Dietary preferences are NOT
 * used to morph the recipe; instead a recipe declares which diets it suits
 * (as-is or via a trivial swap shown as a hint), and the recipe browser filters
 * on that. `resolveRecipe` collapses one of these into a plain `Recipe` for the
 * UI, using the medium (`gemiddeld`) portion.
 */

/** The portion sizes a reactive recipe can be authored for. */
export type EnergyNeed = 'laag' | 'gemiddeld' | 'hoog';

/** One full ingredient + nutrition set for a single energy level. */
export interface EnergyVariant {
  ingredients: IngredientGroup[];
  nutrition: Nutrition;
}

/**
 * A diet a recipe can satisfy with one simple, like-for-like swap (e.g. gluten
 * free bread). The recipe still counts as suitable for that diet; the hint just
 * tells the user what to swap. Nutrition is not recalculated.
 */
export interface DietSwap {
  diet: DietaryPreference;
  hint: string;
}

export interface ReactiveRecipe {
  id: string;
  title: string;
  subtitle?: string;
  image?: import('react-native').ImageSourcePropType;
  mealType: MealType;
  seasons: Season[];
  baseServings: number;
  prepTime: number;
  cookTime: number;
  tags: RecipeTag[];
  instructions: string[];
  /** Ingredients + nutrition per energy level. */
  energy: Record<EnergyNeed, EnergyVariant>;
  /** Diets the recipe satisfies as written. */
  suitableFor: DietaryPreference[];
  /** Diets reachable via one trivial swap, shown as a hint. */
  dietSwaps?: DietSwap[];
}
