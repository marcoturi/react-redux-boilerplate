import { storeConfig } from '@/shared/store/index';
import { RootState } from '@/shared/store/types';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import React, { JSX, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    ...storeConfig,
    preloadedState,
  });

type AppStore = ReturnType<typeof setupStore>;

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren): JSX.Element {
    return <BrowserRouter><Provider store={store}>{children}</Provider></BrowserRouter>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}
