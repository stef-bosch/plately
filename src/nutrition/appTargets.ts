import type { NutritionProfile } from '../types';
import {
  DEFAULT_CONFIG,
  calculateBmr,
  calculateMacroTargets,
  calculateTdee,
  type MacroTarget,
  type SystemConfig,
  type User,
} from './core';

export interface DailyTarget {
  bmr: number;
  tdee: number;
  targetKcal: number;
  source: 'manual' | 'calculated';
  macro: MacroTarget;
  /** False until the personal data needed to compute a target is filled in. */
  complete: boolean;
}

const EMPTY_MACRO: MacroTarget = { proteinG: 0, carbsG: 0, fatG: 0, proteinMinG: 0 };
const EMPTY_TARGET: DailyTarget = {
  bmr: 0,
  tdee: 0,
  targetKcal: 0,
  source: 'calculated',
  macro: EMPTY_MACRO,
  complete: false,
};

/**
 * Compute the daily kcal + macro target from the in-app profile, reusing the
 * shared calc-engine (Mifflin–St Jeor → TDEE → goal adjustment → macros).
 * Returns an incomplete (zeroed) target until the personal data is filled in.
 */
export function computeDailyTarget(
  profile: NutritionProfile,
  config: SystemConfig = DEFAULT_CONFIG,
): DailyTarget {
  const { sex, ageYears, heightCm, weightKg } = profile;
  if (sex == null || ageYears == null || heightCm == null || weightKg == null) {
    return EMPTY_TARGET;
  }

  const bmr = calculateBmr(sex, weightKg, heightCm, ageYears);
  const tdee = calculateTdee(bmr, profile.activityLevel, config);
  const calculated = tdee + config.goalKcalAdjustments[profile.goal];

  const usingManual = profile.manualKcalTarget != null && profile.manualKcalTarget > 0;
  const targetKcal = usingManual ? (profile.manualKcalTarget as number) : calculated;

  // calculateMacroTargets only reads user.weightKg.
  const macro = calculateMacroTargets(
    { weightKg } as User,
    targetKcal,
    config,
    profile.proteinProfile,
  );

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetKcal: Math.round(targetKcal),
    source: usingManual ? 'manual' : 'calculated',
    macro,
    complete: true,
  };
}
