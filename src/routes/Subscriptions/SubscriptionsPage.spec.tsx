import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import SubscriptionsPage from '@/routes/Subscriptions/SubscriptionsPage';
import { renderWithProviders } from '@/shared/store/test';
import { config } from '@/test/config';
import { server } from '@/test/server';

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

  test('Should show an error and retry when the request fails', async () => {
    server.use(
      http.get(
        `${config.API_URL}/subscriptions`,
        () => HttpResponse.json({ message: 'Server Error' }, { status: 500 }),
        { once: true },
      ),
    );
    const user = userEvent.setup();
    renderWithProviders(<SubscriptionsPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not load the subscriptions',
    );
    expect(screen.queryByText('No subscriptions')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findAllByTestId('subscription-item')).toHaveLength(3);
  });

  test('Should handle a change in filters', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SubscriptionsPage />);

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
