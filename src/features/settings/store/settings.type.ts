import { SubscriptionFilters } from '@/features/subscriptions/components/subscription.types';

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
  value: any;
}

export interface RemoveValuePayload {
  key: SettingsKey;
}
