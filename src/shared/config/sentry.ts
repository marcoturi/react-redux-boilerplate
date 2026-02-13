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
});

export const sentryReduxEnhancer = Sentry.createReduxEnhancer();
