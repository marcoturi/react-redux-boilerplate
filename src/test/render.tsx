import { act, type RenderOptions, render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, type RouteObject } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { setupStore } from '@/shared/store';
import type { AppStore, RootState } from '@/shared/store/types';

// The providers come from these helpers: callers cannot replace the wrapper
type RenderOptionsWithProviders = Omit<RenderOptions, 'queries' | 'wrapper'> & {
  preloadedState?: Partial<RootState>;
  // Initial URL of the in-memory router
  route?: string;
};

export function renderRoutes(
  createRoutes: (store: AppStore) => RouteObject[],
  {
    preloadedState,
    route = '/',
    ...renderOptions
  }: RenderOptionsWithProviders = {},
) {
  const store = setupStore(preloadedState);
  const router = createMemoryRouter(createRoutes(store), {
    initialEntries: [route],
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>,
      renderOptions,
    ),
  };
}

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptionsWithProviders,
) {
  return renderRoutes(() => [{ path: '*', element: ui }], options);
}

export async function actAndFlush(callback: () => Promise<unknown>) {
  await act(async () => {
    await callback();
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
}
