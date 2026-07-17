import type { Ingredient } from '../types';

/**
 * Ingredient scaling helpers.
 *
 * A recipe is written for `baseServings` (usually 1). When the user picks N
 * servings we multiply every *scalable* numeric quantity by N / baseServings.
 * Non-scalable items ("naar smaak", "zwarte peper") are left untouched.
 */

const VULGAR_FRACTIONS: Record<string, string> = {
  '0.25': '¼',
  '0.5': '½',
  '0.75': '¾',
  '0.33': '⅓',
  '0.67': '⅔',
};

/** Rounds to at most 2 decimals and strips trailing zeros. */
function tidyNumber(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Formats a number as a neat string, preferring vulgar fractions for common
 * values and mixed numbers like "1½".
 */
function formatQuantity(value: number): string {
  const rounded = tidyNumber(value);
  const whole = Math.floor(rounded);
  const remainder = tidyNumber(rounded - whole);

  const fractionKey = remainder.toString();
  const fraction = VULGAR_FRACTIONS[fractionKey];

  if (fraction) {
    if (whole === 0) return fraction;
    return `${whole}${fraction}`;
  }

  // Whole number → no decimals.
  if (remainder === 0) return whole.toString();

  // Fallback: a plain decimal, comma as decimal separator (Dutch convention).
  return rounded.toString().replace('.', ',');
}

/**
 * Proper-noun-derived words that keep their capital in Dutch even when they no
 * longer start a sentence (e.g. nationalities). Extend as recipes are added.
 */
const KEEP_CAPITAL = new Set([
  'Griekse',
  'Turkse',
  'Franse',
  'Italiaanse',
  'Siciliaanse',
  'Spaanse',
  'Marokkaanse',
  'Japanse',
  'Engelse',
  'Hollandse',
  'Parmezaanse',
]);

/**
 * Ingredient names are stored capitalised (they start a list line), but on the
 * detail screen they follow a bold amount ("60 g volkoren couscous"), so the
 * name should be lowercase per Dutch spelling — unless it's a proper noun.
 */
function displayIngredientName(name: string): string {
  if (!name) return name;
  const firstWord = name.split(/\s/, 1)[0];
  if (KEEP_CAPITAL.has(firstWord)) return name;

  const [first, second] = name;
  // Skip acronyms / unit-like tokens where the 2nd char is also uppercase.
  if (first === first.toLowerCase()) return name;
  if (second && second !== second.toLowerCase()) return name;
  return first.toLowerCase() + name.slice(1);
}

export interface ScaledIngredient {
  /** Display-ready amount, e.g. "170 g", "1½ aubergine", "naar smaak". */
  amountLabel: string;
  name: string;
  note?: string;
}

/**
 * Returns a single ingredient scaled to the requested number of servings,
 * formatted for display.
 */
export function scaleIngredient(
  ingredient: Ingredient,
  servings: number,
  baseServings: number,
): ScaledIngredient {
  const { name, quantity, unit, note, scalable, display } = ingredient;
  const displayName = displayIngredientName(name);

  // Non-scalable or string quantity ("naar smaak"): show as-is.
  if (!scalable || typeof quantity !== 'number') {
    const text = typeof quantity === 'string' ? quantity : display ?? '';
    const amountLabel = [text, unit].filter(Boolean).join(' ').trim();
    return { amountLabel: amountLabel || display || '', name: displayName, note };
  }

  const factor = servings / baseServings;
  const scaledValue = quantity * factor;
  const numberLabel = formatQuantity(scaledValue);

  // When a base display string exists (e.g. "½ aubergine") and we are at base
  // servings, keep the curated wording. Otherwise build from number + unit.
  const amountLabel = unit
    ? `${numberLabel} ${unit}`.trim()
    : `${numberLabel}`.trim();

  return { amountLabel, name: displayName, note };
}
