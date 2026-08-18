import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';

/**
 * The day menu: a running list of dishes the user has added for "today". It is
 * a flat list of recipe ids (each add is a separate entry so the same dish can
 * appear twice, e.g. two snacks); the dashboard groups them by meal type and
 * sums their nutrition. Persisted on web via localStorage so it survives a
 * reload; on native it degrades to in-memory (swap in AsyncStorage later without
 * changing the consumer API).
 */

export interface DayMenuEntry {
  /** Unique per add, so duplicates of the same dish can be removed individually. */
  id: string;
  recipeId: string;
}

const STORAGE_KEY = 'plately.dayMenu.v1';

const webStorage: Storage | null =
  Platform.OS === 'web' && typeof localStorage !== 'undefined' ? localStorage : null;

function loadInitialEntries(): DayMenuEntry[] {
  try {
    const raw = webStorage?.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    // Keep only well-formed entries so a corrupt store can't crash the dashboard.
    return parsed.filter(
      (e): e is DayMenuEntry =>
        typeof e === 'object' &&
        e !== null &&
        typeof (e as DayMenuEntry).id === 'string' &&
        typeof (e as DayMenuEntry).recipeId === 'string',
    );
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
  /** Adds a dish to the day menu (appends; duplicates are allowed). */
  addToDayMenu: (recipeId: string) => void;
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
      addToDayMenu: (recipeId) =>
        setEntries((prev) => [...prev, { id: newEntryId(), recipeId }]),
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
