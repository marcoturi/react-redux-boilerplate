import { useAppSelector } from '@/shared/store/types';
import { Alert, AlertDescription, AlertTitle } from '@/UI/Base/alert';
import { Button } from '@/UI/Base/button';
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
  const { isLoading, isError, isFetching, refetch } =
    SubscriptionApi.useGetSubscriptionsQuery();
  const subscriptions = useAppSelector(
    SubscriptionSelectors.selectFilteredSubscriptions,
  );

  if (isLoading) {
    return <SkeletonList className="py-8" />;
  }

  // Without data the selector returns an empty list: tell a failed request
  // apart from a filter that matches nothing
  if (isError) {
    return (
      <div className="flex flex-col items-start gap-4 py-4">
        <Alert variant="destructive">
          <AlertTitle>Could not load the subscriptions</AlertTitle>
          <AlertDescription>
            Check your connection and try again.
          </AlertDescription>
        </Alert>
        <Button disabled={isFetching} onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
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
