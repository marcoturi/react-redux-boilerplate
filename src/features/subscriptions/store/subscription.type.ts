export const SubscriptionType = {
  Subscription: 'subscription',
  OneTimePurchase: 'oneTimePurchase',
} as const;
export type SubscriptionType =
  (typeof SubscriptionType)[keyof typeof SubscriptionType];

export const SubscriptionFilters = {
  All: 'All',
  Subscription: 'Subscription',
  OneTimePurchase: 'OneTimePurchase',
} as const;
export type SubscriptionFilters =
  (typeof SubscriptionFilters)[keyof typeof SubscriptionFilters];

export interface Subscription {
  id: string;
  type: SubscriptionType;
  name: string;
  price: number;
  currency: string;
  description: string;
}

const subscriptionFilterValues: ReadonlySet<unknown> = new Set(
  Object.values(SubscriptionFilters),
);

export function isSubscriptionFilter(
  value: unknown,
): value is SubscriptionFilters {
  return subscriptionFilterValues.has(value);
}
