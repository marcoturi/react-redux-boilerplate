import { SubscriptionList } from '@/features/subscriptions/components';
import { SubscriptionFilter } from '@/features/subscriptions/components/SubscriptionFilter';
import { Container } from '@/UI/Elements/Container';
import { Text } from '@/UI/Elements/Text';

function SubscriptionsPage() {
  return (
    <Container>
      <Text size="7" as="p">
        Subscriptions
      </Text>
      <div className="flex items-center space-x-2 pt-5">
        <SubscriptionFilter />
      </div>
      <SubscriptionList />
    </Container>
  );
}

export default SubscriptionsPage;
