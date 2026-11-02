import baseApi from '@/shared/store/api';
import type { Subscription } from './subscription.type';

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSubscriptions: build.query<Subscription[], void>({
      query: () => 'subscriptions',
    }),
  }),
});

export const { useGetSubscriptionsQuery } = subscriptionApi;

export const prefetchSubscriptions = () =>
  subscriptionApi.util.prefetch('getSubscriptions', undefined, {
    ifOlderThan: 60,
  });
