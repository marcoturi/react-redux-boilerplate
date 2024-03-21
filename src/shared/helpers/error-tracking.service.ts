import * as Sentry from '@sentry/react';

export function captureError(err: any, msg?: string, data?: any) {
  Sentry.captureException(err, (scope) => {
    if (msg) {
      scope.addBreadcrumb({
        type: 'error', // predefined types
        category: 'error',
        level: 'error',
        message: msg,
      });
    }

    if (data) {
      scope.setContext('extra-data', data);
    }
    return scope;
  });
}
