import { describe, expect, it } from 'vitest';

import { buildFoodIndex, RECIPES } from '../data/seed';
import { calculateRecipeNutrition, ingredientNutrition } from './nutrition';

const foods = buildFoodIndex();
const butterChicken = RECIPES.find((r) => r.id === 'light_butter_chicken')!;

describe('calculateRecipeNutrition', () => {
  it('sums ingredient contributions by amount/100g', () => {
    const chicken = butterChicken.ingredients.find((i) => i.id === 'bc_chicken')!;
    const n = ingredientNutrition(chicken, foods.get('chicken_breast')!);
    // 150 g of 110 kcal/100g = 165 kcal
    expect(n.kcal).toBeCloseTo(165, 5);
    expect(n.proteinG).toBeCloseTo(34.5, 5);
  });

  it('gives the base butter chicken roughly 700 kcal', () => {
    const n = calculateRecipeNutrition(butterChicken.ingredients, foods);
    expect(n.kcal).toBeGreaterThan(680);
    expect(n.kcal).toBeLessThan(740);
    expect(n.proteinG).toBeGreaterThan(30);
  });
});
