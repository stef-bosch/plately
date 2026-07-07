import type { ActivityLevel, Goal, IngredientRole, MealType } from './types';

/**
 * All tunable numbers live here so the model can be re-calibrated without
 * touching the algorithm. `DEFAULT_CONFIG` is a sensible starting point; callers
 * may pass a partial override (see `resolveConfig`).
 */
export interface SystemConfig {
  /** BMR → TDEE multipliers. */
  activityFactors: Record<ActivityLevel, number>;
  /** kcal added/removed on top of TDEE per goal. */
  goalKcalAdjustments: Record<Goal, number>;
  /** Share of the day's kcal per meal (should sum to ~1). */
  mealSplit: Record<MealType, number>;
  /** Protein grams per kg bodyweight per profile. */
  proteinPerKgProfiles: {
    standard: number;
    active: number;
    muscle: number;
  };
  /** Default profile used when none is given. */
  defaultProteinProfile: keyof SystemConfig['proteinPerKgProfiles'];
  /** Fraction of kcal from fat (mid-point of a 25–30% band by default). */
  fatKcalFraction: number;
  /** kcal per gram of each macro. */
  kcalPerGram: { protein: number; carbs: number; fat: number };
  /** Acceptable kcal deviation from target (fraction). */
  kcalTolerance: number;
  /** Safety cap on greedy iterations. */
  maxIterations: number;
  /** Score weights (lower score = better candidate). */
  scoreWeights: {
    kcalError: number;
    macro: number;
    portion: number;
    realism: number;
    deviationFromBase: number;
    rolePriorityBonus: number;
    schijfVanVijf: number;
    salt: number;
    saturatedFat: number;
  };
  /** Bonus for scaling this role UP when we need more kcal. */
  rolePriorityUp: Record<IngredientRole, number>;
  /** Bonus for scaling this role DOWN when we have too many kcal. */
  rolePriorityDown: Record<IngredientRole, number>;
  /**
   * How far (relative to the base amount) a role may drift before the realism
   * penalty kicks in — protects dish identity (sauces, veg, fruit stay close).
   */
  identityRelChange: Record<IngredientRole, number>;
  /** Day-level health checks. */
  day: {
    minVegetableG: number;
    minFruitG: number;
    maxNonSchijfKcalShare: number;
  };
}

export const DEFAULT_CONFIG: SystemConfig = {
  activityFactors: {
    sedentary: 1.35,
    light: 1.45,
    moderate: 1.55,
    active: 1.7,
    very_active: 1.85,
  },
  goalKcalAdjustments: {
    maintain: 0,
    lose: -300,
    gain: 250,
    muscle_gain: 300,
  },
  mealSplit: {
    breakfast: 0.25,
    lunch: 0.3,
    snack: 0.1,
    dinner: 0.35,
  },
  proteinPerKgProfiles: {
    standard: 1.1,
    active: 1.6,
    muscle: 1.8,
  },
  defaultProteinProfile: 'active', // 1.4 g/kg lands between standard/active; see resolveProteinPerKg
  fatKcalFraction: 0.275,
  kcalPerGram: { protein: 4, carbs: 4, fat: 9 },
  kcalTolerance: 0.03,
  maxIterations: 200,
  scoreWeights: {
    kcalError: 1.0,
    macro: 1.5,
    portion: 2.0,
    realism: 3.0,
    deviationFromBase: 1.0,
    rolePriorityBonus: 1.0,
    schijfVanVijf: 0.5,
    salt: 0.5,
    saturatedFat: 0.5,
  },
  rolePriorityUp: {
    carb_base: 1.0,
    protein_base: 0.9,
    fat_source: 0.7,
    dairy_sauce: 0.6,
    sauce_base: 0.4,
    vegetable: 0.3,
    fruit: 0.3,
    optional_topping: 0.3,
    garnish: 0.2,
    liquid: 0.1,
    flavouring: 0.0,
  },
  rolePriorityDown: {
    fat_source: 1.0,
    carb_base: 0.8,
    dairy_sauce: 0.5,
    protein_base: 0.5,
    sauce_base: 0.4,
    optional_topping: 0.4,
    fruit: 0.3,
    garnish: 0.3,
    liquid: 0.2,
    vegetable: 0.05,
    flavouring: 0.0,
  },
  identityRelChange: {
    carb_base: 1.5,
    protein_base: 1.2,
    fat_source: 1.0,
    liquid: 0.6,
    dairy_sauce: 0.6,
    fruit: 0.6,
    optional_topping: 0.6,
    sauce_base: 0.5,
    garnish: 0.4,
    vegetable: 0.7,
    flavouring: 0.15,
  },
  day: {
    minVegetableG: 250,
    minFruitG: 200,
    maxNonSchijfKcalShare: 0.3,
  },
};

/** Deep-ish merge of a partial override onto the defaults. */
export function resolveConfig(override?: DeepPartial<SystemConfig>): SystemConfig {
  if (!override) return DEFAULT_CONFIG;
  return {
    ...DEFAULT_CONFIG,
    ...override,
    activityFactors: { ...DEFAULT_CONFIG.activityFactors, ...override.activityFactors },
    goalKcalAdjustments: { ...DEFAULT_CONFIG.goalKcalAdjustments, ...override.goalKcalAdjustments },
    mealSplit: { ...DEFAULT_CONFIG.mealSplit, ...override.mealSplit },
    proteinPerKgProfiles: { ...DEFAULT_CONFIG.proteinPerKgProfiles, ...override.proteinPerKgProfiles },
    kcalPerGram: { ...DEFAULT_CONFIG.kcalPerGram, ...override.kcalPerGram },
    scoreWeights: { ...DEFAULT_CONFIG.scoreWeights, ...override.scoreWeights },
    rolePriorityUp: { ...DEFAULT_CONFIG.rolePriorityUp, ...override.rolePriorityUp },
    rolePriorityDown: { ...DEFAULT_CONFIG.rolePriorityDown, ...override.rolePriorityDown },
    identityRelChange: { ...DEFAULT_CONFIG.identityRelChange, ...override.identityRelChange },
    day: { ...DEFAULT_CONFIG.day, ...override.day },
  };
}

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K] };
