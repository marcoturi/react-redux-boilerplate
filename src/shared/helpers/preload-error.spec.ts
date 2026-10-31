import { reloadOnPreloadError } from './preload-error';

describe('reloadOnPreloadError', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('Should reload once and cancel the event', () => {
    const reload = vi.fn();
    const event = new Event('vite:preloadError', { cancelable: true });

    reloadOnPreloadError(event, reload);

    expect(reload).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(true);
  });

  test('Should not reload again within 10 seconds', () => {
    const reload = vi.fn();
    reloadOnPreloadError(new Event('vite:preloadError'), reload);
    vi.advanceTimersByTime(5000);

    const event = new Event('vite:preloadError', { cancelable: true });
    reloadOnPreloadError(event, reload);

    expect(reload).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(false);
  });

  test('Should reload again after 10 seconds', () => {
    const reload = vi.fn();
    reloadOnPreloadError(new Event('vite:preloadError'), reload);
    vi.advanceTimersByTime(10_000);
    reloadOnPreloadError(new Event('vite:preloadError'), reload);

    expect(reload).toHaveBeenCalledTimes(2);
  });
});
