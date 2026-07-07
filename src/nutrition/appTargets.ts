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
}

/**
 * Compute the daily kcal + macro target from the in-app profile, reusing the
 * shared calc-engine (Mifflin–St Jeor → TDEE → goal adjustment → macros).
 */
export function computeDailyTarget(
  profile: NutritionProfile,
  config: SystemConfig = DEFAULT_CONFIG,
): DailyTarget {
  const bmr = calculateBmr(profile.sex, profile.weightKg, profile.heightCm, profile.ageYears);
  const tdee = calculateTdee(bmr, profile.activityLevel, config);
  const calculated = tdee + config.goalKcalAdjustments[profile.goal];

  const usingManual = profile.manualKcalTarget != null && profile.manualKcalTarget > 0;
  const targetKcal = usingManual ? (profile.manualKcalTarget as number) : calculated;

  // calculateMacroTargets only reads user.weightKg.
  const macro = calculateMacroTargets(
    { weightKg: profile.weightKg } as User,
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
  };
}
