import { HttpResponse, http } from 'msw';
import { subscriptionMockList } from '@/features/subscriptions/store/subscription.mocks.spec';
import { config } from '../config';

export const subscriptionHandlers = [
  http.get(`${config.API_URL}/subscriptions`, () => {
    try {
      return HttpResponse.json(subscriptionMockList);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server Error';
      return HttpResponse.json({ message }, { status: 400 });
    }
  }),
];
