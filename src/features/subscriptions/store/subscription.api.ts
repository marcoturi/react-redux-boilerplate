import type { Subscription } from '@/features/subscriptions/store/subscription.type';
import baseApi from '@/shared/store/api';

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSubscriptions: build.query<Subscription[], void>({
      query: () => 'subscriptions',
    }),
  }),
});

export const { useGetSubscriptionsQuery } = subscriptionApi;
