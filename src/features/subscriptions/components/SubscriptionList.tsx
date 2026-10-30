import { useAppSelector } from '@/shared/store/types';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/UI/Base/empty';
import { SkeletonList } from '@/UI/Elements/SkeletonList';
import { SubscriptionApi, SubscriptionSelectors } from '../store';
import { SubscriptionCard } from './SubscriptionCard';

export function SubscriptionList() {
  const { isLoading } = SubscriptionApi.useGetSubscriptionsQuery();
  const subscriptions = useAppSelector(
    SubscriptionSelectors.selectFilteredSubscriptions,
  );

  if (isLoading) {
    return <SkeletonList className="py-8" />;
  }

  if (subscriptions.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No subscriptions</EmptyTitle>
          <EmptyDescription>
            Nothing matches the selected filter.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      {subscriptions.map((s) => (
        <SubscriptionCard key={s.id} subscription={s} />
      ))}
    </div>
  );
}
