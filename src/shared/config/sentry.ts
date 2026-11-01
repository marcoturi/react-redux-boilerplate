import * as Sentry from '@sentry/react';
import { useEffect } from 'react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router';
import env from './env';

// Only builds report, and only with a DSN: not the dev server, not Vitest.
// Without a DSN the SDK sends nothing and does not parse the value.
const dsn = env.IS_PROD ? env.SENTRY_DSN : undefined;

Sentry.init({
  dsn,
  release: env.VERSION,
  environment: env.MODE,
  tracesSampleRate: 0.1,
  attachStacktrace: true,
  // Page load and navigation spans named after the route pattern; the router
  // is created with Sentry.wrapCreateBrowserRouter (src/routes/index.tsx)
  integrations: [
    Sentry.reactRouterBrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  // Used by the replay integration, added below once loaded from the CDN
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

// Session replay is large: load it from the Sentry CDN instead of the initial
// bundle, only where Sentry is enabled. A Content Security Policy must allow
// https://browser.sentry-cdn.com.
if (dsn) {
  Sentry.lazyLoadIntegration('replayIntegration')
    .then((replayIntegration) => {
      Sentry.addIntegration(replayIntegration());
    })
    .catch(() => {
      // Blocked or offline: keep error reporting without replays
    });
}

export const sentryReduxEnhancer = Sentry.createReduxEnhancer();
