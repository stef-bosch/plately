// Pure domain model — no framework/ORM types leak in here so the calc engine
// stays testable and portable.

export type Sex = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'maintain' | 'lose' | 'gain' | 'muscle_gain';
export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner';
export type IngredientState = 'raw' | 'cooked' | 'dry' | 'drained' | 'prepared';

/** The role an ingredient plays in a dish — this drives how it may be scaled. */
export type IngredientRole =
  | 'carb_base'
  | 'protein_base'
  | 'fat_source'
  | 'vegetable'
  | 'fruit'
  | 'dairy_sauce'
  | 'sauce_base'
  | 'flavouring'
  | 'garnish'
  | 'liquid'
  | 'optional_topping';

export interface User {
  id: string;
  sex: Sex;
  birthDate: string; // ISO date
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  manualKcalTarget?: number | null;
  dietaryPreferences: string[];
  allergies: string[];
  dislikedIngredients: string[];
}

export interface FoodItem {
  id: string;
  name: string;
  kcalPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g?: number | null;
  saltPer100g?: number | null;
  saturatedFatPer100g?: number | null;
  foodGroup: string;
  /** Whether the item counts as a "Schijf van Vijf" healthy staple. */
  schijfVanVijf: boolean;
  source?: string;
}

export interface RecipeIngredient {
  id: string;
  foodItemId: string;
  displayName: string;
  amountG: number;
  unit: string;
  state: IngredientState;
  role: IngredientRole;
  scalable: boolean;
  minG?: number | null;
  maxG?: number | null;
  stepG?: number | null;
  scalePriorityUp: number;
  scalePriorityDown: number;
  scalingGroup?: string | null;
  required: boolean;
  notes?: string | null;
}

/** A base recipe for one person at normal portions. */
export interface RecipeBlueprint {
  id: string;
  name: string;
  mealType: MealType;
  cuisine?: string;
  season?: string[];
  baseServings: number;
  ingredients: RecipeIngredient[];
  activeTimeMinutes?: number;
  totalTimeMinutes?: number;
  tags?: string[];
  description?: string;
  instructions?: string[];
  wasteFreeTip?: string;
  tasteBalance?: string;
}

export interface Nutrition {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  saltG: number;
  saturatedFatG: number;
}

/** Macro goals for a day or a single meal. */
export interface MacroTarget {
  proteinG: number;
  carbsG: number;
  fatG: number;
  /** Soft minimum protein used to protect the protein goal while scaling. */
  proteinMinG: number;
}

/** A convenient lookup of food items by id. */
export type FoodItemIndex = Map<string, FoodItem>;
