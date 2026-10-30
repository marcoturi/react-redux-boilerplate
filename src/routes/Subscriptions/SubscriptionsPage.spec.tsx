import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { SubscriptionFilters } from '@/features/subscriptions/store/subscription.type';
import SubscriptionsPage from '@/routes/Subscriptions/SubscriptionsPage';
import env from '@/shared/config/env';
import { StorageKeys } from '@/shared/helpers/local-storage.service';
import { renderWithProviders } from '@/shared/store/test';
import { server } from '@/test/server';

describe('SubscriptionsPage', () => {
  test('Should load page title', () => {
    renderWithProviders(<SubscriptionsPage />);
    expect(
      screen.getByRole('heading', { name: 'Subscriptions', level: 1 }),
    ).toBeInTheDocument();
  });

  test('Should load subscriptions', async () => {
    renderWithProviders(<SubscriptionsPage />);

    expect(await screen.findAllByTestId('subscription-item')).toHaveLength(3);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3);
    expect(
      screen.getByRole('button', { name: 'Buy Lifetime Purchase' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Type' })).toBeInTheDocument();
  });

  test('Should show an error and retry when the request fails', async () => {
    server.use(
      http.get(
        `${env.API_URL}/subscriptions`,
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

  test('Should filter the list and save the filter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SubscriptionsPage />);
    expect(await screen.findAllByTestId('subscription-item')).toHaveLength(3);

    const filter = screen.getByRole('combobox', { name: 'Type' });
    expect(filter).toHaveTextContent('All');

    await user.click(filter);
    await user.click(screen.getByRole('option', { name: 'One Time Purchase' }));

    expect(filter).toHaveTextContent('One Time Purchase');
    expect(screen.getAllByTestId('subscription-item')).toHaveLength(1);
    expect(
      screen.getByRole('heading', { name: 'Lifetime Purchase' }),
    ).toBeInTheDocument();
    expect(
      JSON.parse(
        localStorage.getItem(`${StorageKeys.settings}${SettingsKey.filters}`) ??
          'null',
      ),
    ).toEqual({ filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase });
  });
});
