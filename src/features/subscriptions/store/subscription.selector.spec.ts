import { SettingsActions } from '@/features/settings/store';
import { subscriptionApi } from '@/features/subscriptions/store/subscription.api';
import { subscriptionMockList } from '@/features/subscriptions/store/subscription.mocks.spec';
import {
  type Subscription,
  SubscriptionFilters,
} from '@/features/subscriptions/store/subscription.type';
import { setupStore } from '@/shared/store/test';
import type { AppStore } from '@/shared/store/types';
import { SubscriptionSelectors } from '.';

describe('Subscription Selector:', () => {
  let store: AppStore;

  beforeEach(() => {
    store = setupStore();
  });

  it('Should return an empty list before the request', () => {
    expect(
      SubscriptionSelectors.selectFilteredSubscriptions(store.getState()),
    ).toEqual([]);
  });

  it('Should return an empty list in case of empty data', async () => {
    const data: Subscription[] = [];

    await store.dispatch(
      subscriptionApi.util.upsertQueryData('getSubscriptions', undefined, data),
    );

    expect(
      SubscriptionSelectors.selectFilteredSubscriptions(store.getState()),
    ).toEqual(data);
  });

  it('Should return the full list of subscriptions in case of no filter', async () => {
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

  it('Should return a filtered list in case of filter', async () => {
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
