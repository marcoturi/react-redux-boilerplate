import { SettingsActions } from '@/features/settings/store/index';
import {
  initialStorageState,
  settingsSlice,
} from '@/features/settings/store/settings.slice';
import { loadState } from '@/features/settings/store/settings.thunk';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { SubscriptionFilters } from '@/features/subscriptions/store/subscription.type';

describe('Settings Slice:', () => {
  it('Should handle setItem', () => {
    const action = SettingsActions.setItem({
      key: SettingsKey.filters,
      value: {
        filterSubscriptionsBy: SubscriptionFilters.Subscription,
      },
    });
    const expectedState = {
      ...initialStorageState,
      [SettingsKey.filters]: {
        filterSubscriptionsBy: SubscriptionFilters.Subscription,
      },
    };
    expect(settingsSlice.reducer(undefined, action)).toEqual(expectedState);
  });
  it('Should handle deleteItem in case of matching key', () => {
    const action = SettingsActions.deleteItem({
      key: SettingsKey.filters,
    });
    const initialState = {
      ...initialStorageState,
      [SettingsKey.filters]: {
        filterSubscriptionsBy: SubscriptionFilters.All,
      },
    };
    const expectedState = {
      ...initialStorageState,
    };
    expect(settingsSlice.reducer(initialState, action)).toEqual(expectedState);
  });
  it('Should handle deleteItem in case of not matching key', () => {
    const action = SettingsActions.deleteItem({
      key: 'unknown' as SettingsKey,
    });
    const initialState = {
      ...initialStorageState,
      [SettingsKey.filters]: {
        filterSubscriptionsBy: SubscriptionFilters.All,
      },
    };
    expect(settingsSlice.reducer(initialState, action)).toEqual(initialState);
  });
  it('Should handle loadState.fulfilled', () => {
    const thunkResult = {
      [SettingsKey.filters]: {
        filterSubscriptionsBy: SubscriptionFilters.All,
      },
    };
    const action = loadState.fulfilled(thunkResult, '');
    const expectedState = {
      ...initialStorageState,
      ...thunkResult,
    };
    expect(settingsSlice.reducer(initialStorageState, action)).toEqual(
      expectedState,
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
