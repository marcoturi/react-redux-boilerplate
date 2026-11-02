import * as Sentry from '@sentry/react';
import type { ComponentType } from 'react';
import {
  createBrowserRouter,
  Outlet,
  type RouteObject,
  useNavigation,
} from 'react-router';
import { SubscriptionApi } from '@/features/subscriptions/store';
import { UserWidget } from '@/features/user/components';
import type { AppStore } from '@/shared/store/types';
import { Container } from '@/UI/Elements/Container';
import { ErrorFallback } from '@/UI/Elements/ErrorFallback';
import { SkeletonList } from '@/UI/Elements/SkeletonList';
import { Header, type MenuItem } from '@/UI/Layout/Header';

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Subscriptions', href: '/subscriptions' },
] satisfies MenuItem[];

// Pages are route modules with a default export, loaded on navigation
const page = (load: () => Promise<{ default: ComponentType }>) => async () =>
  (await load()).default;

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <>
      {/* The previous page stays until the next one is ready */}
      {isLoading && (
        <div
          aria-label="Loading page"
          className="fixed inset-x-0 top-0 z-45 h-0.5 bg-primary motion-safe:animate-pulse"
          role="progressbar"
        />
      )}
      <Header menuItems={menuItems} rightWidget={<UserWidget />} />
      <main aria-busy={isLoading}>
        <Outlet />
      </main>
    </>
  );
}

function PageSkeleton() {
  return (
    <Container>
      <SkeletonList />
    </Container>
  );
}

/**
 * The route tree. Loaders run in the browser when a navigation starts, in
 * parallel with the page download: they start the page's requests and do not
 * wait for them, so pages keep showing their own loading and error states.
 */
export function createRoutes(store: AppStore) {
  return [
    {
      Component: AppLayout,
      // A crash in the layout (header, user widget): without it React Router
      // shows its built-in error screen, stack trace included
      ErrorBoundary: ErrorFallback,
      children: [
        {
          // A crash, a failed page chunk or a failed loader replaces only the
          // page: the header stays. The error clears on the next navigation.
          ErrorBoundary: ErrorFallback,
          // Shown on the first load until the page module is ready
          HydrateFallback: PageSkeleton,
          children: [
            {
              index: true,
              lazy: { Component: page(() => import('./Home/HomePage')) },
            },
            {
              path: 'subscriptions',
              loader: () => {
                store.dispatch(SubscriptionApi.prefetchSubscriptions());
              },
              lazy: {
                Component: page(
                  () => import('./Subscriptions/SubscriptionsPage'),
                ),
              },
            },
            {
              path: '*',
              lazy: {
                Component: page(() => import('./NotFound/NotFoundPage')),
              },
            },
          ],
        },
      ],
    },
  ] satisfies RouteObject[];
}

// Reports page loads and navigations to Sentry under the route pattern
const createSentryBrowserRouter =
  Sentry.wrapCreateBrowserRouter(createBrowserRouter);

export function createAppRouter(store: AppStore) {
  return createSentryBrowserRouter(createRoutes(store));
}
