import { HttpResponse, http } from 'msw';
import { subscriptionMockList } from '@/features/subscriptions/store/subscription.mocks.spec';
import env from '@/shared/config/env';

export const subscriptionHandlers = [
  http.get(`${env.API_URL}/subscriptions`, () =>
    HttpResponse.json(subscriptionMockList),
  ),
];
