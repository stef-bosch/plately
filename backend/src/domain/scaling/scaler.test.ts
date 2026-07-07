import { beforeEach, describe, expect, it } from 'vitest';

import { buildFoodIndex, RECIPES } from '../../data/seed';
import { DEFAULT_CONFIG } from '../config';
import { calculateRecipeNutrition } from '../nutrition';
import type { MacroTarget, RecipeBlueprint } from '../types';
import { generateCandidates } from './candidates';
import { GreedyRecipeScaler } from './GreedyRecipeScaler';
import type { ScalingContext } from './RecipeScaler';

const foods = buildFoodIndex();
const scaler = new GreedyRecipeScaler();

const mealMacro: MacroTarget = { proteinG: 55, carbsG: 100, fatG: 30, proteinMinG: 45 };
const ctx: ScalingContext = { foods, config: DEFAULT_CONFIG, macroTarget: mealMacro };

let butterChicken: RecipeBlueprint;
let overnightOats: RecipeBlueprint;

beforeEach(() => {
  butterChicken = structuredClone(RECIPES.find((r) => r.id === 'light_butter_chicken')!);
  overnightOats = structuredClone(RECIPES.find((r) => r.id === 'overnight_oats')!);
});

const amount = (r: RecipeBlueprint, id: string) => r.ingredients.find((i) => i.id === id)!.amountG;
const within = (kcal: number, target: number, frac = 0.03) => Math.abs(kcal - target) <= target * frac;

describe('generateCandidates', () => {
  it('offers scalable non-flavouring ingredients and skips flavourings', () => {
    const up = generateCandidates(butterChicken.ingredients, foods, 'up');
    const ids = up.map((c) => c.ingredientId);
    expect(ids).toContain('bc_rice');
    expect(ids).toContain('bc_chicken');
    expect(ids).not.toContain('bc_salt');
    expect(ids).not.toContain('bc_garam');
  });

  it('respects max on up and min on down', () => {
    // rice at max cannot go up
    butterChicken.ingredients.find((i) => i.id === 'bc_rice')!.amountG = 110;
    const up = generateCandidates(butterChicken.ingredients, foods, 'up');
    expect(up.map((c) => c.ingredientId)).not.toContain('bc_rice');
    // onion is at its min (== base) so it cannot go down
    const down = generateCandidates(butterChicken.ingredients, foods, 'down');
    expect(down.map((c) => c.ingredientId)).not.toContain('bc_onion');
  });
});

describe('scaleRecipeToTarget — scaling up (700 -> 900)', () => {
  it('reaches the target within ±3% using carb/protein/fat, not flavourings', () => {
    const res = scaler.scaleRecipeToTarget(butterChicken, 900, ctx);
    expect(within(res.nutrition.kcal, 900)).toBe(true);
    // carb + protein bases grew
    expect(amount(res.recipe, 'bc_rice')).toBeGreaterThan(65);
    expect(amount(res.recipe, 'bc_chicken')).toBeGreaterThan(150);
    // flavourings untouched
    expect(amount(res.recipe, 'bc_salt')).toBe(2);
    expect(amount(res.recipe, 'bc_garam')).toBe(4);
    expect(amount(res.recipe, 'bc_garlic')).toBe(6);
  });

  it('never violates min/max and keeps vegetables at/above base', () => {
    const res = scaler.scaleRecipeToTarget(butterChicken, 900, ctx);
    for (const i of res.recipe.ingredients) {
      if (i.minG != null) expect(i.amountG).toBeGreaterThanOrEqual(i.minG);
      if (i.maxG != null) expect(i.amountG).toBeLessThanOrEqual(i.maxG);
    }
    expect(amount(res.recipe, 'bc_onion')).toBeGreaterThanOrEqual(40);
    expect(amount(res.recipe, 'bc_pepper')).toBeGreaterThanOrEqual(60);
  });
});

describe('scaleRecipeToTarget — scaling down', () => {
  it('lowers kcal toward the target within tolerance', () => {
    const base = calculateRecipeNutrition(butterChicken.ingredients, foods).kcal;
    const res = scaler.scaleRecipeToTarget(butterChicken, 550, ctx);
    expect(res.nutrition.kcal).toBeLessThan(base);
    expect(within(res.nutrition.kcal, 550)).toBe(true);
    // vegetables are not pushed below base when cutting kcal
    expect(amount(res.recipe, 'bc_onion')).toBe(40);
  });
});

describe('scaleRecipeToTarget — no change needed', () => {
  it('returns the base recipe when already within tolerance', () => {
    const base = calculateRecipeNutrition(butterChicken.ingredients, foods).kcal;
    const res = scaler.scaleRecipeToTarget(butterChicken, Math.round(base), ctx);
    expect(res.iterations).toBe(0);
    expect(res.changes.every((c) => c.changeG === 0)).toBe(true);
  });
});

describe('scaleRecipeToTarget — infeasible target', () => {
  it('returns best attempt with a warning', () => {
    const res = scaler.scaleRecipeToTarget(butterChicken, 1500, ctx);
    expect(within(res.nutrition.kcal, 1500)).toBe(false);
    expect(res.warnings.some((w) => w.includes('niet volledig haalbaar'))).toBe(true);
    // still respects the portion ceilings
    for (const i of res.recipe.ingredients) {
      if (i.maxG != null) expect(i.amountG).toBeLessThanOrEqual(i.maxG);
    }
  });
});

describe('scaleRecipeToTarget — overnight oats up', () => {
  it('scales oats/skyr/fruit/nuts but not cinnamon', () => {
    const res = scaler.scaleRecipeToTarget(overnightOats, 650, {
      foods,
      config: DEFAULT_CONFIG,
      macroTarget: { proteinG: 30, carbsG: 70, fatG: 18, proteinMinG: 24 },
    });
    expect(within(res.nutrition.kcal, 650)).toBe(true);
    expect(amount(res.recipe, 'oo_cinnamon')).toBe(2); // flavouring untouched
  });
});
