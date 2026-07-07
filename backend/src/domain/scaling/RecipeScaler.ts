import type { SystemConfig } from '../config';
import type {
  FoodItemIndex,
  IngredientRole,
  MacroTarget,
  Nutrition,
  RecipeBlueprint,
} from '../types';

/** One possible scaling move for a single ingredient. */
export interface ScaleCandidate {
  ingredientId: string;
  direction: 'up' | 'down';
  stepG: number;
  role: IngredientRole;
  estimatedKcalDelta: number;
  resultingAmountG: number;
  valid: boolean;
}

export interface IngredientChange {
  ingredientId: string;
  name: string;
  baseAmountG: number;
  scaledAmountG: number;
  changeG: number;
}

export interface ScaledRecipeResult {
  recipe: RecipeBlueprint;
  nutrition: Nutrition;
  changes: IngredientChange[];
  changesSummary: string[];
  warnings: string[];
  /** Number of scaling steps applied — handy for diagnostics. */
  iterations: number;
}

export interface ScalingContext {
  foods: FoodItemIndex;
  config: SystemConfig;
  /** Macro goals for this meal (or the day) — protects protein/macro balance. */
  macroTarget?: MacroTarget;
}

/**
 * The pluggable contract. `GreedyRecipeScaler` is the first implementation; a
 * `LinearProgrammingRecipeScaler` / `MixedIntegerRecipeScaler` can be dropped in
 * later without touching callers.
 */
export interface RecipeScaler {
  scaleRecipeToTarget(
    recipe: RecipeBlueprint,
    targetKcal: number,
    context: ScalingContext,
  ): ScaledRecipeResult;
}
