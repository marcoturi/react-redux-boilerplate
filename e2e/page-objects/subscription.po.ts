import { Page } from '@playwright/test';

const SubscriptionPo = (page: Page) => ({
  subscriptionLink: page.getByTestId('subscription-link'),
  filterContainer: page.getByTestId('filter-container'),
  list: page.getByTestId('subscription-item'),
});

export default SubscriptionPo;
