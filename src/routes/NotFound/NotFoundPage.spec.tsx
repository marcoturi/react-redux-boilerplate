import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/render';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage', () => {
  test('Should link back to the home page', () => {
    renderWithProviders(<NotFoundPage />, { route: '/missing' });
    expect(
      screen.getByRole('heading', { name: /page not found/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute(
      'href',
      '/',
    );
  });
});
