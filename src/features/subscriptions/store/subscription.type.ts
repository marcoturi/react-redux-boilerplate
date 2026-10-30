export enum SubscriptionType {
  Subscription = 'subscription',
  OneTimePurchase = 'oneTimePurchase',
}

export enum SubscriptionFilters {
  All = 'All',
  Subscription = 'Subscription',
  OneTimePurchase = 'OneTimePurchase',
}

export interface Subscription {
  id: string;
  type: SubscriptionType;
  name: string;
  price: number;
  currency: string;
  description: string;
}

const subscriptionFilterValues: ReadonlySet<string> = new Set(
  Object.values(SubscriptionFilters),
);

export function isSubscriptionFilter(
  value: string,
): value is SubscriptionFilters {
  return subscriptionFilterValues.has(value);
}
