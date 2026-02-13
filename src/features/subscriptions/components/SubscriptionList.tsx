import { SubscriptionCard } from '@/features/subscriptions/components';
import { useAppSelector } from '@/shared/store/types';
import { SkeletonList } from '@/UI/Elements/Skeleton';
import { SubscriptionApi, SubscriptionSelectors } from '../store';

export function SubscriptionList() {
  const { isLoading } = SubscriptionApi.useGetSubscriptionsQuery();
  const subscriptions = useAppSelector(
    SubscriptionSelectors.getSubscriptionListFiltered,
  );

  if (isLoading) {
    return <SkeletonList className="py-8" />;
  }

  return subscriptions.map((s) => (
    <SubscriptionCard key={s.id} subscription={s} />
  ));
}
