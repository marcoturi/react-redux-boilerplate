import {
  isSubscriptionFilter,
  type SubscriptionFilters,
} from '@/features/subscriptions/store/subscription.type';

export const SettingsKey = {
  filters: 'filters',
} as const;
export type SettingsKey = (typeof SettingsKey)[keyof typeof SettingsKey];

export type SettingsState = {
  [SettingsKey.filters]: {
    filterSubscriptionsBy: SubscriptionFilters;
  };
};

export type FiltersSetting = SettingsState[typeof SettingsKey.filters];

export function isFiltersSetting(value: unknown): value is FiltersSetting {
  return (
    typeof value === 'object' &&
    value !== null &&
    'filterSubscriptionsBy' in value &&
    isSubscriptionFilter(value.filterSubscriptionsBy)
  );
}
