import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { settingsSlice } from '@/features/settings/store/settings.slice';
import env from '@/shared/config/env';
import { sentryReduxEnhancer } from '@/shared/config/sentry';
import baseApi from '@/shared/store/api';
import { listenerMiddleware } from '@/shared/store/listener';
// Feature effects register their listeners when imported
import '@/features/settings/store/settings.effect';

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  settings: settingsSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// Options are passed inline so the callbacks get their types from
// configureStore; tests call it with a preloaded state. Keep `middleware`
// before `enhancers` (the enhancers type depends on the inferred middleware)
// and concat the Sentry enhancer: it is typed `any`, and prepending it erases
// the thunk dispatch type.
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    devTools: env.IS_DEV,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(
        baseApi.middleware,
        listenerMiddleware.middleware,
      ),
    enhancers: (getDefaultEnhancers) =>
      getDefaultEnhancers().concat(sentryReduxEnhancer),
  });
}

export const store = setupStore();
