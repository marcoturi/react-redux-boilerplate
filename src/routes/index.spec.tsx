import { screen } from '@testing-library/react';
import { AppRoutes } from '@/routes';
import { renderWithProviders } from '@/shared/store/test';

describe('AppRoutes', () => {
  test('Should render the not found page for unknown URLs', async () => {
    renderWithProviders(<AppRoutes />, { route: '/missing' });
    expect(
      await screen.findByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument();
  });

  test('Should render one navigation, the main landmark and the current page', async () => {
    renderWithProviders(<AppRoutes />, { route: '/subscriptions' });

    expect(
      await screen.findByRole('heading', { name: 'Subscriptions', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('navigation')).toHaveLength(1);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Subscriptions' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute(
      'aria-current',
    );
    expect(document.title).toBe('Subscriptions | React Boilerplate');
  });
});
