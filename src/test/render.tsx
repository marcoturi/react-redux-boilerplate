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

/**
 * Renders a route tree in an in-memory data router, like the app's router,
 * with a fresh store. `createRoutes` receives the store, as the app's
 * `createRoutes` does, so loaders dispatch to it.
 */
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

// Renders one component as the only route, so router hooks work
export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptionsWithProviders,
) {
  return renderRoutes(() => [{ path: '*', element: ui }], options);
}

/**
 * Runs `callback` (e.g. a dispatched refetch) inside `act` and waits for the
 * next animation frame: RTK Query batches its updates and notifies the UI on
 * that frame, so the rendered output is up to date when this resolves.
 */
export async function actAndFlush(callback: () => Promise<unknown>) {
  await act(async () => {
    await callback();
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
}
