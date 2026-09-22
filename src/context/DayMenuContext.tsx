import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';

import type { MealType } from '../types';

/**
 * The day menu: the dishes the user has planned for "today", each pinned to a
 * meal moment (slot). The dashboard shows one row per moment and sums the
 * nutrition of everything planned. Persisted on web via localStorage so it
 * survives a reload; on native it degrades to in-memory (swap in AsyncStorage
 * later without changing the consumer API).
 */

export interface DayMenuEntry {
  /** Unique per add, so duplicates of the same dish can be removed individually. */
  id: string;
  recipeId: string;
  /**
   * The meal moment this dish is planned for. Optional for legacy entries saved
   * before slots existed — the dashboard then falls back to the dish's mealType.
   */
  slot?: MealType;
}

const STORAGE_KEY = 'plately.dayMenu.v1';
const MEAL_TYPES: MealType[] = ['ontbijt', 'lunch', 'diner', 'tussendoortje'];

const webStorage: Storage | null =
  Platform.OS === 'web' && typeof localStorage !== 'undefined' ? localStorage : null;

function loadInitialEntries(): DayMenuEntry[] {
  try {
    const raw = webStorage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    // Keep only well-formed entries so a corrupt store can't crash the dashboard.
    return parsed
      .filter(
        (e): e is { id: string; recipeId: string; slot?: unknown } =>
          typeof e === 'object' &&
          e !== null &&
          typeof (e as DayMenuEntry).id === 'string' &&
          typeof (e as DayMenuEntry).recipeId === 'string',
      )
      .map((e) => ({
        id: e.id,
        recipeId: e.recipeId,
        slot: MEAL_TYPES.includes(e.slot as MealType)
          ? (e.slot as MealType)
          : undefined,
      }));
  } catch {
    return [];
  }
}

let entryCounter = 0;
function newEntryId(): string {
  entryCounter += 1;
  return `${Date.now().toString(36)}-${entryCounter}`;
}

interface DayMenuContextValue {
  entries: DayMenuEntry[];
  /** Plans a dish for a meal moment (appends; duplicates are allowed). */
  addToDayMenu: (recipeId: string, slot: MealType) => void;
  /** Removes a single entry by its entry id. */
  removeFromDayMenu: (entryId: string) => void;
  /** Empties the whole day menu. */
  clearDayMenu: () => void;
}

const DayMenuContext = createContext<DayMenuContextValue | undefined>(undefined);

export function DayMenuProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<DayMenuEntry[]>(loadInitialEntries);

  useEffect(() => {
    try {
      webStorage?.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Ignore write failures (private mode, quota) — state still works.
    }
  }, [entries]);

  const value = useMemo<DayMenuContextValue>(
    () => ({
      entries,
      addToDayMenu: (recipeId, slot) =>
        setEntries((prev) => [...prev, { id: newEntryId(), recipeId, slot }]),
      removeFromDayMenu: (entryId) =>
        setEntries((prev) => prev.filter((e) => e.id !== entryId)),
      clearDayMenu: () => setEntries([]),
    }),
    [entries],
  );

  return (
    <DayMenuContext.Provider value={value}>{children}</DayMenuContext.Provider>
  );
}

export function useDayMenu(): DayMenuContextValue {
  const ctx = useContext(DayMenuContext);
  if (!ctx) {
    throw new Error('useDayMenu must be used within a DayMenuProvider');
  }
  return ctx;
}
