import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation, useRoutes } from 'react-router';
import { UserWidget } from '@/features/user/components/UserWidget';
import { Container } from '@/UI/Elements/Container';
import { ErrorFallback } from '@/UI/Elements/ErrorFallback';
import { SkeletonList } from '@/UI/Elements/SkeletonList';
import { Header } from '@/UI/Layout/Header';

const HomePage = lazy(() => import('@/routes/Home/HomePage'));
const SubscriptionsPage = lazy(
  () => import('@/routes/Subscriptions/SubscriptionsPage'),
);
const NotFoundPage = lazy(() => import('@/routes/NotFound/NotFoundPage'));

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/subscriptions', element: <SubscriptionsPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export function AppRoutes() {
  const location = useLocation();
  const element = useRoutes(routes);

  return (
    <>
      <Header
        rightWidget={<UserWidget />}
        menuItems={[
          { label: 'Home', href: '/', testId: 'home-link' },
          {
            label: 'Subscriptions',
            href: '/subscriptions',
            testId: 'subscription-link',
          },
        ]}
      />
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
    </>
  );
}
