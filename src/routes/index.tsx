import { Header } from '@/UI/Elements/Header';
import UserWidget from '@/features/user/components/UserWidget';
import HomePage from '@/routes/Home/HomePage';
import SettingsPage from '@/routes/Settings/SettingsPage';
import { useRoutes } from 'react-router-dom';

export function AppRoutes() {
  const routes = [
    {
      path: '*',
      element: <HomePage />,
    },
    {
      path: '/settings',
      element: <SettingsPage />,
    },
  ];

  const element = useRoutes([...routes]);

  return (
    <>
      <Header
        rightWidget={<UserWidget />}
        menuItems={[
          { label: 'Home', href: '/' },
          { label: 'Settings', href: '/settings' },
        ]}
      />
      {element}
    </>
  );
}
