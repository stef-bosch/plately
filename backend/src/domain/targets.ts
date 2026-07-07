import type { SystemConfig } from './config';
import { DEFAULT_CONFIG } from './config';
import type { ActivityLevel, Goal, MacroTarget, Sex, User } from './types';

export function ageInYears(birthDate: string | Date, now: Date = new Date()): number {
  const d = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

/** Mifflin–St Jeor. 'other' takes the average of the male/female constants. */
export function calculateBmr(
  sex: Sex,
  weightKg: number,
  heightCm: number,
  ageYears: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  const constant = sex === 'male' ? 5 : sex === 'female' ? -161 : (5 - 161) / 2;
  return base + constant;
}

export function calculateTdee(
  bmr: number,
  activityLevel: ActivityLevel,
  config: SystemConfig = DEFAULT_CONFIG,
): number {
  return bmr * config.activityFactors[activityLevel];
}

export interface TargetResult {
  bmr: number;
  tdee: number;
  targetKcal: number;
  source: 'manual' | 'calculated';
  macroTargets: MacroTarget;
}

export interface TargetOptions {
  activityLevel?: ActivityLevel;
  goal?: Goal;
  proteinProfile?: keyof SystemConfig['proteinPerKgProfiles'];
  now?: Date;
}

/**
 * Full target computation. A manual kcal target overrides the calculated one,
 * but BMR/TDEE are still returned for transparency.
 */
export function calculateUserTarget(
  user: User,
  config: SystemConfig = DEFAULT_CONFIG,
  options: TargetOptions = {},
): TargetResult {
  const activity = options.activityLevel ?? user.activityLevel;
  const goal = options.goal ?? user.goal;
  const age = ageInYears(user.birthDate, options.now);

  const bmr = calculateBmr(user.sex, user.weightKg, user.heightCm, age);
  const tdee = calculateTdee(bmr, activity, config);
  const calculated = tdee + config.goalKcalAdjustments[goal];

  const usingManual = user.manualKcalTarget != null && user.manualKcalTarget > 0;
  const targetKcal = usingManual ? (user.manualKcalTarget as number) : calculated;

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetKcal: Math.round(targetKcal),
    source: usingManual ? 'manual' : 'calculated',
    macroTargets: calculateMacroTargets(user, targetKcal, config, options.proteinProfile),
  };
}

/**
 * Day-level macro goals:
 * - protein from g/kg profile
 * - fat from a % of kcal
 * - carbs from the remaining kcal
 */
export function calculateMacroTargets(
  user: User,
  targetKcal: number,
  config: SystemConfig = DEFAULT_CONFIG,
  proteinProfile: keyof SystemConfig['proteinPerKgProfiles'] = config.defaultProteinProfile,
): MacroTarget {
  const proteinPerKg = config.proteinPerKgProfiles[proteinProfile];
  const proteinG = proteinPerKg * user.weightKg;

  const fatKcal = targetKcal * config.fatKcalFraction;
  const fatG = fatKcal / config.kcalPerGram.fat;

  const proteinKcal = proteinG * config.kcalPerGram.protein;
  const carbsKcal = Math.max(0, targetKcal - proteinKcal - fatKcal);
  const carbsG = carbsKcal / config.kcalPerGram.carbs;

  return {
    proteinG: Math.round(proteinG),
    carbsG: Math.round(carbsG),
    fatG: Math.round(fatG),
    proteinMinG: Math.round(proteinG * 0.9),
  };
}
