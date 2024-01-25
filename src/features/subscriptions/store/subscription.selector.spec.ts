import { SubscriptionSelectors } from '.';
import { getMockedState } from '@/core/store/test';
import { initialStorageState } from '@/features/settings/store/settings.slice';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { SubscriptionFilters } from '@/features/subscriptions/components/subscription.types';
import { subscriptionMockList } from '@/features/subscriptions/store/subscription.mocks.spec';

describe('Subscription Selector:', () => {
  it('Should return an empty list in case of no data', () => {
    const subscriptionExpectedState = getMockedState({
      functionName: 'getSubscriptions',
      data: [],
    });
    const expectedState = {
      settings: initialStorageState,
      ...subscriptionExpectedState,
    };
    expect(
      SubscriptionSelectors.getSubscriptionListFiltered(expectedState),
    ).toEqual([]);
  });

  it('Should return the full list of subscriptions in case of no filter', () => {
    const subscriptionExpectedState = getMockedState({
      functionName: 'getSubscriptions',
      data: subscriptionMockList,
    });
    const expectedState = {
      settings: initialStorageState,
      ...subscriptionExpectedState,
    };
    expect(
      SubscriptionSelectors.getSubscriptionListFiltered(expectedState),
    ).toEqual(subscriptionMockList);
  });

  it('Should return a filtered list in case of filter', () => {
    const subscriptionExpectedState = getMockedState({
      functionName: 'getSubscriptions',
      data: subscriptionMockList,
    });
    const expectedState = {
      settings: {
        ...initialStorageState,
        [SettingsKey.filters]: {
          filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase,
        },
      },
      ...subscriptionExpectedState,
    };
    expect(
      SubscriptionSelectors.getSubscriptionListFiltered(expectedState),
    ).toEqual([subscriptionMockList[2]]);
  });
});
