import { SettingsSelectors } from '@/features/settings/store';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { subscriptionApi } from '@/features/subscriptions/store/subscription.api';
import {
  type Subscription,
  SubscriptionFilters,
  SubscriptionType,
} from '@/features/subscriptions/store/subscription.type';
import { createAppSelector } from '@/shared/store/selectors';
import type { RootState } from '@/shared/store/types';

const subscriptionTypeMap: Record<
  SubscriptionFilters,
  SubscriptionType | undefined
> = {
  [SubscriptionFilters.All]: undefined,
  [SubscriptionFilters.Subscription]: SubscriptionType.Subscription,
  [SubscriptionFilters.OneTimePurchase]: SubscriptionType.OneTimePurchase,
};

export const selectFilteredSubscriptions = createAppSelector(
  subscriptionApi.endpoints.getSubscriptions.select(),
  (state: RootState) =>
    SettingsSelectors.selectSettingByKey(state, SettingsKey.filters),
  (subscriptions, filters): Subscription[] => {
    if (!subscriptions.data) return [];
    if (filters.filterSubscriptionsBy === SubscriptionFilters.All) {
      return subscriptions.data;
    }

    const targetType = subscriptionTypeMap[filters.filterSubscriptionsBy];
    return subscriptions.data.filter((s) => s.type === targetType);
  },
);
