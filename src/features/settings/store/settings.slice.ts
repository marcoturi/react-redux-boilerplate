import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SubscriptionFilters } from '@/features/subscriptions/store/subscription.type';
import { loadState } from './settings.thunk';
import {
  isFiltersSetting,
  SettingsKey,
  type SettingsState,
} from './settings.type';

export const initialState: SettingsState = {
  [SettingsKey.filters]: {
    filterSubscriptionsBy: SubscriptionFilters.All,
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    subscriptionFilterChanged: (
      state,
      action: PayloadAction<SubscriptionFilters>,
    ) => {
      state[SettingsKey.filters].filterSubscriptionsBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadState.fulfilled, (state, action) => {
      const filters = action.payload[SettingsKey.filters];
      if (isFiltersSetting(filters)) {
        state[SettingsKey.filters].filterSubscriptionsBy =
          filters.filterSubscriptionsBy;
      }
    });
  },
  selectors: {
    selectFilters: (state) => state[SettingsKey.filters],
    selectSubscriptionFilter: (state) =>
      state[SettingsKey.filters].filterSubscriptionsBy,
  },
});
