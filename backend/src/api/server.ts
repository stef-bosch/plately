import express, { type Express, type Request, type Response } from 'express';

import type { DataRepository } from '../data/repository';
import type { MacroTarget, MealType } from '../domain/types';
import {
  calculateTarget,
  generatePlan,
  scaleRecipe,
  type MealPlanRequest,
} from './service';

export function createServer(repo: DataRepository): Express {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ ok: true }));

  // POST /users/:id/calculate-target
  app.post('/users/:id/calculate-target', async (req: Request, res: Response) => {
    const result = await calculateTarget(repo, req.params.id, {
      activityLevel: req.body?.activity_level,
      goal: req.body?.goal,
      proteinProfile: req.body?.protein_profile,
    });
    if (!result) return res.status(404).json({ error: 'User not found' });
    return res.json(result);
  });

  // POST /recipes/:id/scale
  app.post('/recipes/:id/scale', async (req: Request, res: Response) => {
    const targetKcal = Number(req.body?.target_kcal);
    if (!Number.isFinite(targetKcal) || targetKcal <= 0) {
      return res.status(400).json({ error: 'target_kcal is required and must be > 0' });
    }
    const macroTarget = parseMacroTarget(req.body?.macro_target);
    const output = await scaleRecipe(repo, req.params.id, targetKcal, macroTarget);
    if (!output) return res.status(404).json({ error: 'Recipe not found' });
    return res.json(output);
  });

  // POST /meal-plans/generate
  app.post('/meal-plans/generate', async (req: Request, res: Response) => {
    const body = req.body ?? {};
    const request: MealPlanRequest = {
      userId: body.user_id,
      date: body.date,
      targetKcal: body.target_kcal != null ? Number(body.target_kcal) : undefined,
      meals: parseMeals(body.meals ?? body.meal_count),
      recipeIdsByMeal: body.recipe_ids_by_meal,
      excludedIngredients: body.excluded_ingredients,
    };
    if (!request.userId) return res.status(400).json({ error: 'user_id is required' });
    const result = await generatePlan(repo, request);
    if (!result) return res.status(404).json({ error: 'User not found' });
    return res.json(result);
  });

  // GET /recipes/:id
  app.get('/recipes/:id', async (req: Request, res: Response) => {
    const recipe = await repo.getRecipe(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    return res.json(recipe);
  });

  // GET /food-items/:id
  app.get('/food-items/:id', async (req: Request, res: Response) => {
    const food = await repo.getFoodItem(req.params.id);
    if (!food) return res.status(404).json({ error: 'Food item not found' });
    return res.json(food);
  });

  return app;
}

function parseMacroTarget(raw: unknown): MacroTarget | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const r = raw as Record<string, unknown>;
  const proteinG = Number(r.protein_g);
  const carbsG = Number(r.carbs_g);
  const fatG = Number(r.fat_g);
  if (![proteinG, carbsG, fatG].every(Number.isFinite)) return undefined;
  return {
    proteinG,
    carbsG,
    fatG,
    proteinMinG: Number(r.protein_min_g) || Math.round(proteinG * 0.9),
  };
}

const ALL_MEALS: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner'];

function parseMeals(raw: unknown): MealType[] | undefined {
  if (Array.isArray(raw)) return raw.filter((m): m is MealType => ALL_MEALS.includes(m as MealType));
  if (typeof raw === 'number') return ALL_MEALS.slice(0, Math.max(1, Math.min(4, raw)));
  return undefined;
}
