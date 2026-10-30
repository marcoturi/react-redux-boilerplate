import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loadState } from '@/features/settings/store/settings.thunk';
import {
  isFiltersSetting,
  type RemoveValuePayload,
  SettingsKey,
  type SettingsState,
  type SetValuePayload,
} from '@/features/settings/store/settings.type';
import { SubscriptionFilters } from '@/features/subscriptions/store/subscription.type';

export const initialStorageState: SettingsState = {
  [SettingsKey.filters]: {
    filterSubscriptionsBy: SubscriptionFilters.All,
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialStorageState,
  reducers: {
    setItem: (state, action: PayloadAction<SetValuePayload>) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    deleteItem: (state, action: PayloadAction<RemoveValuePayload>) => {
      const { key } = action.payload;
      if (key in initialStorageState) {
        state[key] = initialStorageState[key];
      }
    },
    subscriptionFilterChanged: (
      state,
      action: PayloadAction<SubscriptionFilters>,
    ) => {
      state[SettingsKey.filters].filterSubscriptionsBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Persisted values come from localStorage: keep only valid known fields
    builder.addCase(loadState.fulfilled, (state, action) => {
      const filters = action.payload[SettingsKey.filters];
      if (isFiltersSetting(filters)) state[SettingsKey.filters] = filters;
    });
  },
});
