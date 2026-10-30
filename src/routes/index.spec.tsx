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
});
