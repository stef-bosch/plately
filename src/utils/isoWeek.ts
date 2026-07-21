import { getIsoWeekNumber } from '../constants/labels';

/**
 * ISO week helpers for the week-menu builder: weeks run Monday–Sunday and are
 * identified as "2026-W30" so a hand-built week can be stored and looked up.
 */

const MONTHS = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
];

/** Monday 00:00 of the ISO week containing `date`. */
export function startOfIsoWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const isoDay = d.getDay() || 7; // Mon=1 .. Sun=7
  d.setDate(d.getDate() - (isoDay - 1));
  return d;
}

/**
 * The ISO week-numbering year, which can differ from the calendar year around
 * New Year (e.g. 1 Jan 2027 belongs to week 53 of 2026).
 */
export function getIsoWeekYear(date: Date): number {
  const thursday = startOfIsoWeek(date);
  thursday.setDate(thursday.getDate() + 3); // the Thursday decides the ISO year
  return thursday.getFullYear();
}

/** Stable id for the week containing `date`, e.g. "2026-W07". */
export function weekIdFor(date: Date): string {
  const week = getIsoWeekNumber(date);
  return `${getIsoWeekYear(date)}-W${String(week).padStart(2, '0')}`;
}

export function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

/** e.g. "26 mei – 1 juni 2026" for the week containing `date`. */
export function formatWeekRange(date: Date): string {
  const start = startOfIsoWeek(date);
  const end = addWeeks(start, 1);
  end.setDate(end.getDate() - 1);

  const startPart =
    start.getMonth() === end.getMonth()
      ? `${start.getDate()}`
      : `${start.getDate()} ${MONTHS[start.getMonth()]}`;
  return `${startPart} – ${end.getDate()} ${MONTHS[end.getMonth()]} ${end.getFullYear()}`;
}

/** The calendar date of a given weekday index (0 = Monday) in that week. */
export function dayDateInWeek(date: Date, dayIndex: number): Date {
  const d = startOfIsoWeek(date);
  d.setDate(d.getDate() + dayIndex);
  return d;
}

/** e.g. "26 mei" */
export function formatDayShort(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}
