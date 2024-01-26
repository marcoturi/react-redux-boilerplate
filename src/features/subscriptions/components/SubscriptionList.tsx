import { SubscriptionApi, SubscriptionSelectors } from '../store';
import { SkeletonList } from '@/UI/Elements/Skeleton';
import { useAppSelector } from '@/core/store/types';
import { SubscriptionCard } from '@/features/subscriptions/components';

export function SubscriptionList() {
  const { isLoading } = SubscriptionApi.useGetSubscriptionsQuery();
  const subscription = useAppSelector(
    SubscriptionSelectors.getSubscriptionListFiltered,
  );

  if (isLoading) {
    return <SkeletonList className="py-8" />;
  }
  return subscription?.map((s) => (
    <SubscriptionCard
      key={s.id}
      {...s}
    />
  ));
}
