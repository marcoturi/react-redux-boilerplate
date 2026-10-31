import { HttpResponse, http } from 'msw';
import env from '@/shared/config/env';
import { subscriptionMockList } from '@/test/mocks/subscriptions';

const subscriptionsUrl = `${env.API_URL}/subscriptions`;

export const subscriptionHandlers = [
  http.get(subscriptionsUrl, () => HttpResponse.json(subscriptionMockList)),
];

// A new handler on every call: a `once` handler stays used after its first
// match, so a shared instance would be skipped by the next test
export const subscriptionsFailOnce = () =>
  http.get(
    subscriptionsUrl,
    () => HttpResponse.json({ message: 'Server Error' }, { status: 500 }),
    { once: true },
  );
