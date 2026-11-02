import { useId } from 'react';
import { SettingsActions, SettingsSelectors } from '@/features/settings/store';
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
import {
  isSubscriptionFilter,
  SubscriptionFilters,
} from '../store/subscription.type';

// One label per filter: a new filter without a label is a type error
const filterLabels: Record<SubscriptionFilters, string> = {
  [SubscriptionFilters.All]: 'All',
  [SubscriptionFilters.Subscription]: 'Subscriptions',
  [SubscriptionFilters.OneTimePurchase]: 'One Time Purchase',
};

export function SubscriptionFilter() {
  const id = useId();
  const dispatch = useAppDispatch();
  const filter = useAppSelector(SettingsSelectors.selectSubscriptionFilter);
  const onValueChange = (value: string) => {
    if (isSubscriptionFilter(value)) {
      dispatch(SettingsActions.subscriptionFilterChanged(value));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor={id}>Type</Label>
      <Select value={filter} onValueChange={onValueChange}>
        <SelectTrigger className="w-45" id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.entries(filterLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
