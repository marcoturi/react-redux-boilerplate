import { SettingsActions } from '@/features/settings/store/index';
import {
  initialStorageState,
  settingsSlice,
} from '@/features/settings/store/settings.slice';
import { loadState } from '@/features/settings/store/settings.thunk';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { SubscriptionFilters } from '@/features/subscriptions/components/subscription.types';

describe('Settings Slice:', () => {
  it('Should handle setItem', () => {
    const action = SettingsActions.setItem({
      key: SettingsKey.filters,
      value: {
        filterSubscriptionsBy: 'test',
      },
    });
    const expectedState = {
      ...initialStorageState,
      [SettingsKey.filters]: {
        filterSubscriptionsBy: 'test',
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
      key: 'unknown' as any,
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
    const action = (loadState as any).fulfilled(thunkResult);
    const expectedState = {
      ...initialStorageState,
      ...thunkResult,
    };
    expect(settingsSlice.reducer(initialStorageState, action)).toEqual(
      expectedState,
    );
  });
});
