import { SettingsActions, SettingsSelectors } from '@/features/settings/store';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { SubscriptionFilters } from '@/features/subscriptions/store/subscription.type';
import { StorageKeys } from '@/shared/helpers/local-storage.service';
import { setupStore } from '@/shared/store/test';

const filtersKey = `${StorageKeys.settings}${SettingsKey.filters}`;

describe('Settings persistence:', () => {
  it('Should save the filter and restore it in a new store', async () => {
    setupStore().dispatch(
      SettingsActions.subscriptionFilterChanged(
        SubscriptionFilters.OneTimePurchase,
      ),
    );
    expect(JSON.parse(localStorage.getItem(filtersKey) ?? 'null')).toEqual({
      filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase,
    });

    const store = setupStore();
    await store.dispatch(SettingsActions.loadState());

    expect(
      SettingsSelectors.selectSettingByKey(
        store.getState(),
        SettingsKey.filters,
      ),
    ).toEqual({ filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase });
  });

  it('Should keep the defaults when the saved value is corrupt', async () => {
    localStorage.setItem(filtersKey, '{oops');
    const store = setupStore();

    const action = await store.dispatch(SettingsActions.loadState());

    expect(action.type).toBe(SettingsActions.loadState.fulfilled.type);
    expect(
      SettingsSelectors.selectSettingByKey(
        store.getState(),
        SettingsKey.filters,
      ),
    ).toEqual({ filterSubscriptionsBy: SubscriptionFilters.All });
  });
});
