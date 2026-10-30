import { SubscriptionList } from '@/features/subscriptions/components';
import { SubscriptionFilter } from '@/features/subscriptions/components/SubscriptionFilter';
import { Container } from '@/UI/Elements/Container';
import { Text } from '@/UI/Elements/Text';

function SubscriptionsPage() {
  return (
    <Container>
      <title>Subscriptions | React Boilerplate</title>
      <Text size="7" as="h1">
        Subscriptions
      </Text>
      <div className="pt-5">
        <SubscriptionFilter />
      </div>
      <SubscriptionList />
    </Container>
  );
}

export default SubscriptionsPage;
