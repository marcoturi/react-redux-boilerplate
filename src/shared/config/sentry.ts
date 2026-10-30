import * as Sentry from '@sentry/react';
import env from './env';

Sentry.init({
  dsn: env.SENTRY_DSN,
  release: env.VERSION,
  enabled: !env.IS_DEV,
  environment: env.NODE_ENV,
  tracesSampleRate: 0.1,
  attachStacktrace: true,
  integrations: [Sentry.replayIntegration()],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  // Since v11 an unset dataCollection collects user info, cookies and HTTP
  // bodies by default. Keep the privacy-preserving v10 defaults.
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: {
      request: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
      response: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
    },
    httpBodies: [],
    urlQueryParams: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
  },
});

export const sentryReduxEnhancer = Sentry.createReduxEnhancer();
