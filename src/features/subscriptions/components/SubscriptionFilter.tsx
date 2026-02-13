import { useEffect } from 'react';
import { SettingsActions, SettingsSelectors } from '@/features/settings/store';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { SubscriptionFilters } from '@/features/subscriptions/components/subscription.types';
import { useAppDispatch, useAppSelector } from '@/shared/store/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/UI/Elements/Select';

export function SubscriptionFilter() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) =>
    SettingsSelectors.getSettingByKey(state, SettingsKey.filters),
  );
  const onValueChange = (value: string) => {
    dispatch(
      SettingsActions.setItem({
        key: SettingsKey.filters,
        value: {
          ...filters,
          filterSubscriptionsBy: value as SubscriptionFilters,
        },
      }),
    );
  };

  useEffect(() => {
    dispatch(SettingsActions.loadState());
  }, [dispatch]);

  return (
    <Select value={filters.filterSubscriptionsBy} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]" data-testid="filter-trigger">
        <SelectValue placeholder="Filter subscriptions" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={SubscriptionFilters.All}>All</SelectItem>
          <SelectItem value={SubscriptionFilters.Subscription}>
            Subscriptions
          </SelectItem>
          <SelectItem value={SubscriptionFilters.OneTimePurchase}>
            One Time Purchase
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
