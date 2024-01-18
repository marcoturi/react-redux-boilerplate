import baseApi from '@/core/store/api';
import { Subscription } from '@/features/subscriptions/store/subscription.type';

export const subscriptionApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Subscription'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getSubscriptions: build.query<Subscription[], void>({
        query: () => 'subscriptions',
      }),
    }),
    overrideExisting: false,
  });

export const { useGetSubscriptionsQuery } = subscriptionApi;
