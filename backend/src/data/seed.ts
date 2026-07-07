import type {
  FoodItem,
  FoodItemIndex,
  IngredientRole,
  IngredientState,
  RecipeBlueprint,
  RecipeIngredient,
  User,
} from '../domain/types';

/* ----------------------------- Food items ----------------------------- */

export const FOOD_ITEMS: FoodItem[] = [
  food('chicken_breast', 'Kipfilet', 110, 23, 0, 1.5, { fiber: 0, salt: 0.1, sat: 0.4, group: 'protein', schijf: true }),
  food('brown_rice_dry', 'Zilvervliesrijst (droog)', 350, 7.5, 72, 2.8, { fiber: 3.5, group: 'grain', schijf: true }),
  food('onion', 'Ui', 40, 1.1, 9, 0.1, { fiber: 1.7, group: 'vegetable', schijf: true }),
  food('tomato_passata', 'Tomatenpassata', 30, 1.3, 5, 0.2, { fiber: 1.4, salt: 0.1, group: 'vegetable', schijf: true }),
  food('bell_pepper', 'Paprika', 30, 1, 6, 0.3, { fiber: 2, group: 'vegetable', schijf: true }),
  food('light_coconut_milk', 'Kokosmelk (light)', 100, 1, 3, 10, { sat: 8, group: 'fat', schijf: false }),
  food('cashew', 'Cashewnoten', 580, 18, 30, 44, { fiber: 3, sat: 8, group: 'nuts', schijf: false }),
  food('butter', 'Roomboter', 720, 0.9, 0.1, 81, { sat: 51, salt: 0.1, group: 'fat', schijf: false }),
  food('garam_masala', 'Garam masala', 380, 14, 45, 15, { group: 'spice', schijf: false }),
  food('cumin', 'Komijn', 375, 18, 44, 22, { group: 'spice', schijf: false }),
  food('turmeric', 'Kurkuma', 350, 8, 65, 10, { group: 'spice', schijf: false }),
  food('garlic', 'Knoflook', 149, 6, 33, 0.5, { group: 'spice', schijf: false }),
  food('salt', 'Zout', 0, 0, 0, 0, { salt: 39, group: 'condiment', schijf: false }),

  food('oats', 'Havermout', 370, 13, 60, 7, { fiber: 10, group: 'grain', schijf: true }),
  food('skyr', 'Skyr (mager)', 60, 11, 4, 0.2, { group: 'dairy', schijf: true }),
  food('banana', 'Banaan', 89, 1.1, 23, 0.3, { fiber: 2.6, group: 'fruit', schijf: true }),
  food('blueberries', 'Blauwe bessen', 57, 0.7, 12, 0.3, { fiber: 2.4, group: 'fruit', schijf: true }),
  food('walnuts', 'Walnoten', 654, 15, 14, 65, { fiber: 7, sat: 6, group: 'nuts', schijf: true }),
  food('semi_milk', 'Halfvolle melk', 46, 3.5, 4.8, 1.5, { salt: 0.1, group: 'dairy', schijf: true }),
  food('cinnamon', 'Kaneel', 247, 4, 81, 1.2, { group: 'spice', schijf: false }),
];

/* ------------------------------- Recipes ------------------------------- */

