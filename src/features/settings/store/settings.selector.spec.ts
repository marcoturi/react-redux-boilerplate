import { SubscriptionFilters } from '@/features/subscriptions/store/subscription.type';
import { setupStore } from '@/shared/store';
import { SettingsActions, SettingsSelectors } from '.';

describe('Settings Selector:', () => {
  test('Should return the subscription filter', () => {
    const store = setupStore();
    expect(SettingsSelectors.selectSubscriptionFilter(store.getState())).toBe(
      SubscriptionFilters.All,
    );

    store.dispatch(
      SettingsActions.subscriptionFilterChanged(
        SubscriptionFilters.OneTimePurchase,
      ),
    );
    expect(SettingsSelectors.selectSubscriptionFilter(store.getState())).toBe(
      SubscriptionFilters.OneTimePurchase,
    );
  });
});
