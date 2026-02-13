import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import UserWidget from '@/features/user/components/UserWidget';
import { Header } from '@/UI/Layout/Header';

const HomePage = lazy(() => import('@/routes/Home/HomePage'));
const SubscriptionsPage = lazy(
  () => import('@/routes/Subscriptions/SubscriptionsPage'),
);

export function AppRoutes() {
  const routes = [
    {
      path: '*',
      element: <HomePage />,
    },
    {
      path: '/subscriptions',
      element: <SubscriptionsPage />,
    },
  ];

  const element = useRoutes([...routes]);

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
      {element}
    </>
  );
}
