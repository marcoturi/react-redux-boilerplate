// Constant objects instead of enums: they are plain JavaScript, so type
// stripping (erasableSyntaxOnly) can run this file. The type of the same name
// is the union of the values.
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

const subscriptionFilterValues: ReadonlySet<string> = new Set(
  Object.values(SubscriptionFilters),
);

export function isSubscriptionFilter(
  value: string,
): value is SubscriptionFilters {
  return subscriptionFilterValues.has(value);
}
