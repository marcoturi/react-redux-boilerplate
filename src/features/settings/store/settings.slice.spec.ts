import { SettingsActions } from '@/features/settings/store/index';
import {
  initialStorageState,
  settingsSlice,
} from '@/features/settings/store/settings.slice';
import { loadState } from '@/features/settings/store/settings.thunk';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { SubscriptionFilters } from '@/features/subscriptions/store/subscription.type';

describe('Settings Slice:', () => {
  it('Should handle loadState.fulfilled', () => {
    const thunkResult = {
      [SettingsKey.filters]: {
        filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase,
      },
    };
    const action = loadState.fulfilled(thunkResult, '');
    expect(settingsSlice.reducer(initialStorageState, action)).toEqual(
      thunkResult,
    );
  });
  it('Should handle subscriptionFilterChanged', () => {
    const action = SettingsActions.subscriptionFilterChanged(
      SubscriptionFilters.OneTimePurchase,
    );
    expect(
      settingsSlice.reducer(undefined, action)[SettingsKey.filters],
    ).toEqual({ filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase });
  });
  it('Should ignore invalid persisted settings in loadState.fulfilled', () => {
    const action = loadState.fulfilled(
      { [SettingsKey.filters]: { filterSubscriptionsBy: 'Unknown' }, extra: 1 },
      '',
    );
    expect(settingsSlice.reducer(initialStorageState, action)).toEqual(
      initialStorageState,
    );
  });
});
