import { Page } from '@playwright/test';

const SubscriptionPo = (page: Page) => {
  function subscriptionLink() {
    return page.getByTestId('subscription-link');
  }

  function filterTrigger() {
    return page.getByTestId('filter-trigger');
  }

  function list() {
    return page.getByTestId('subscription-item');
  }

  async function pickOptionFromFilter(option: string) {
    await filterTrigger().click();
    await page.getByRole('option', { name: option }).click();
  }

  return {
    subscriptionLink,
    filterTrigger,
    pickOptionFromFilter,
    list,
  };
};

export default SubscriptionPo;
