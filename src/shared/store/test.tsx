import { storeConfig } from '@/shared/store/index';
import { RootState } from '@/shared/store/types';
import { configureStore } from '@reduxjs/toolkit';
import { render } from 'vitest-browser-react';
import React from 'react';
import { Provider } from 'react-redux';

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    ...storeConfig,
    preloadedState,
  });

type AppStore = ReturnType<typeof setupStore>;

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<any, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
  }: ExtendedRenderOptions = {},
) {
  const rend = render(<Provider store={store}>{ui}</Provider>);
  return rend;
}

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<any, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}
