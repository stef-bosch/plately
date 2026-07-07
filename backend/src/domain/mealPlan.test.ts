import { describe, expect, it } from 'vitest';

import { buildFoodIndex, DEMO_USER, RECIPES } from '../data/seed';
import { DEFAULT_CONFIG } from './config';
import { computeDayHealth } from './dayCorrection';
import { generateMealPlan } from './mealPlan';
import { calculateUserTarget } from './targets';
import { GreedyRecipeScaler } from './scaling';

const foods = buildFoodIndex();
const scaler = new GreedyRecipeScaler();

const breakfast = RECIPES.find((r) => r.id === 'overnight_oats')!;
const dinner = RECIPES.find((r) => r.id === 'light_butter_chicken')!;

describe('generateMealPlan — day totals', () => {
  it('sums the scaled meals and reports veg/fruit grams', () => {
    const target = calculateUserTarget(DEMO_USER, DEFAULT_CONFIG, { now: new Date('2025-05-10') });

    const plan = generateMealPlan({
      targetKcal: target.targetKcal,
      dayMacro: target.macroTargets,
      picks: [
        { mealType: 'breakfast', recipe: breakfast },
        { mealType: 'dinner', recipe: dinner },
      ],
      foods,
      scaler,
      config: DEFAULT_CONFIG,
    });

    const health = computeDayHealth(plan.meals, foods);
    // reported nutrition equals the recomputed day health (allowing rounding)
    expect(Math.abs(plan.actualKcal - health.nutrition.kcal)).toBeLessThanOrEqual(1);
    expect(plan.vegetableG).toBe(health.vegetableG);
    expect(plan.fruitG).toBe(health.fruitG);
    expect(plan.meals.length).toBe(2);
    // low vegetable intake with only two meals should surface a warning
    expect(plan.warnings.length).toBeGreaterThan(0);
  });
});
