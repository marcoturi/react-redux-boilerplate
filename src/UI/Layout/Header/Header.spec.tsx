import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/shared/store/test';
import { Header, type MenuItem } from '.';

describe('Header', () => {
  test('Should load and display a App title and a navigation menu', () => {
    const menuItems = [
      { label: 'Home', href: '/', testId: 'home-link' },
      {
        label: 'Subscriptions',
        href: '/subscriptions',
        testId: 'subscription-link',
      },
    ] satisfies MenuItem[];

    renderWithProviders(<Header menuItems={menuItems} />);

    expect(screen.getByText(/react boilerplate/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getByRole('link', { name: 'Subscriptions' })).toHaveAttribute(
      'href',
      '/subscriptions',
    );
  });
});
