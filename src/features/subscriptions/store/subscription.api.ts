import { Subscription } from '@/features/subscriptions/store/subscription.type';
import baseApi from '@/shared/store/api';

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
