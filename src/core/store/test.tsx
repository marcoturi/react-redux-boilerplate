import {  RootState } from '@/core/store/types';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { storeConfig } from '@/core/store/index';

const setupStore = (preloadedState?: Partial<RootState>) => configureStore({
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
  // eslint-disable-next-line @typescript-eslint/ban-types
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

/**
 * This function is used to mock the state of the store to test the selectors.
 * However, is quite fragile, and it's better to use the real store.
 * https://github.com/reduxjs/redux-toolkit/discussions/4016
 */
export function getMockedState({
  functionName,
  parameters,
  data,
}: {
  functionName: string;
  parameters?: any;
  data?: any;
}) {
  const state: any = {};
  if (data) {
    state.data = data;
  }
  return {
    api: {
      queries: {
        [`${functionName}(${
          parameters ? JSON.stringify(parameters) : 'undefined'
        })`]: state,
      },
    },
  } as any;
}
