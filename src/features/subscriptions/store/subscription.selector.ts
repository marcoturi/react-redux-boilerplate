import { SettingsSelectors } from '@/features/settings/store';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { SubscriptionFilters } from '@/features/subscriptions/components/subscription.types';
import { subscriptionApi } from '@/features/subscriptions/store/subscription.api';
import {
  Subscription,
  SubscriptionType,
} from '@/features/subscriptions/store/subscription.type';
import { createSelector } from '@reduxjs/toolkit';
import { curry, filter } from 'ramda';

const matchSubscriptionFilters = (
  subscription: Subscription,
  f: SubscriptionFilters,
) => {
  const dic = {
    [SubscriptionFilters.Subscription]: SubscriptionType.Subscription,
    [SubscriptionFilters.OneTimePurchase]: SubscriptionType.OneTimePurchase,
  };
  return dic[f] === subscription.type;
};

export const getSubscriptionListFiltered = createSelector(
  subscriptionApi.endpoints.getSubscriptions.select(),
  (state) => SettingsSelectors.getSettingByKey(state)(SettingsKey.filters),
  (s: { data: Subscription[] }, f): Subscription[] => {
    if (!s.data) {
      return [];
    }
    if (f.filterSubscriptionsBy === SubscriptionFilters.All) {
      return s.data;
    }

    const filterBySettings = curry(
      filter((i: Subscription) =>
        matchSubscriptionFilters(i, f.filterSubscriptionsBy),
      ),
    );

    return filterBySettings(s.data);
  },
);
