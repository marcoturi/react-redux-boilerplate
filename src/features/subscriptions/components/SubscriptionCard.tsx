import type { Subscription } from '@/features/subscriptions/store/subscription.type';
import { Button } from '@/UI/Base/button';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/UI/Base/card';
import { Text } from '@/UI/Elements/Text';

interface SubscriptionCardProps {
  subscription: Subscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  return (
    <Card className="w-full" data-testid="subscription-item">
      <CardHeader>
        <CardTitle>{subscription.name}</CardTitle>
        <CardDescription>{subscription.description}</CardDescription>
        <CardAction className="flex w-48 flex-col items-center gap-4 self-center">
          <Text size="6">
            {subscription.price} {subscription.currency}
          </Text>
          <Button>Buy</Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
