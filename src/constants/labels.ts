import type {
  DietaryPreference,
  MealType,
  Recipe,
  Season,
  WeekDayName,
} from '../types';

/** Central place for all Dutch UI copy that maps from data keys. */

export const mealTypeLabel: Record<MealType, string> = {
  ontbijt: 'Ontbijt',
  lunch: 'Lunch',
  diner: 'Diner',
  tussendoortje: 'Tussendoortje',
};

/**
 * Dish categories shown on the "Gerechten" tab. The four meal categories are
 * derived from a dish's `mealType`; the rest come from its free-text
 * `overigCategory` (set in the admin). Order = display order in the filter.
 */
export const MEAL_CATEGORIES = [
  'Ontbijt',
  'Lunch',
  'Tussendoortjes',
  'Diner',
] as const;

export const OTHER_CATEGORIES = [
  'Voorgerechten',
  'Hoofdgerechten',
  'Bijgerechten',
  'Sauzen',
  'Desserts & gebak',
  'Borrelhapjes & snacks',
  'Dranken & cocktails',
] as const;

export const DISH_CATEGORIES: string[] = [
  ...MEAL_CATEGORIES,
  ...OTHER_CATEGORIES,
];

const MEALTYPE_TO_CATEGORY: Record<MealType, string> = {
  ontbijt: 'Ontbijt',
  lunch: 'Lunch',
  tussendoortje: 'Tussendoortjes',
  diner: 'Diner',
};

/** Reverse of the above — only the four meal categories map to a mealType. */
export const CATEGORY_TO_MEALTYPE: Record<string, MealType> = {
  Ontbijt: 'ontbijt',
  Lunch: 'lunch',
  Tussendoortjes: 'tussendoortje',
  Diner: 'diner',
};

/** The single category a dish belongs to in the "Gerechten" overview. */
export function dishCategory(
  recipe: Pick<Recipe, 'mealType' | 'overigCategory'>,
): string {
  const custom = recipe.overigCategory?.trim();
  return custom || MEALTYPE_TO_CATEGORY[recipe.mealType];
}

export const seasonLabel: Record<Season, string> = {
  'lente-zomer': 'Lente / zomer',
  'herfst-winter': 'Herfst / winter',
};

export const dayLabel: Record<WeekDayName, string> = {
  maandag: 'Maandag',
  dinsdag: 'Dinsdag',
  woensdag: 'Woensdag',
  donderdag: 'Donderdag',
  vrijdag: 'Vrijdag',
  zaterdag: 'Zaterdag',
  zondag: 'Zondag',
};

export const dayShort: Record<WeekDayName, string> = {
  maandag: 'Ma',
  dinsdag: 'Di',
  woensdag: 'Wo',
  donderdag: 'Do',
  vrijdag: 'Vr',
  zaterdag: 'Za',
  zondag: 'Zo',
};

export const dayOrder: WeekDayName[] = [
  'maandag',
  'dinsdag',
  'woensdag',
  'donderdag',
  'vrijdag',
  'zaterdag',
  'zondag',
];

export const dietaryLabel: Record<DietaryPreference, string> = {
  vegetarisch: 'Vegetarisch',
  vegan: 'Vegan',
  lactosevrij: 'Lactosevrij',
  glutenvrij: 'Glutenvrij',
  halal: 'Halal',
};

/** Maps a JS Date weekday (0 = Sunday) onto our Dutch week ordering. */
export function weekDayFromDate(date: Date): WeekDayName {
  // JS: 0 Sun .. 6 Sat. Our array starts on Monday.
  const jsDay = date.getDay();
  const index = jsDay === 0 ? 6 : jsDay - 1;
  return dayOrder[index];
}

const dutchMonths = [
  'januari',
  'februari',
  'maart',
  'april',
  'mei',
  'juni',
  'juli',
  'augustus',
  'september',
  'oktober',
  'november',
  'december',
];

/** e.g. "donderdag 26 juni" */
export function formatDutchDate(date: Date): string {
  const day = dayLabel[weekDayFromDate(date)].toLowerCase();
  return `${day} ${date.getDate()} ${dutchMonths[date.getMonth()]}`;
}

/** Picks the active season based on the calendar month (NL climate). */
export function seasonFromDate(date: Date): Season {
  const month = date.getMonth(); // 0-11
  // April (3) through September (8) = lente/zomer.
  return month >= 3 && month <= 8 ? 'lente-zomer' : 'herfst-winter';
}

/**
 * ISO-8601 week number (weeks start on Monday; week 1 contains the first
 * Thursday of the year). Returns 1–53.
 */
export function getIsoWeekNumber(date: Date): number {
  // Work on a UTC copy so daylight-saving shifts can't move us across a day.
  const target = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  // ISO day of week: Mon=1 .. Sun=7.
  const dayNumber = target.getUTCDay() || 7;
  // Shift to the Thursday of this week — that determines the ISO year/week.
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
