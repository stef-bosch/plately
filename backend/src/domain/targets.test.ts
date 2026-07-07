import { describe, expect, it } from 'vitest';

import { DEFAULT_CONFIG } from './config';
import { calculateBmr, calculateMacroTargets, calculateTdee, calculateUserTarget } from './targets';
import type { User } from './types';

const user: User = {
  id: 'u1',
  sex: 'male',
  birthDate: '1992-05-10',
  heightCm: 183,
  weightKg: 82,
  activityLevel: 'moderate',
  goal: 'muscle_gain',
  manualKcalTarget: null,
  dietaryPreferences: [],
  allergies: [],
  dislikedIngredients: [],
};

describe('calculateBmr', () => {
  it('uses Mifflin–St Jeor for men', () => {
    // 10*82 + 6.25*183 - 5*33 + 5 = 1803.75
    expect(calculateBmr('male', 82, 183, 33)).toBeCloseTo(1803.75, 2);
  });
  it('subtracts 161 for women', () => {
    expect(calculateBmr('female', 60, 165, 30)).toBeCloseTo(10 * 60 + 6.25 * 165 - 5 * 30 - 161, 2);
  });
});

describe('calculateTdee', () => {
  it('applies the activity factor', () => {
    expect(calculateTdee(1800, 'moderate', DEFAULT_CONFIG)).toBeCloseTo(1800 * 1.55, 5);
  });
});

describe('calculateUserTarget', () => {
  it('computes bmr, tdee and applies the goal adjustment', () => {
    const t = calculateUserTarget(user, DEFAULT_CONFIG, { now: new Date('2025-05-10') });
    expect(t.bmr).toBe(1804);
    expect(t.tdee).toBe(Math.round(1803.75 * 1.55));
    expect(t.source).toBe('calculated');
    // muscle_gain: +300
    expect(t.targetKcal).toBe(Math.round(1803.75 * 1.55) + 300);
  });

  it('honours a manual kcal target', () => {
    const t = calculateUserTarget(
      { ...user, manualKcalTarget: 2500 },
      DEFAULT_CONFIG,
      { now: new Date('2025-05-10') },
    );
    expect(t.source).toBe('manual');
    expect(t.targetKcal).toBe(2500);
  });
});

describe('calculateMacroTargets', () => {
  it('derives protein from g/kg, fat from % kcal, carbs from remainder', () => {
    const m = calculateMacroTargets(user, 3000, DEFAULT_CONFIG, 'muscle'); // 1.8 g/kg
    expect(m.proteinG).toBe(Math.round(1.8 * 82));
    expect(m.fatG).toBe(Math.round((3000 * 0.275) / 9));
    // the macros reconstruct the kcal target (within rounding)
    const reconstructed = m.proteinG * 4 + m.carbsG * 4 + m.fatG * 9;
    expect(Math.abs(reconstructed - 3000)).toBeLessThanOrEqual(6);
    expect(m.proteinMinG).toBeLessThan(m.proteinG);
  });
});
