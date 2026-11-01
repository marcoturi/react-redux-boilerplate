import { SettingsActions } from '@/features/settings/store';
import { subscriptionMockList } from '@/mocks/data/subscriptions';
import { setupStore } from '@/shared/store';
import type { AppStore } from '@/shared/store/types';
import { SubscriptionSelectors } from '.';
import { subscriptionApi } from './subscription.api';
import { type Subscription, SubscriptionFilters } from './subscription.type';

describe('Subscription Selector:', () => {
  let store: AppStore;

  beforeEach(() => {
    store = setupStore();
  });

  test('Should return an empty list before the request', () => {
    expect(
      SubscriptionSelectors.selectFilteredSubscriptions(store.getState()),
    ).toEqual([]);
  });

  test('Should return an empty list in case of empty data', async () => {
    const data: Subscription[] = [];

    await store.dispatch(
      subscriptionApi.util.upsertQueryData('getSubscriptions', undefined, data),
    );

    expect(
      SubscriptionSelectors.selectFilteredSubscriptions(store.getState()),
    ).toEqual(data);
  });

  test('Should return the full list of subscriptions in case of no filter', async () => {
    await store.dispatch(
      subscriptionApi.util.upsertQueryData(
        'getSubscriptions',
        undefined,
        subscriptionMockList,
      ),
    );

    expect(
      SubscriptionSelectors.selectFilteredSubscriptions(store.getState()),
    ).toEqual(subscriptionMockList);
  });

  test('Should return a filtered list in case of filter', async () => {
    await store.dispatch(
      subscriptionApi.util.upsertQueryData(
        'getSubscriptions',
        undefined,
        subscriptionMockList,
      ),
    );
    store.dispatch(
      SettingsActions.subscriptionFilterChanged(
        SubscriptionFilters.OneTimePurchase,
      ),
    );

    expect(
      SubscriptionSelectors.selectFilteredSubscriptions(store.getState()),
    ).toEqual([subscriptionMockList[2]]);
  });
});
