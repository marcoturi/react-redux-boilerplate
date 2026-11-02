import { HttpResponse, http } from 'msw';
import { subscriptionMockList } from '@/mocks/data/subscriptions';
import { env } from '@/shared/config/env';
import { serverErrorOnce } from './server-error';

export const subscriptionsUrl = `${env.API_URL}/subscriptions`;

export const subscriptionsHandlers = [
  http.get(subscriptionsUrl, () => HttpResponse.json(subscriptionMockList)),
];

export const subscriptionsFailOnce = () => serverErrorOnce(subscriptionsUrl);
