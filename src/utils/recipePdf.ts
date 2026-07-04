import { mealTypeLabel, seasonLabel } from '../constants/labels';
import { colors } from '../theme';
import type { Recipe } from '../types';
import { printHtml } from './printHtml';
import { scaleIngredient } from './scaling';

/**
 * Recipe → printable PDF.
 *
 * We render the recipe to a self-contained HTML document and hand it to
 * `expo-print`. On web this opens the browser print dialog (with "Save as PDF");
 * on iOS/Android it shows the native print/share sheet, which also offers
 * "Save as PDF" / share-to-Files. The HTML is scaled to the servings the user
 * currently has selected, so the printout matches what's on screen.
 */

interface RecipePdfOptions {
  /** Servings the ingredient amounts should be scaled to. */
  servings: number;
}

/** Minimal HTML-escaping for text taken from recipe data. */
function esc(value: string | number): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const c = hex.replace('#', '');
  return {
    r: parseInt(c.slice(0, 2), 16),
    g: parseInt(c.slice(2, 4), 16),
    b: parseInt(c.slice(4, 6), 16),
  };
}

/** Translucent tint of `hex` — mirrors the in-app macro block interior. */
function tint(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Darkened variant of `hex` for legible text on the light tint. */
function darken(hex: string, factor: number): string {
  const { r, g, b } = hexToRgb(hex);
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `rgb(${clamp(r * factor)}, ${clamp(g * factor)}, ${clamp(b * factor)})`;
}

/** Builds the full HTML document for one recipe at the given servings. */
export function buildRecipeHtml(
  recipe: Recipe,
  { servings }: RecipePdfOptions,
): string {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const servingsLabel = `${servings} ${servings === 1 ? 'persoon' : 'personen'}`;
  const seasons = recipe.seasons.map((s) => seasonLabel[s]).join(' · ');

  const metaChips = [
    mealTypeLabel[recipe.mealType],
    seasons,
    `${totalTime} min totaal`,
    `${recipe.nutrition.calories} kcal p.p.`,
    servingsLabel,
  ]
    .filter(Boolean)
    .map((label) => `<span class="chip">${esc(label)}</span>`)
    .join('');

  const ingredientGroups = recipe.ingredients
    .map((group) => {
      const items = group.items
        .map((item) => {
          const scaled = scaleIngredient(item, servings, recipe.baseServings);
          const amount = scaled.amountLabel
            ? `<span class="amount">${esc(scaled.amountLabel)}</span> `
            : '';
          const note = scaled.note
            ? `<span class="note"> · ${esc(scaled.note)}</span>`
            : '';
          return `<li>${amount}${esc(scaled.name)}${note}</li>`;
        })
        .join('');
      return `
        <div class="group">
          <h3 class="group-title">${esc(group.category)}</h3>
          <ul class="ingredients">${items}</ul>
        </div>`;
    })
    .join('');

  const steps = recipe.instructions
    .map(
      (step, index) =>
        `<li><span class="step-num">${index + 1}</span><span class="step-text">${esc(
          step,
        )}</span></li>`,
    )
    .join('');

  const macros = [
    { label: 'Eiwitten', value: recipe.nutrition.protein, color: colors.protein },
    { label: 'Koolhydraten', value: recipe.nutrition.carbs, color: colors.carbs },
    { label: 'Vetten', value: recipe.nutrition.fat, color: colors.fat },
    { label: 'Vezels', value: recipe.nutrition.fiber, color: colors.fiber },
  ]
    .map(
      (m) =>
        `<div class="macro" style="border-color: ${m.color}; background: ${tint(
          m.color,
          0.14,
        )}; color: ${darken(m.color, 0.55)};"><div class="macro-value">${esc(
          m.value,
        )} g</div><div class="macro-label">${esc(m.label)}</div></div>`,
    )
    .join('');

  const indicative = recipe.nutrition.isIndicative
    ? `<p class="indicative">Voedingswaarden zijn indicatief</p>`
    : '';

  const subtitle = recipe.subtitle
    ? `<p class="subtitle">${esc(recipe.subtitle)}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(recipe.title)} — Plately</title>
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
  .subtitle { margin: 0 0 14px; color: #6B5D4D; font-size: 14px; }
  .chips { margin: 0 0 22px; }
  .chip {
    display: inline-block;
    background: #FDEAD0;
    color: #B5560F;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
    margin: 0 6px 6px 0;
  }
  section { margin-bottom: 22px; page-break-inside: avoid; }
  h2 {
    font-size: 15px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #FF7A1A;
    border-bottom: 1px solid #F1E5CF;
    padding-bottom: 5px;
    margin: 0 0 12px;
  }
  .group { margin-bottom: 12px; }
  .group-title {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #1F9D57;
    margin: 0 0 6px;
  }
  ul.ingredients { margin: 0; padding-left: 18px; }
  ul.ingredients li { margin-bottom: 4px; font-size: 13.5px; }
  .amount { font-weight: 700; }
  .note { color: #998A77; }
  ol.steps { margin: 0; padding: 0; list-style: none; counter-reset: step; }
  ol.steps li { display: flex; gap: 10px; margin-bottom: 10px; font-size: 13.5px; page-break-inside: avoid; }
  .step-num {
    flex: 0 0 22px;
    height: 22px;
    width: 22px;
    background: #FDEAD0;
    color: #B5560F;
    font-size: 12px;
    font-weight: 700;
    border-radius: 50%;
    text-align: center;
    line-height: 22px;
  }
  .step-text { flex: 1; padding-top: 1px; }
  .macros { display: flex; gap: 10px; }
  .macro {
    flex: 1;
    text-align: center;
    border: 1.5px solid #F1E5CF;
    border-radius: 12px;
    padding: 10px 6px;
  }
  .macro-value { font-size: 16px; font-weight: 700; }
  .macro-label { font-size: 10.5px; margin-top: 2px; }
  .indicative { font-size: 11px; color: #998A77; margin: 10px 0 0; }
  footer { margin-top: 26px; padding-top: 10px; border-top: 1px solid #F1E5CF; font-size: 10.5px; color: #998A77; text-align: center; }
</style>
</head>
<body>
  <div class="brand">
    <span class="logo">Plately</span>
    <span class="tagline">Recept</span>
  </div>

  <h1>${esc(recipe.title)}</h1>
  ${subtitle}
  <div class="chips">${metaChips}</div>

  <section>
    <h2>Ingrediënten · ${esc(servingsLabel)}</h2>
    ${ingredientGroups}
  </section>

  <section>
    <h2>Bereidingswijze</h2>
    <ol class="steps">${steps}</ol>
  </section>

  <section>
    <h2>Voedingswaarden per portie</h2>
    <div class="macros">${macros}</div>
    ${indicative}
  </section>

  <footer>Geprint vanuit Plately · ${esc(recipe.title)}</footer>
</body>
</html>`;
}

/**
 * Opens the platform print / "Save as PDF" dialog for a recipe.
 * On web this is the browser print dialog; on native the system print sheet.
 */
export async function printRecipe(
  recipe: Recipe,
  options: RecipePdfOptions,
): Promise<void> {
  await printHtml(buildRecipeHtml(recipe, options));
}
