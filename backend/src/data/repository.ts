import type { FoodItem, FoodItemIndex, RecipeBlueprint, User } from '../domain/types';

export interface ScaledMealOutputRecord {
  userId: string;
  recipeId: string;
  targetKcal: number;
  actualKcal: number;
  protein: number;
  carbs: number;
  fat: number;
  scaledIngredients: unknown;
}

/**
 * Storage abstraction. `InMemoryRepository` implements it for local runs/tests;
 * a `PrismaRepository` (Postgres) can implement the same interface later — see
 * prisma/schema.prisma and README.
 */
export interface DataRepository {
  getUser(id: string): Promise<User | null>;
  getFoodItem(id: string): Promise<FoodItem | null>;
  listFoodItems(): Promise<FoodItem[]>;
  getRecipe(id: string): Promise<RecipeBlueprint | null>;
  listRecipes(): Promise<RecipeBlueprint[]>;
  foodIndex(): Promise<FoodItemIndex>;
  saveScaledMealOutput(record: ScaledMealOutputRecord): Promise<void>;
}
