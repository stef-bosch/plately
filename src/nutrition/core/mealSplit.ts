import type { SystemConfig } from './config';
import { DEFAULT_CONFIG } from './config';
import type { MacroTarget, MealType } from './types';

export interface MealTargets {
  mealType: MealType;
  kcal: number;
  macro: MacroTarget;
}

/**
 * Split a day's kcal + macro goals across the requested meals. Macros are split
 * proportionally to each meal's kcal share; the split percentages are
 * renormalised when only a subset of meals is used.
 */
export function splitDayTargets(
  dayKcal: number,
  dayMacro: MacroTarget,
  meals: MealType[],
  config: SystemConfig = DEFAULT_CONFIG,
): MealTargets[] {
  const totalShare = meals.reduce((s, m) => s + (config.mealSplit[m] ?? 0), 0) || 1;

  return meals.map((mealType) => {
    const share = (config.mealSplit[mealType] ?? 0) / totalShare;
    const kcal = Math.round(dayKcal * share);
    return {
      mealType,
      kcal,
      macro: {
        proteinG: Math.round(dayMacro.proteinG * share),
        carbsG: Math.round(dayMacro.carbsG * share),
        fatG: Math.round(dayMacro.fatG * share),
        proteinMinG: Math.round(dayMacro.proteinMinG * share * 0.9),
      },
    };
  });
}
