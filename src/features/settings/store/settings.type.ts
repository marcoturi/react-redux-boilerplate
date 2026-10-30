import {
  isSubscriptionFilter,
  type SubscriptionFilters,
} from '@/features/subscriptions/store/subscription.type';

export enum SettingsKey {
  filters = 'filters',
}

export type SettingsState = {
  [SettingsKey.filters]: {
    filterSubscriptionsBy: SubscriptionFilters;
  };
};

export interface SetValuePayload {
  key: SettingsKey;
  value: SettingsState[SettingsKey];
}

export interface RemoveValuePayload {
  key: SettingsKey;
}

export type FiltersSetting = SettingsState[SettingsKey.filters];

export function isFiltersSetting(value: unknown): value is FiltersSetting {
  return (
    typeof value === 'object' &&
    value !== null &&
    'filterSubscriptionsBy' in value &&
    typeof value.filterSubscriptionsBy === 'string' &&
    isSubscriptionFilter(value.filterSubscriptionsBy)
  );
}
