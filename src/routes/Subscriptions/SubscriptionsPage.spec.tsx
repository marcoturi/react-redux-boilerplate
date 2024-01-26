import { renderWithProviders } from '@/core/store/test';
import SubscriptionsPage from '@/routes/Subscriptions/SubscriptionsPage';
import { screen, waitFor } from '@testing-library/react';

describe('SubscriptionsPage', () => {
  test('Should load page title', async () => {
    renderWithProviders(<SubscriptionsPage />);
    const text = screen.getByText(/Subscriptions/i);
    expect(text).toBeInTheDocument();
  });
  test('Should load filters', async () => {
    renderWithProviders(<SubscriptionsPage />);
    const filters = screen.getByText('All');
    expect(filters).toBeInTheDocument();
  });
  test('Should load subscriptions', async () => {
    renderWithProviders(<SubscriptionsPage />);

    await waitFor(() => {
      expect(screen.getAllByTestId('subscription-item').length).toBe(3);
    });
  });
});
