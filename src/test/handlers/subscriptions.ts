import { config } from '../config';
import { subscriptionMockList } from '@/features/subscriptions/store/subscription.mocks.spec';
import { http, HttpResponse } from 'msw';

export const subscriptionHandlers = [
  http.get<any, any>(`${config.API_URL}/subscriptions`, () => {
    try {
      return HttpResponse.json(subscriptionMockList);
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 400 },
      );
    }
  }),
];
