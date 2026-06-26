import React, { createContext, useContext, useMemo, useState } from 'react';

import type { Settings } from '../types';

/**
 * App-wide user settings.
 *
 * Held in memory for the MVP. Swap the useState for AsyncStorage-backed state
 * later to persist between sessions without changing the consumer API.
 */

const DEFAULT_SETTINGS: Settings = {
  goal: 'gezond-eten',
  defaultServings: 1,
  preferredSeason: 'lente-zomer',
  dietaryPreferences: [],
  showMicronutrients: true,
};

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      updateSettings: (patch) =>
        setSettings((prev) => ({ ...prev, ...patch })),
    }),
    [settings],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
