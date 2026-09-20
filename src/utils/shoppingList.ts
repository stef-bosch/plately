import type { ShoppingListEntry } from '../context/ShoppingListContext';
import { getRecipeById } from '../data/recipes';
import {
  classifyIngredient,
  GROCERY_ORDER,
  type GroceryCategory,
} from './groceryCategories';
import { formatQuantity, scaledQuantity } from './scaling';

/**
 * Turns the shopping-list entries (dish + servings) into aggregated grocery
 * items, grouped and ordered by supermarket category. Identical items across
 * dishes are merged (their scalable quantities summed); non-scalable items
 * ("naar smaak") are listed once.
 */

export interface ShoppingItem {
  /** Stable key for the tick state, independent of ordering. */
  key: string;
  name: string;
  /** Display amount, e.g. "170 g", "2", "naar smaak" or "" (unquantified). */
  amount: string;
  category: GroceryCategory;
}

export interface ShoppingGroup {
  category: GroceryCategory;
  items: ShoppingItem[];
}

/** Strips prep detail so "rode ui, in dunne parten" merges with "rode ui". */
function baseName(raw: string): string {
  const base = raw.split(',')[0].split('(')[0].trim();
  return base || raw.trim();
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

interface Acc {
  name: string;
  unit: string;
  category: GroceryCategory;
  total: number | null;
  hasLoose: boolean; // an occurrence without a summable amount
}

export function buildShoppingList(entries: ShoppingListEntry[]): ShoppingGroup[] {
  const map = new Map<string, Acc>();

  for (const entry of entries) {
    const recipe = getRecipeById(entry.recipeId);
    if (!recipe) continue;
    for (const group of recipe.ingredients) {
      for (const item of group.items) {
        const base = baseName(item.name);
        const category = classifyIngredient(base);
        const unit = item.unit ?? '';
        const key = `${category}|${base.toLowerCase()}|${unit}`;
        const scaled = scaledQuantity(item, entry.servings, recipe.baseServings);
        const acc =
          map.get(key) ??
          { name: capitalize(base), unit, category, total: null, hasLoose: false };
        if (scaled != null) acc.total = (acc.total ?? 0) + scaled;
        else acc.hasLoose = true;
        map.set(key, acc);
      }
    }
  }

  const groups = new Map<GroceryCategory, ShoppingItem[]>();
  for (const [key, acc] of map) {
    let amount = '';
    if (acc.total != null) {
      const num = formatQuantity(acc.total);
      amount = acc.unit ? `${num} ${acc.unit}` : num;
    } else if (acc.hasLoose) {
      amount = 'naar smaak';
    }
    const item: ShoppingItem = { key, name: acc.name, amount, category: acc.category };
    const list = groups.get(acc.category) ?? [];
    list.push(item);
    groups.set(acc.category, list);
  }

  return GROCERY_ORDER.filter((c) => (groups.get(c)?.length ?? 0) > 0).map((c) => ({
    category: c,
    items: (groups.get(c) as ShoppingItem[]).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  }));
}
