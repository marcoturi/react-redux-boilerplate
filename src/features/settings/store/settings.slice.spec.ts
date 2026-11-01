import { SubscriptionFilters } from '@/features/subscriptions/store/subscription.type';
import { SettingsActions } from '.';
import { initialState, settingsSlice } from './settings.slice';
import { SettingsKey } from './settings.type';

const { reducer } = settingsSlice;

describe('Settings Slice:', () => {
  test('Should handle loadState.fulfilled', () => {
    const thunkResult = {
      [SettingsKey.filters]: {
        filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase,
      },
    };
    const action = SettingsActions.loadState.fulfilled(thunkResult, '');
    expect(reducer(initialState, action)).toEqual(thunkResult);
  });

  test('Should handle subscriptionFilterChanged', () => {
    const action = SettingsActions.subscriptionFilterChanged(
      SubscriptionFilters.OneTimePurchase,
    );
    expect(reducer(undefined, action)[SettingsKey.filters]).toEqual({
      filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase,
    });
  });

  test('Should ignore invalid persisted settings in loadState.fulfilled', () => {
    const action = SettingsActions.loadState.fulfilled(
      { [SettingsKey.filters]: { filterSubscriptionsBy: 'Unknown' }, extra: 1 },
      '',
    );
    expect(reducer(initialState, action)).toEqual(initialState);
  });

  test('Should keep only the known fields of persisted settings', () => {
    const action = SettingsActions.loadState.fulfilled(
      {
        [SettingsKey.filters]: {
          filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase,
          extra: 1,
        },
      },
      '',
    );
    expect(reducer(initialState, action)).toEqual({
      [SettingsKey.filters]: {
        filterSubscriptionsBy: SubscriptionFilters.OneTimePurchase,
      },
    });
  });
});
