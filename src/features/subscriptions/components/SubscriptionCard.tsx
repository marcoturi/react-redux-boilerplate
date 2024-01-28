import { Button } from '@/UI/Elements/Button';
import { Card } from '@/UI/Elements/Card';
import { CardContent, CardHeader, CardTitle } from '@/UI/Elements/Card/Card';
import { Text } from '@/UI/Elements/Text';
import { Subscription } from '@/features/subscriptions/store/subscription.type';

export function SubscriptionCard(subscription: Subscription) {
  return (
    <Card
      className="my-4 w-full"
      data-testid="subscription-item"
    >
      <div className="flex flex-row items-center">
        <div className="basis-3/4">
          <CardHeader>
            <CardTitle>{subscription.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Text as="p">{subscription.description}</Text>
          </CardContent>
        </div>
        <div className="mx-auto basis-1/4 text-center">
          <Text
            as="p"
            className="py-4 text-center"
            size="6"
          >
            {subscription.price} {subscription.currency}
          </Text>
          <Button>Buy</Button>
        </div>
      </div>
    </Card>
  );
}
