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

// For route loaders: starts the request without waiting for it, so it runs
// while the page chunk downloads. The page's query hook then reuses it.
export const prefetchSubscriptions = () =>
  subscriptionApi.util.prefetch('getSubscriptions', undefined, {
    ifOlderThan: 60,
  });
