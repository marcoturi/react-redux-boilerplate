import type { Page } from '@playwright/test';

export function subscriptionPo(page: Page) {
  const filterTrigger = page.getByTestId('filter-trigger');

  return {
    subscriptionLink: page.getByTestId('subscription-link'),
    filterTrigger,
    list: page.getByTestId('subscription-item'),
    async pickOptionFromFilter(option: string) {
      await filterTrigger.click();
      await page.getByRole('option', { name: option }).click();
    },
  };
}
