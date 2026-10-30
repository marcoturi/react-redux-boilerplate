const RELOADED_AT_KEY = 'preload-error-reloaded-at';
const MIN_RELOAD_INTERVAL_MS = 10_000;

/**
 * Handles Vite's `vite:preloadError`: a new deploy can remove the chunks an
 * open tab still references, and a reload fetches the current ones
 * (https://vite.dev/guide/build#load-error-handling). It reloads at most once
 * every 10 s, so a chunk that can never load (offline, blocked) reaches the
 * page error boundary instead of reloading forever.
 */
export function reloadOnPreloadError(
  event: Event,
  reload = () => window.location.reload(),
) {
  try {
    const reloadedAt = Number(sessionStorage.getItem(RELOADED_AT_KEY));
    if (Date.now() - reloadedAt < MIN_RELOAD_INTERVAL_MS) return;
    sessionStorage.setItem(RELOADED_AT_KEY, String(Date.now()));
  } catch {
    // Storage is blocked: without a guard, let the error reach the boundary
    return;
  }
  // Vite rethrows the error unless the event is cancelled
  event.preventDefault();
  reload();
}
