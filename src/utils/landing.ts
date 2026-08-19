import { Platform } from 'react-native';

/**
 * First-open landing page tracking. The intro page is shown once; after the
 * user taps "Naar de app" the flag is set so later launches open the app
 * directly. Web-only persistence (localStorage); on native it degrades to
 * showing the page each launch, which is fine for the web-first PWA.
 */

const LANDING_KEY = 'plately.landingSeen';

const webStorage: Storage | null =
  Platform.OS === 'web' && typeof localStorage !== 'undefined' ? localStorage : null;

export function hasSeenLanding(): boolean {
  try {
    return webStorage?.getItem(LANDING_KEY) === '1';
  } catch {
    return false;
  }
}

export function markLandingSeen(): void {
  try {
    webStorage?.setItem(LANDING_KEY, '1');
  } catch {
    // Ignore write failures (private mode, quota).
  }
}
