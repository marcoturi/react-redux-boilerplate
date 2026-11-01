import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { subscriptionApi } from '@/features/subscriptions/store/subscription.api';
import { SubscriptionFilters } from '@/features/subscriptions/store/subscription.type';
import { subscriptionMockList } from '@/mocks/data/subscriptions';
import { subscriptionsFailOnce } from '@/mocks/handlers/subscriptions';
import { server } from '@/mocks/node';
import env from '@/shared/config/env';
import { renderWithProviders } from '@/test/render';
import { readStoredSetting } from '@/test/storage';
import SubscriptionsPage from './SubscriptionsPage';

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
    // The retry waits until the test lets it answer
    let respond: (value: void) => void = () => {};
    const responded = new Promise<void>((resolve) => {
      respond = resolve;
    });
    server.use(
      subscriptionsFailOnce(),
      http.get(
        `${env.API_URL}/subscriptions`,
        async () => {
          await responded;
          return HttpResponse.json(subscriptionMockList);
        },
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
    expect(await screen.findByRole('status')).toHaveTextContent('Loading');
    expect(screen.queryByText('No subscriptions')).not.toBeInTheDocument();

    respond();
    expect(await screen.findAllByTestId('subscription-item')).toHaveLength(3);
  });

  test('Should keep the loaded list when a refetch fails', async () => {
    const { store } = renderWithProviders(<SubscriptionsPage />);
    expect(await screen.findAllByTestId('subscription-item')).toHaveLength(3);

    server.use(subscriptionsFailOnce());
    await act(async () => {
      await store.dispatch(
        subscriptionApi.endpoints.getSubscriptions.initiate(undefined, {
          forceRefetch: true,
          subscribe: false,
        }),
      );
      // RTK Query batches the rejection and notifies the UI on the next frame
      await new Promise((resolve) => requestAnimationFrame(resolve));
    });

    expect(
      subscriptionApi.endpoints.getSubscriptions.select()(store.getState())
        .isError,
    ).toBe(true);
    expect(screen.getAllByTestId('subscription-item')).toHaveLength(3);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
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
    expect(readStoredSetting(SettingsKey.filters)).toEqual({
      filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase,
    });
  });
});
