import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { subscriptionApi } from '@/features/subscriptions/store/subscription.api';
import { SubscriptionFilters } from '@/features/subscriptions/store/subscription.type';
import { worker } from '@/mocks/browser';
import { subscriptionMockList } from '@/mocks/data/subscriptions';
import { subscriptionsFailOnce } from '@/mocks/handlers/subscriptions';
import env from '@/shared/config/env';
import { actAndFlush, renderWithProviders } from '@/test/render';
import { readStoredSetting } from '@/test/storage';
import SubscriptionsPage from './SubscriptionsPage';

// Each subscription card has a level 2 heading with its name
const findCards = () => screen.findAllByRole('heading', { level: 2 });
const getCards = () => screen.getAllByRole('heading', { level: 2 });

describe('SubscriptionsPage', () => {
  test('Should load page title', async () => {
    renderWithProviders(<SubscriptionsPage />);
    expect(
      screen.getByRole('heading', { name: 'Subscriptions', level: 1 }),
    ).toBeInTheDocument();
    // Let the request finish inside the test
    expect(await findCards()).toHaveLength(3);
  });

  test('Should load subscriptions', async () => {
    renderWithProviders(<SubscriptionsPage />);

    expect(await findCards()).toHaveLength(3);
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
    worker.use(
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
    expect(await findCards()).toHaveLength(3);
  });

  test('Should keep the loaded list when a refetch fails', async () => {
    const { store } = renderWithProviders(<SubscriptionsPage />);
    expect(await findCards()).toHaveLength(3);

    worker.use(subscriptionsFailOnce());
    await actAndFlush(() =>
      store.dispatch(
        subscriptionApi.endpoints.getSubscriptions.initiate(undefined, {
          forceRefetch: true,
          subscribe: false,
        }),
      ),
    );

    expect(
      subscriptionApi.endpoints.getSubscriptions.select()(store.getState())
        .isError,
    ).toBe(true);
    expect(getCards()).toHaveLength(3);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should filter the list and save the filter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SubscriptionsPage />);
    expect(await findCards()).toHaveLength(3);

    const filter = screen.getByRole('combobox', { name: 'Type' });
    expect(filter).toHaveTextContent('All');

    await user.click(filter);
    await user.click(screen.getByRole('option', { name: 'One Time Purchase' }));

    expect(filter).toHaveTextContent('One Time Purchase');
    expect(getCards()).toHaveLength(1);
    expect(
      screen.getByRole('heading', { name: 'Lifetime Purchase' }),
    ).toBeInTheDocument();
    expect(readStoredSetting(SettingsKey.filters)).toEqual({
      filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase,
    });
  });
});
