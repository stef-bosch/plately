import type { FoodItem, FoodItemIndex, RecipeBlueprint, User } from '../domain/types';
import type { DataRepository, ScaledMealOutputRecord } from './repository';
import { DEMO_USER, FOOD_ITEMS, RECIPES, buildFoodIndex } from './seed';

/** Seeded in-memory store — lets the API and tests run without a database. */
export class InMemoryRepository implements DataRepository {
  private users = new Map<string, User>();
  private foods = new Map<string, FoodItem>();
  private recipes = new Map<string, RecipeBlueprint>();
  private outputs: ScaledMealOutputRecord[] = [];

  constructor(
    seed: { users?: User[]; foods?: FoodItem[]; recipes?: RecipeBlueprint[] } = {},
  ) {
    for (const u of seed.users ?? [DEMO_USER]) this.users.set(u.id, u);
    for (const f of seed.foods ?? FOOD_ITEMS) this.foods.set(f.id, f);
    for (const r of seed.recipes ?? RECIPES) this.recipes.set(r.id, r);
  }

  async getUser(id: string) {
    return this.users.get(id) ?? null;
  }
  async getFoodItem(id: string) {
    return this.foods.get(id) ?? null;
  }
  async listFoodItems() {
    return [...this.foods.values()];
  }
  async getRecipe(id: string) {
    return this.recipes.get(id) ?? null;
  }
  async listRecipes() {
    return [...this.recipes.values()];
  }
  async foodIndex(): Promise<FoodItemIndex> {
    return buildFoodIndex([...this.foods.values()]);
  }
  async saveScaledMealOutput(record: ScaledMealOutputRecord) {
    this.outputs.push(record);
  }

  /** Test/diagnostic helper. */
  getOutputs(): ScaledMealOutputRecord[] {
    return this.outputs;
  }
}
