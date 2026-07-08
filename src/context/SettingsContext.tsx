import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';

import type { Settings } from '../types';

/**
 * App-wide user settings, persisted on web via localStorage so the profile and
 * preferences survive a reload. On native it degrades to in-memory (swap in
 * AsyncStorage later without changing the consumer API).
 */

const STORAGE_KEY = 'plately.settings.v1';

const DEFAULT_SETTINGS: Settings = {
  defaultServings: 1,
  energyNeed: 'gemiddeld',
  preferredSeason: 'lente-zomer',
  dietaryPreferences: [],
  nutritionProfile: {
    sex: 'male',
    ageYears: 30,
    heightCm: 180,
    weightKg: 80,
    activityLevel: 'moderate',
    goal: 'maintain',
    proteinProfile: 'active',
    manualKcalTarget: null,
  },
};

const webStorage: Storage | null =
  Platform.OS === 'web' && typeof localStorage !== 'undefined' ? localStorage : null;

/** Merge stored settings onto the defaults so new fields always have a value. */
function mergeSettings(stored: Partial<Settings> | null): Settings {
  if (!stored) return DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    nutritionProfile: {
      ...DEFAULT_SETTINGS.nutritionProfile,
      ...(stored.nutritionProfile ?? {}),
    },
  };
}

function loadInitialSettings(): Settings {
  try {
    const raw = webStorage?.getItem(STORAGE_KEY);
    if (raw) return mergeSettings(JSON.parse(raw) as Partial<Settings>);
  } catch {
    // Corrupt/unavailable storage — fall back to defaults.
  }
  return DEFAULT_SETTINGS;
}

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadInitialSettings);

  useEffect(() => {
    try {
      webStorage?.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore write failures (private mode, quota) — state still works.
    }
  }, [settings]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      updateSettings: (patch) => setSettings((prev) => ({ ...prev, ...patch })),
    }),
    [settings],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
