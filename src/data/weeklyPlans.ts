import { getIsoWeekNumber, seasonFromDate } from '../constants/labels';
import type { Season, WeeklyPlan } from '../types';

/**
 * Two full seasonal week plans (maandag t/m zondag).
 *
 * Meals reference dish ids stored in Supabase. To edit a plan, just swap an
 * id — the dashboard, week screen and detail screen all resolve ids lazily.
 */

export const weeklyPlans: WeeklyPlan[] = [
  {
    season: 'lente-zomer',
    days: [
      {
        day: 'maandag',
        meals: {
          ontbijt: 'ontbijt-mango-overnight-oats',
          lunch: 'lunch-hummus-avocado-sandwich',
          tussendoortje: ['snack-kwark-bessen'],
          diner: 'diner-pasta-norma',
        },
      },
      {
        day: 'dinsdag',
        meals: {
          ontbijt: 'ontbijt-volkoren-toast-avocado',
          lunch: 'lunch-roggebrood-makreel',
          tussendoortje: ['snack-appel-amandel'],
          diner: 'diner-couscous-halloumi',
        },
      },
      {
        day: 'woensdag',
        meals: {
          ontbijt: 'ontbijt-skyr-bowl-bessen',
          lunch: 'lunch-pastasalade-witte-bonen',
          tussendoortje: ['snack-hummus-groente'],
          diner: 'diner-kip-teriyaki-rijst',
        },
      },
      {
        day: 'donderdag',
        meals: {
          ontbijt: 'ontbijt-smoothie-bowl',
          lunch: 'lunch-couscous-kikkererwten-feta',
          tussendoortje: ['snack-kwark-bessen'],
          diner: 'diner-pasta-norma',
        },
      },
      {
        day: 'vrijdag',
        meals: {
          ontbijt: 'ontbijt-zomerkwark-perzik',
          lunch: 'lunch-hummus-avocado-sandwich',
          tussendoortje: ['snack-appel-amandel'],
          diner: 'diner-couscous-halloumi',
        },
      },
      {
        day: 'zaterdag',
        meals: {
          ontbijt: 'ontbijt-mango-overnight-oats',
          lunch: 'lunch-roggebrood-makreel',
          tussendoortje: ['snack-hummus-groente', 'snack-kwark-bessen'],
          diner: 'diner-kip-teriyaki-rijst',
        },
      },
      {
        day: 'zondag',
        meals: {
          ontbijt: 'ontbijt-volkoren-toast-avocado',
          lunch: 'lunch-pastasalade-witte-bonen',
          tussendoortje: ['snack-appel-amandel'],
          diner: 'diner-pasta-norma',
        },
      },
    ],
  },
  {
    season: 'herfst-winter',
    days: [
      {
        day: 'maandag',
        meals: {
          ontbijt: 'ontbijt-skyr-bowl-bessen',
          lunch: 'lunch-couscous-kikkererwten-feta',
          tussendoortje: ['snack-noten-fruit'],
          diner: 'diner-kikkererwten-curry',
        },
      },
      {
        day: 'dinsdag',
        meals: {
          ontbijt: 'ontbijt-smoothie-bowl',
          lunch: 'lunch-hummus-avocado-sandwich',
          tussendoortje: ['snack-appel-amandel'],
          diner: 'diner-zalm-zoete-aardappel',
        },
      },
      {
        day: 'woensdag',
        meals: {
          ontbijt: 'ontbijt-zomerkwark-perzik',
          lunch: 'lunch-roggebrood-makreel',
          tussendoortje: ['snack-hummus-groente'],
          diner: 'diner-zoete-aardappel-bonen',
        },
      },
      {
        day: 'donderdag',
        meals: {
          ontbijt: 'ontbijt-mango-overnight-oats',
          lunch: 'lunch-pastasalade-witte-bonen',
          tussendoortje: ['snack-noten-fruit'],
          diner: 'diner-pasta-norma',
        },
      },
      {
        day: 'vrijdag',
        meals: {
          ontbijt: 'ontbijt-volkoren-toast-avocado',
          lunch: 'lunch-couscous-kikkererwten-feta',
          tussendoortje: ['snack-appel-amandel'],
          diner: 'diner-kip-teriyaki-rijst',
        },
      },
      {
        day: 'zaterdag',
        meals: {
          ontbijt: 'ontbijt-skyr-bowl-bessen',
          lunch: 'lunch-hummus-avocado-sandwich',
          tussendoortje: ['snack-noten-fruit', 'snack-hummus-groente'],
          diner: 'diner-zalm-zoete-aardappel',
        },
      },
      {
        day: 'zondag',
        meals: {
          ontbijt: 'ontbijt-smoothie-bowl',
          lunch: 'lunch-roggebrood-makreel',
          tussendoortje: ['snack-appel-amandel'],
          diner: 'diner-kikkererwten-curry',
        },
      },
    ],
  },
];

export function getWeeklyPlan(season: Season): WeeklyPlan {
  const plan = weeklyPlans.find((p) => p.season === season);
  // Both seasons are always present; fall back to the first for safety.
  return plan ?? weeklyPlans[0];
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

/**
 * Picks the week plan for a given date: the season follows the calendar
 * (herfst/winter dishes in the cold months) and odd ISO weeks get a rotated
 * variation of the seasonal plan so the menu alternates week to week.
 */
export function getWeeklyPlanForDate(date: Date): WeeklyPlan {
  const basePlan = getWeeklyPlan(seasonFromDate(date));
  const isOddWeek = getIsoWeekNumber(date) % 2 === 1;
  return isOddWeek ? rotatePlan(basePlan, 3) : basePlan;
}
