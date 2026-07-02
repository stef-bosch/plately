import { getRecipeById } from '../data/recipes';
import type { Recipe, WeeklyPlan } from '../types';
import { escapeHtml, printHtml } from './printHtml';
import type { ResolveSettings } from './resolveRecipe';
import { displayIngredientName, formatQuantity } from './scaling';

/**
 * Weekly shopping list.
 *
 * Walks every meal in the week's plan (breakfast, lunch, snacks and dinner for
 * all seven days, including repeats), gathers the ingredients of each dish and
 * aggregates them by name + unit so the same item bought for several meals is
 * summed into one line. The result is rendered to a printable / "Save as PDF"
 * checklist, matching how recipes are exported.
 */

interface ShoppingItem {
  name: string;
  unit: string;
  /** Summed numeric quantity across the week (0 when only "to taste"). */
  total: number;
  /** True when at least one occurrence had a non-numeric amount. */
  toTaste: boolean;
}

/** All recipes for the week, with repeats kept so quantities add up correctly. */
function collectWeekRecipes(
  plan: WeeklyPlan,
  settings?: ResolveSettings,
): Recipe[] {
  const ids: string[] = [];
  plan.days.forEach((day) => {
    const { ontbijt, lunch, diner, tussendoortje } = day.meals;
    ids.push(ontbijt, lunch, diner, ...tussendoortje);
  });
  return ids
    .map((id) => getRecipeById(id, settings))
    .filter((recipe): recipe is Recipe => Boolean(recipe));
}

function aggregateIngredients(recipes: Recipe[]): ShoppingItem[] {
  const byKey = new Map<string, ShoppingItem>();

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((group) => {
      group.items.forEach((item) => {
        const name = displayIngredientName(item.name);
        const unit = item.unit ?? '';
        const key = `${name.toLowerCase()}__${unit.toLowerCase()}`;

        let entry = byKey.get(key);
        if (!entry) {
          entry = { name, unit, total: 0, toTaste: false };
          byKey.set(key, entry);
        }
        if (typeof item.quantity === 'number') {
          entry.total += item.quantity;
        } else {
          entry.toTaste = true;
        }
      });
    });
  });

  return [...byKey.values()].sort((a, b) =>
    a.name.localeCompare(b.name, 'nl'),
  );
}

/** "250 g", "2", "naar smaak" — the amount shown before the ingredient name. */
function amountLabel(item: ShoppingItem): string {
  if (item.total > 0) {
    return item.unit
      ? `${formatQuantity(item.total)} ${item.unit}`
      : formatQuantity(item.total);
  }
  return item.toTaste ? 'naar smaak' : '';
}

function buildShoppingListHtml(
  items: ShoppingItem[],
  weekNumber: number,
): string {
  const rows = items
    .map((item) => {
      const amount = amountLabel(item);
      const amountHtml = amount
        ? `<span class="amount">${escapeHtml(amount)}</span> `
        : '';
      return `<li><span class="box"></span><span class="text">${amountHtml}${escapeHtml(
        item.name,
      )}</span></li>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Boodschappenlijst week ${escapeHtml(weekNumber)} — Plately</title>
<style>
  * { box-sizing: border-box; }
  @page { margin: 18mm 16mm; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #2A1E12;
    line-height: 1.5;
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .brand {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    border-bottom: 2px solid #FF7A1A;
    padding-bottom: 8px;
    margin-bottom: 20px;
  }
  .brand .logo { font-size: 22px; font-weight: 800; color: #FF7A1A; letter-spacing: -0.5px; }
  .brand .tagline { font-size: 11px; color: #998A77; }
  h1 { font-size: 26px; margin: 0 0 4px; color: #2A1E12; }
  .subtitle { margin: 0 0 22px; color: #6B5D4D; font-size: 14px; }
  ul.list {
    columns: 2;
    column-gap: 28px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  ul.list li {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 9px;
    font-size: 13.5px;
    break-inside: avoid;
    -webkit-column-break-inside: avoid;
  }
  .box {
    flex: 0 0 14px;
    width: 14px;
    height: 14px;
    margin-top: 2px;
    border: 1.5px solid #FF7A1A;
    border-radius: 4px;
  }
  .text { flex: 1; }
  .amount { font-weight: 700; }
  footer { margin-top: 26px; padding-top: 10px; border-top: 1px solid #F1E5CF; font-size: 10.5px; color: #998A77; text-align: center; }
</style>
</head>
<body>
  <div class="brand">
    <span class="logo">Plately</span>
    <span class="tagline">Boodschappenlijst</span>
  </div>

  <h1>Boodschappenlijst</h1>
  <p class="subtitle">Voor je weekmenu · week ${escapeHtml(weekNumber)}</p>

  <ul class="list">${rows}</ul>

  <footer>Geprint vanuit Plately · weekmenu week ${escapeHtml(weekNumber)}</footer>
</body>
</html>`;
}

/** Builds and opens the print / save-as-PDF dialog for the week's shopping list. */
export async function printWeekShoppingList(
  plan: WeeklyPlan,
  weekNumber: number,
  settings?: ResolveSettings,
): Promise<void> {
  const recipes = collectWeekRecipes(plan, settings);
  const items = aggregateIngredients(recipes);
  await printHtml(buildShoppingListHtml(items, weekNumber));
}
