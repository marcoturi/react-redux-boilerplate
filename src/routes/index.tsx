import * as Sentry from '@sentry/react';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { type RouteObject, useLocation, useRoutes } from 'react-router';
import { UserWidget } from '@/features/user/components';
import { Container } from '@/UI/Elements/Container';
import { ErrorFallback } from '@/UI/Elements/ErrorFallback';
import { SkeletonList } from '@/UI/Elements/SkeletonList';
import { Header, type MenuItem } from '@/UI/Layout/Header';

const HomePage = lazy(() => import('@/routes/Home/HomePage'));
const SubscriptionsPage = lazy(
  () => import('@/routes/Subscriptions/SubscriptionsPage'),
);
const NotFoundPage = lazy(() => import('@/routes/NotFound/NotFoundPage'));

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/subscriptions', element: <SubscriptionsPage /> },
  { path: '*', element: <NotFoundPage /> },
] satisfies RouteObject[];

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Subscriptions', href: '/subscriptions' },
] satisfies MenuItem[];

// Reports page loads and navigations to Sentry under the route pattern
const useSentryRoutes = Sentry.wrapUseRoutes(useRoutes);

export function AppRoutes() {
  const location = useLocation();
  const element = useSentryRoutes(routes);

  return (
    <>
      <Header menuItems={menuItems} rightWidget={<UserWidget />} />
      <main>
        {/* A crash or a failed chunk replaces only the page: the header stays */}
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          resetKeys={[location.pathname]}
        >
          <Suspense
            fallback={
              <Container>
                <SkeletonList />
              </Container>
            }
          >
            {element}
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  );
}
