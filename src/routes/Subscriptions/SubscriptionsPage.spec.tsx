import SubscriptionsPage from '@/routes/Subscriptions/SubscriptionsPage';
import { renderWithProviders } from '@/shared/store/test';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('SubscriptionsPage', () => {
  test('Should load page title', () => {
    renderWithProviders(<SubscriptionsPage />);
    const text = screen.getByText(/subscriptions/i);
    expect(text).toBeInTheDocument();
  });
  test('Should load subscriptions', async () => {
    renderWithProviders(<SubscriptionsPage />);

    await waitFor(() => {
      expect(screen.getAllByTestId('subscription-item').length).toBe(3);
    });
  });

  test('Should handle a change in filters', async () => {
    renderWithProviders(<SubscriptionsPage />);
    const user = userEvent.setup();

    // Filter should be present
    const optionSelect = screen.getByRole('combobox');
    expect(optionSelect).toBeInTheDocument();
    expect(screen.queryByText('All')).toBeInTheDocument();
    expect(screen.queryByText('One Time Purchase')).not.toBeInTheDocument();

    // Options should be clickable
    await user.click(optionSelect);
    const oneTimePurchase = screen.getByRole('option', {
      name: 'One Time Purchase',
    });
    expect(oneTimePurchase).toBeInTheDocument();
    await user.click(oneTimePurchase);
    expect(screen.queryByText('One Time Purchase')).toBeInTheDocument();
    expect(screen.queryByText('All')).not.toBeInTheDocument();
  });
});
