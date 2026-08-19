import { Platform } from 'react-native';

/**
 * Turns the web build into an installable, auto-updating PWA.
 *
 * The Metro web bundler generates a fixed index.html with no manifest link or
 * service-worker registration, so we add them at runtime (web only). The
 * manifest + icons + service-worker are served from the `public/` directory,
 * which Expo copies to the root of the web build.
 *
 * Auto-update is handled by the network-first service worker: when online the
 * app always loads the newest deploy, and a new worker takes over immediately.
 */
export function setupPwa(): void {
  if (Platform.OS !== 'web') return;
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const head = document.head;

  const ensureLink = (rel: string, href: string, extra?: Record<string, string>) => {
    if (document.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (extra) for (const [k, v] of Object.entries(extra)) link.setAttribute(k, v);
    head.appendChild(link);
  };

  const ensureMeta = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      head.appendChild(meta);
    }
    meta.content = content;
  };

  // Web app manifest (installability) + theme.
  ensureLink('manifest', '/manifest.json');
  ensureMeta('theme-color', '#FF7A1A');
  ensureMeta('application-name', 'Plately');

  // Browser-tab favicon: the same chef-hat app icon.
  ensureLink('icon', '/icons/icon-192.png', { type: 'image/png', sizes: '192x192' });

  // iOS "Add to Home Screen" support.
  ensureMeta('apple-mobile-web-app-capable', 'yes');
  ensureMeta('apple-mobile-web-app-status-bar-style', 'default');
  ensureMeta('apple-mobile-web-app-title', 'Plately');
  ensureLink('apple-touch-icon', '/icons/apple-touch-icon.png');

  // Register the service worker once the page has loaded.
  if ('serviceWorker' in navigator) {
    const register = () => {
      navigator.serviceWorker.register('/service-worker.js').catch(() => {
        // Service workers only run over HTTPS (or localhost); ignore failures
        // in unsupported contexts so the app keeps working as a normal web app.
      });
    };
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }
}
