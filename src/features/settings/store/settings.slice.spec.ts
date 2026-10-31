import { SubscriptionFilters } from '@/features/subscriptions/store/subscription.type';
import { SettingsActions } from '.';
import { initialStorageState, settingsSlice } from './settings.slice';
import { loadState } from './settings.thunk';
import { SettingsKey } from './settings.type';

describe('Settings Slice:', () => {
  test('Should handle loadState.fulfilled', () => {
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

  test('Should handle subscriptionFilterChanged', () => {
    const action = SettingsActions.subscriptionFilterChanged(
      SubscriptionFilters.OneTimePurchase,
    );
    expect(
      settingsSlice.reducer(undefined, action)[SettingsKey.filters],
    ).toEqual({ filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase });
  });

  test('Should ignore invalid persisted settings in loadState.fulfilled', () => {
    const action = loadState.fulfilled(
      { [SettingsKey.filters]: { filterSubscriptionsBy: 'Unknown' }, extra: 1 },
      '',
    );
    expect(settingsSlice.reducer(initialStorageState, action)).toEqual(
      initialStorageState,
    );
  });

  test('Should keep only the known fields of persisted settings', () => {
    const action = loadState.fulfilled(
      {
        [SettingsKey.filters]: {
          filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase,
          extra: 1,
        },
      },
      '',
    );
    expect(settingsSlice.reducer(initialStorageState, action)).toEqual({
      [SettingsKey.filters]: {
        filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase,
      },
    });
  });
});
