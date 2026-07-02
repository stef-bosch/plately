import { Platform } from 'react-native';

/**
 * One-time "welcome" popup tracking.
 *
 * On web we persist a flag in `localStorage` so the popup only ever shows on the
 * very first load of the web app. Off-web there's no storage wired up yet, so we
 * fall back to an in-memory flag (shown once per app session).
 */

const WELCOME_KEY = 'plately.welcomeSeen';

let shownThisSession = false;

export function hasSeenWelcome(): boolean {
  if (Platform.OS === 'web') {
    try {
      return window.localStorage.getItem(WELCOME_KEY) === 'true';
    } catch {
      // Storage can be blocked (private mode); fall back to the session flag.
      return shownThisSession;
    }
  }
  return shownThisSession;
}

export function markWelcomeSeen(): void {
  shownThisSession = true;
  if (Platform.OS === 'web') {
    try {
      window.localStorage.setItem(WELCOME_KEY, 'true');
    } catch {
      // Ignore: we still won't reshow this session via `shownThisSession`.
    }
  }
}
