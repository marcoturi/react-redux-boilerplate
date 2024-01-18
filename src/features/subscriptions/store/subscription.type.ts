export enum SubscriptionType {
  Subscription = 'subscription',
  OneTimePurchase = 'oneTimePurchase',
}

export interface Subscription {
  id: string;
  type: SubscriptionType;
  name: string;
  price: number;
  currency: string;
  description: string;
}
