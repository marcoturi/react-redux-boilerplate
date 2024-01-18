import { SubscriptionApi, SubscriptionSelectors } from '../store';
import { Skeleton } from '@/UI/Elements/Skeleton/Skeleton';
import { useAppSelector } from '@/core/store/types';
import { SubscriptionCard } from '@/features/subscriptions/components';

export function SubscriptionList() {
  const { isLoading } = SubscriptionApi.useGetSubscriptionsQuery();
  const subscription = useAppSelector(
    SubscriptionSelectors.getSubscriptionListFiltered,
  );

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }
  return subscription?.map((s) => (
    <SubscriptionCard
      key={s.id}
      {...s}
    />
  ));
}
