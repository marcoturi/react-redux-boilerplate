import env from '../config/env';
import baseApi from '@/core/store/api';
import { storageMiddleware } from '@/features/settings/store/settings.effect';
import { settingsSlice } from '@/features/settings/store/settings.slice';
import { configureStore } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: env.SENTRY_DSN,
  release: env.VERSION,
  enabled: !env.IS_DEV,
  environment: env.NODE_ENV,
  tracesSampleRate: 0.1,
  attachStacktrace: true,
  integrations: [new Sentry.Replay()],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
});

const sentryReduxEnhancer = Sentry.createReduxEnhancer();

export const store = configureStore({
  reducer: {
    api: baseApi.reducer,
    settings: settingsSlice.reducer,
  },
  devTools: env.IS_DEV,
  enhancers: (getDefaultEnhancers) =>
    // eslint-disable-next-line unicorn/prefer-spread
    getDefaultEnhancers().concat(sentryReduxEnhancer),
  middleware: (getDefaultMiddleware) =>
    // eslint-disable-next-line unicorn/prefer-spread
    getDefaultMiddleware().concat(
      baseApi.middleware,
      storageMiddleware.middleware,
    ) as any,
});
