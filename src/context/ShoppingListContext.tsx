import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';

/**
 * The shopping list: dishes the user added (each with a chosen number of
 * servings) plus which aggregated items they've ticked off. Ingredients are
 * derived from the entries at render time (see utils/shoppingList). Persisted
 * on web via localStorage; in-memory on native (web-first PWA).
 */

export interface ShoppingListEntry {
  /** Unique per add, so the same dish can be added twice. */
  id: string;
  recipeId: string;
  servings: number;
}

const ENTRIES_KEY = 'plately.shoppingList.v1';
const CHECKED_KEY = 'plately.shoppingList.checked.v1';
const HIDDEN_KEY = 'plately.shoppingList.hidden.v1';

const webStorage: Storage | null =
  Platform.OS === 'web' && typeof localStorage !== 'undefined' ? localStorage : null;

function loadEntries(): ShoppingListEntry[] {
  try {
    const raw = webStorage?.getItem(ENTRIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is ShoppingListEntry =>
        typeof e === 'object' &&
        e !== null &&
        typeof (e as ShoppingListEntry).id === 'string' &&
        typeof (e as ShoppingListEntry).recipeId === 'string' &&
        typeof (e as ShoppingListEntry).servings === 'number',
    );
  } catch {
    return [];
  }
}

function loadStringArray(storageKey: string): string[] {
  try {
    const raw = webStorage?.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

let counter = 0;
function newId(): string {
  counter += 1;
  return `${Date.now().toString(36)}-${counter}`;
}

interface ShoppingListContextValue {
  entries: ShoppingListEntry[];
  checked: Set<string>;
  /** Adds a dish to the list for the given number of servings (duplicates ok). */
  addToShoppingList: (recipeId: string, servings: number) => void;
  /** Removes one dish entry by its id. */
  removeEntry: (id: string) => void;
  /** Empties the whole list (dishes + ticks). */
  clear: () => void;
  /** Toggles an aggregated item's "got it" tick, keyed by its stable item key. */
  toggleChecked: (itemKey: string) => void;
  /** Item keys the user removed from the list by hand (kept out of the view). */
  hidden: Set<string>;
  /** Hides one aggregated item from the list (e.g. "already have it"). */
  hideItem: (itemKey: string) => void;
}

const ShoppingListContext = createContext<ShoppingListContextValue | undefined>(
  undefined,
);

export function ShoppingListProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<ShoppingListEntry[]>(loadEntries);
  const [checkedArr, setCheckedArr] = useState<string[]>(() =>
    loadStringArray(CHECKED_KEY),
  );
  const [hiddenArr, setHiddenArr] = useState<string[]>(() =>
    loadStringArray(HIDDEN_KEY),
  );

  useEffect(() => {
    try {
      webStorage?.setItem(ENTRIES_KEY, JSON.stringify(entries));
    } catch {
      // Ignore write failures (private mode, quota).
    }
  }, [entries]);

  useEffect(() => {
    try {
      webStorage?.setItem(CHECKED_KEY, JSON.stringify(checkedArr));
    } catch {
      // Ignore write failures.
    }
  }, [checkedArr]);

  useEffect(() => {
    try {
      webStorage?.setItem(HIDDEN_KEY, JSON.stringify(hiddenArr));
    } catch {
      // Ignore write failures.
    }
  }, [hiddenArr]);

  const value = useMemo<ShoppingListContextValue>(
    () => ({
      entries,
      checked: new Set(checkedArr),
      hidden: new Set(hiddenArr),
      addToShoppingList: (recipeId, servings) =>
        setEntries((prev) => [...prev, { id: newId(), recipeId, servings }]),
      removeEntry: (id) => setEntries((prev) => prev.filter((e) => e.id !== id)),
      clear: () => {
        setEntries([]);
        setCheckedArr([]);
        setHiddenArr([]);
      },
      toggleChecked: (itemKey) =>
        setCheckedArr((prev) =>
          prev.includes(itemKey)
            ? prev.filter((k) => k !== itemKey)
            : [...prev, itemKey],
        ),
      hideItem: (itemKey) =>
        setHiddenArr((prev) =>
          prev.includes(itemKey) ? prev : [...prev, itemKey],
        ),
    }),
    [entries, checkedArr, hiddenArr],
  );

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList(): ShoppingListContextValue {
  const ctx = useContext(ShoppingListContext);
  if (!ctx) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return ctx;
}
