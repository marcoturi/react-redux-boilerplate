import * as Sentry from '@sentry/react';
import { captureError } from './error-tracking.service';

vi.mock('@sentry/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@sentry/react')>()),
  captureException: vi.fn(),
}));

// Runs the scope callback that captureError passed to Sentry
function capturedScope() {
  const configure = vi.mocked(Sentry.captureException).mock.calls[0]?.[1];
  if (typeof configure !== 'function') {
    throw new Error('captureException was not called with a scope callback');
  }
  return configure(new Sentry.Scope()).getScopeData();
}

describe('captureError', () => {
  test('Should send the error with a breadcrumb and the extra data', () => {
    const error = new Error('Failed');

    captureError(error, 'Saving failed', { key: 'filters' });

    expect(Sentry.captureException).toHaveBeenCalledWith(
      error,
      expect.any(Function),
    );
    const scope = capturedScope();
    expect(scope.breadcrumbs).toEqual([
      expect.objectContaining({ level: 'error', message: 'Saving failed' }),
    ]);
    expect(scope.contexts['extra-data']).toEqual({ key: 'filters' });
  });

  test('Should send only the error without a message or data', () => {
    captureError(new Error('Failed'));

    const scope = capturedScope();
    expect(scope.breadcrumbs).toEqual([]);
    expect(scope.contexts).toEqual({});
  });
});
