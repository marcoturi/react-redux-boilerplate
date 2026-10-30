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
        <CardTitle>
          <Text as="h2">{subscription.name}</Text>
        </CardTitle>
        <CardDescription>{subscription.description}</CardDescription>
        <CardAction className="flex w-48 flex-col items-center gap-4 self-center">
          <Text size="6">
            {subscription.price} {subscription.currency}
          </Text>
          {/* Every card has a Buy button: the name says which one */}
          <Button aria-label={`Buy ${subscription.name}`}>Buy</Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
