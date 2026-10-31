import type { SubscriptionFilters } from '@/features/subscriptions/store/subscription.type';
import type { RootState } from '@/shared/store/types';
import { SettingsKey } from './settings.type';

export const selectSubscriptionFilter = (
  state: RootState,
): SubscriptionFilters =>
  state.settings[SettingsKey.filters].filterSubscriptionsBy;
