import { useId } from 'react';
import { SettingsActions, SettingsSelectors } from '@/features/settings/store';
import { SettingsKey } from '@/features/settings/store/settings.type';
import {
  isSubscriptionFilter,
  SubscriptionFilters,
} from '@/features/subscriptions/store/subscription.type';
import { useAppDispatch, useAppSelector } from '@/shared/store/types';
import { Label } from '@/UI/Base/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/UI/Base/select';

export function SubscriptionFilter() {
  const id = useId();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) =>
    SettingsSelectors.selectSettingByKey(state, SettingsKey.filters),
  );
  const onValueChange = (value: string) => {
    if (isSubscriptionFilter(value)) {
      dispatch(SettingsActions.subscriptionFilterChanged(value));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={id}>Type</Label>
      <Select
        value={filters.filterSubscriptionsBy}
        onValueChange={onValueChange}
      >
        <SelectTrigger className="w-45" data-testid="filter-trigger" id={id}>
          <SelectValue />
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
    </div>
  );
}
