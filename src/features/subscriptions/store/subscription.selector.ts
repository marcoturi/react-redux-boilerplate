import { createSelector } from '@reduxjs/toolkit';
import { SettingsSelectors } from '@/features/settings/store';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { SubscriptionFilters } from '@/features/subscriptions/components/subscription.types';
import { subscriptionApi } from '@/features/subscriptions/store/subscription.api';
import {
  type Subscription,
  SubscriptionType,
} from '@/features/subscriptions/store/subscription.type';

const subscriptionTypeMap: Record<
  SubscriptionFilters,
  SubscriptionType | undefined
> = {
  [SubscriptionFilters.All]: undefined,
  [SubscriptionFilters.Subscription]: SubscriptionType.Subscription,
  [SubscriptionFilters.OneTimePurchase]: SubscriptionType.OneTimePurchase,
};

export const getSubscriptionListFiltered = createSelector(
  subscriptionApi.endpoints.getSubscriptions.select(),
  (state) => SettingsSelectors.getSettingByKey(state, SettingsKey.filters),
  (subscriptions, filters): Subscription[] => {
    if (!subscriptions.data) return [];
    if (filters.filterSubscriptionsBy === SubscriptionFilters.All) {
      return subscriptions.data;
    }

    const targetType = subscriptionTypeMap[filters.filterSubscriptionsBy];
    return subscriptions.data.filter((s) => s.type === targetType);
  },
);
