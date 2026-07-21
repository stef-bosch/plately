import { dayOrder, dishCategory, getIsoWeekNumber, seasonFromDate } from '../constants/labels';
import { weekIdFor } from '../utils/isoWeek';
import { getStoredWeekMenu, getWeekmenuDishes } from './content';
import type { Recipe, Season, StoredWeekMenu, WeekDay, WeeklyPlan } from '../types';

/**
 * The weekly menu is built on the fly from the dishes added under the admin's
 * "Weekmenu" tab. Each meal slot draws from its own category pool (Ontbijt /
 * Lunch / Diner / Tussendoortjes), cycling through the pool so the whole week
 * fills out even with only a handful of dishes. Dishes with an "Overig"
 * category never enter the meal slots.
 */

/** The dish id at `dayIndex`, cycling through the pool; '' when it's empty. */
function pick(pool: Recipe[], dayIndex: number): string {
  return pool.length ? pool[dayIndex % pool.length].id : '';
}

export function getWeeklyPlan(season: Season): WeeklyPlan {
  const dishes = getWeekmenuDishes();

  const poolFor = (category: string): Recipe[] => {
    const inCategory = dishes.filter((r) => dishCategory(r) === category);
    // Prefer dishes for the current season; fall back to all if that empties it.
    const seasonal = inCategory.filter((r) => r.seasons.includes(season));
    const pool = seasonal.length ? seasonal : inCategory;
    // Stable order so the generated plan doesn't shuffle between renders.
    return [...pool].sort((a, b) => a.id.localeCompare(b.id));
  };

  const breakfast = poolFor('Ontbijt');
  const lunch = poolFor('Lunch');
  const dinner = poolFor('Diner');
  const snack = poolFor('Tussendoortjes');

  const days: WeekDay[] = dayOrder.map((day, i) => ({
    day,
    meals: {
      ontbijt: pick(breakfast, i),
      lunch: pick(lunch, i),
      tussendoortje: snack.length ? [pick(snack, i)] : [],
      diner: pick(dinner, i),
    },
  }));

  return { season, days };
}

/**
 * Rotates the meals across the week by `offset` days, keeping each calendar day
 * label in place. This reuses the existing dishes but re-pairs them with other
 * days, so even and odd weeks feel like a different menu without new data.
 */
function rotatePlan(plan: WeeklyPlan, offset: number): WeeklyPlan {
  const { days } = plan;
  const shift = ((offset % days.length) + days.length) % days.length;
  if (shift === 0) return plan;
  return {
    ...plan,
    days: days.map((day, index) => ({
      day: day.day,
      meals: days[(index + shift) % days.length].meals,
    })),
  };
}

/** Turns a hand-built week menu into the plan shape the screens consume. */
function planFromStored(stored: StoredWeekMenu, season: Season): WeeklyPlan {
  return {
    season,
    days: dayOrder.map((day) => ({
      day,
      meals: stored.days?.[day] ?? { ontbijt: '', lunch: '', tussendoortje: [], diner: '' },
    })),
  };
}

/**
 * The week plan for a given date. A week assembled by hand in the admin always
 * wins; weeks that were never built fall back to the generated plan (the season
 * follows the calendar, and odd ISO weeks get a rotated variation so the menu
 * alternates week to week).
 */
export function getWeeklyPlanForDate(date: Date): WeeklyPlan {
  const season = seasonFromDate(date);
  const stored = getStoredWeekMenu(weekIdFor(date));
  if (stored) return planFromStored(stored, season);

  const basePlan = getWeeklyPlan(season);
  const isOddWeek = getIsoWeekNumber(date) % 2 === 1;
  return isOddWeek ? rotatePlan(basePlan, 3) : basePlan;
}
