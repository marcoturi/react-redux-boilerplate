import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { storageMiddleware } from '@/features/settings/store/settings.effect';
import { settingsSlice } from '@/features/settings/store/settings.slice';
import { sentryReduxEnhancer } from '@/shared/config/sentry';
import baseApi from '@/shared/store/api';
import env from '../config/env';

export const rootReducer = combineReducers({
  api: baseApi.reducer,
  settings: settingsSlice.reducer,
});

export const storeConfig = {
  reducer: rootReducer,
  devTools: env.IS_DEV,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().prepend(sentryReduxEnhancer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      baseApi.middleware,
      storageMiddleware.middleware,
    ),
};

export const store = configureStore(storeConfig);
