import { SubscriptionSelectors } from '.';
import { initialStorageState } from '@/features/settings/store/settings.slice';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { SubscriptionFilters } from '@/features/subscriptions/components/subscription.types';
import { subscriptionApi } from '@/features/subscriptions/store/subscription.api';
import { subscriptionMockList } from '@/features/subscriptions/store/subscription.mocks.spec';
import { Subscription } from '@/features/subscriptions/store/subscription.type';
import { setupStore } from '@/shared/store/test';

describe('Subscription Selector:', () => {
  let store;

  beforeEach(() => {
    store = setupStore();
  });

  it('Should return an empty list in case of no data', async () => {
    const data = [];

    await store.dispatch(
      subscriptionApi.util.upsertQueryData('getSubscriptions', undefined, data),
    );

    expect(
      SubscriptionSelectors.getSubscriptionListFiltered(store.getState()),
    ).toEqual(data);
  });

  it('Should return the full list of subscriptions in case of no filter', async () => {
    await store.dispatch(
      subscriptionApi.util.upsertQueryData(
        'getSubscriptions',
        undefined,
        subscriptionMockList as Subscription[],
      ),
    );

    expect(
      SubscriptionSelectors.getSubscriptionListFiltered(store.getState()),
    ).toEqual(subscriptionMockList);
  });

  it('Should return a filtered list in case of filter', async () => {
    await store.dispatch(
      subscriptionApi.util.upsertQueryData(
        'getSubscriptions',
        undefined,
        subscriptionMockList as Subscription[],
      ),
    );

    const expectedState = {
      ...store.getState(),
      settings: {
        ...initialStorageState,
        [SettingsKey.filters]: {
          filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase,
        },
      },
    };
    expect(
      SubscriptionSelectors.getSubscriptionListFiltered(expectedState),
    ).toEqual([subscriptionMockList[2]]);
  });
});
