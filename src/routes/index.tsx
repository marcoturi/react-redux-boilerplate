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

const page = (load: () => Promise<{ default: ComponentType }>) => async () =>
  (await load()).default;

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <>
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

export function createRoutes(store: AppStore) {
  return [
    {
      Component: AppLayout,
      ErrorBoundary: ErrorFallback,
      children: [
        {
          ErrorBoundary: ErrorFallback,
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

const createSentryBrowserRouter =
  Sentry.wrapCreateBrowserRouter(createBrowserRouter);

export function createAppRouter(store: AppStore) {
  return createSentryBrowserRouter(createRoutes(store));
}