export const RECIPES: RecipeBlueprint[] = [
  {
    id: 'light_butter_chicken',
    name: 'Lichte butter chicken met zilvervliesrijst',
    mealType: 'dinner',
    cuisine: 'indian',
    baseServings: 1,
    tags: ['eiwitrijk', 'gezond'],
    wasteFreeTip: 'Gebruik de hele ui en bewaar restjes saus voor de volgende dag.',
    tasteBalance: 'romig, mild-kruidig',
    instructions: ['Bak kip aan.', 'Voeg saus toe.', 'Serveer met rijst.'],
    ingredients: [
      ing('bc_chicken', 'chicken_breast', 'kipfilet', 150, 'protein_base', {
        min: 100, max: 220, step: 10, up: 9, down: 4, schijfState: 'raw',
      }),
      ing('bc_rice', 'brown_rice_dry', 'zilvervliesrijst droog', 65, 'carb_base', {
        min: 45, max: 110, step: 5, up: 10, down: 8, state: 'dry',
      }),
      ing('bc_onion', 'onion', 'ui', 40, 'vegetable', { min: 40, max: 80, step: 10, up: 3, down: 0 }),
      ing('bc_passata', 'tomato_passata', 'tomatenpassata', 120, 'sauce_base', {
        min: 80, max: 200, step: 20, up: 4, down: 3, group: 'sauce_base',
      }),
      ing('bc_pepper', 'bell_pepper', 'paprika', 60, 'vegetable', { min: 60, max: 120, step: 20, up: 3, down: 0 }),
      ing('bc_coconut', 'light_coconut_milk', 'kokosmelk (light)', 60, 'dairy_sauce', {
        min: 40, max: 120, step: 10, up: 5, down: 3, group: 'sauce_base',
      }),
      ing('bc_cashew', 'cashew', 'cashewnoten', 15, 'fat_source', {
        min: 10, max: 30, step: 5, up: 6, down: 5, group: 'sauce_base',
      }),
      ing('bc_butter', 'butter', 'roomboter', 10, 'fat_source', { min: 4, max: 16, step: 2, up: 7, down: 8 }),
      flavour('bc_garam', 'garam_masala', 'garam masala', 4),
      flavour('bc_cumin', 'cumin', 'komijn', 2),
      flavour('bc_turmeric', 'turmeric', 'kurkuma', 2),
      flavour('bc_garlic', 'garlic', 'knoflook', 6),
      flavour('bc_salt', 'salt', 'zout', 2),
    ],
  },
  {
    id: 'overnight_oats',
    name: 'Overnight oats met skyr, banaan en walnoot',
    mealType: 'breakfast',
    cuisine: 'international',
    baseServings: 1,
    tags: ['vezelrijk', 'gezond'],
    tasteBalance: 'zoet, fris',
    instructions: ['Meng havermout met melk en skyr.', 'Laat weken.', 'Top met fruit en noten.'],
    ingredients: [
      ing('oo_oats', 'oats', 'havermout', 50, 'carb_base', { min: 35, max: 90, step: 5, up: 10, down: 8, state: 'dry' }),
      ing('oo_skyr', 'skyr', 'skyr', 150, 'protein_base', { min: 100, max: 300, step: 20, up: 9, down: 4 }),
      ing('oo_banana', 'banana', 'banaan', 80, 'fruit', { min: 60, max: 140, step: 20, up: 4, down: 2 }),
      ing('oo_blueberries', 'blueberries', 'blauwe bessen', 40, 'fruit', { min: 40, max: 100, step: 10, up: 4, down: 0 }),
      ing('oo_walnuts', 'walnuts', 'walnoten', 15, 'fat_source', { min: 8, max: 30, step: 5, up: 7, down: 6 }),
      ing('oo_milk', 'semi_milk', 'halfvolle melk', 100, 'liquid', { min: 80, max: 180, step: 20, up: 2, down: 2 }),
      flavour('oo_cinnamon', 'cinnamon', 'kaneel', 2),
    ],
  },
];

/* ------------------------------- Users --------------------------------- */

export const DEMO_USER: User = {
  id: 'demo_user',
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

/* ------------------------------ helpers -------------------------------- */

export function buildFoodIndex(items: FoodItem[] = FOOD_ITEMS): FoodItemIndex {
  return new Map(items.map((f) => [f.id, f]));
}

function food(
  id: string,
  name: string,
  kcal: number,
  protein: number,
  carbs: number,
  fat: number,
  extra: { fiber?: number; salt?: number; sat?: number; group: string; schijf: boolean },
): FoodItem {
  return {
    id,
    name,
    kcalPer100g: kcal,
    proteinPer100g: protein,
    carbsPer100g: carbs,
    fatPer100g: fat,
    fiberPer100g: extra.fiber ?? null,
    saltPer100g: extra.salt ?? null,
    saturatedFatPer100g: extra.sat ?? null,
    foodGroup: extra.group,
    schijfVanVijf: extra.schijf,
    source: 'seed',
  };
}

interface IngOpts {
  min?: number;
  max?: number;
  step?: number;
  up?: number;
  down?: number;
  group?: string;
  state?: IngredientState;
  schijfState?: IngredientState;
}

function ing(
  id: string,
  foodItemId: string,
  displayName: string,
  amountG: number,
  role: IngredientRole,
  opts: IngOpts = {},
): RecipeIngredient {
  return {
    id,
    foodItemId,
    displayName,
    amountG,
    unit: 'g',
    state: opts.state ?? opts.schijfState ?? 'raw',
    role,
    scalable: true,
    minG: opts.min ?? null,
    maxG: opts.max ?? null,
    stepG: opts.step ?? null,
    scalePriorityUp: opts.up ?? 0,
    scalePriorityDown: opts.down ?? 0,
    scalingGroup: opts.group ?? null,
    required: true,
    notes: null,
  };
}

/** Flavourings are required but never auto-scaled. */
function flavour(
  id: string,
  foodItemId: string,
  displayName: string,
  amountG: number,
): RecipeIngredient {
  return {
    id,
    foodItemId,
    displayName,
    amountG,
    unit: 'g',
    state: 'raw',
    role: 'flavouring',
    scalable: false,
    minG: amountG,
    maxG: amountG,
    stepG: null,
    scalePriorityUp: 0,
    scalePriorityDown: 0,
    scalingGroup: 'spices',
    required: true,
    notes: null,
  };
}
