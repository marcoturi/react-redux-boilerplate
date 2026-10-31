import { SettingsSelectors } from '@/features/settings/store';
import { createAppSelector } from '@/shared/store/selectors';
import { subscriptionApi } from './subscription.api';
import {
  type Subscription,
  SubscriptionFilters,
  SubscriptionType,
} from './subscription.type';

// `All` maps to no type: the list is not filtered
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
  SettingsSelectors.selectSubscriptionFilter,
  ({ data = [] }, filter): Subscription[] => {
    const type = subscriptionTypeMap[filter];
    return type ? data.filter((s) => s.type === type) : data;
  },
);
