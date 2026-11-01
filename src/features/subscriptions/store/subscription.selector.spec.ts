import { SettingsActions } from '@/features/settings/store';
import { subscriptionMockList } from '@/mocks/data/subscriptions';
import { setupStore } from '@/shared/store';
import { SubscriptionSelectors } from '.';
import { subscriptionApi } from './subscription.api';
import { type Subscription, SubscriptionFilters } from './subscription.type';

// A store whose subscriptions request already returned `data`
async function storeWithSubscriptions(data: Subscription[]) {
  const store = setupStore();
  await store.dispatch(
    subscriptionApi.util.upsertQueryData('getSubscriptions', undefined, data),
  );
  return store;
}

describe('Subscription Selector:', () => {
  test('Should return an empty list before the request', () => {
    const store = setupStore();
    expect(
      SubscriptionSelectors.selectFilteredSubscriptions(store.getState()),
    ).toEqual([]);
  });

  test('Should return an empty list in case of empty data', async () => {
    const store = await storeWithSubscriptions([]);
    expect(
      SubscriptionSelectors.selectFilteredSubscriptions(store.getState()),
    ).toEqual([]);
  });

  test('Should return the full list of subscriptions in case of no filter', async () => {
    const store = await storeWithSubscriptions(subscriptionMockList);
    expect(
      SubscriptionSelectors.selectFilteredSubscriptions(store.getState()),
    ).toEqual(subscriptionMockList);
  });

  test('Should return a filtered list in case of filter', async () => {
    const store = await storeWithSubscriptions(subscriptionMockList);
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
