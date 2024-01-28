import { Header } from '@/UI/Layout/Header';
import UserWidget from '@/features/user/components/UserWidget';
import HomePage from '@/routes/Home/HomePage';
import SubscriptionsPage from '@/routes/Subscriptions/SubscriptionsPage';
import { useRoutes } from 'react-router-dom';

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
