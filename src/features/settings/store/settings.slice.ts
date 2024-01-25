import { loadState } from '@/features/settings/store/settings.thunk';
import {
  RemoveValuePayload,
  SettingsKey,
  SettingsState,
  SetValuePayload,
} from '@/features/settings/store/settings.type';
import { SubscriptionFilters } from '@/features/subscriptions/components/subscription.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
      return { ...state, [key]: value };
    },
    deleteItem: (state, action: PayloadAction<RemoveValuePayload>) => {
      const { key } = action.payload;
      if (key in initialStorageState) {
        return { ...state, [key]: initialStorageState[key] };
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadState.fulfilled, (state, action) => ({
      ...state,
      ...action.payload,
    }));
  },
});
