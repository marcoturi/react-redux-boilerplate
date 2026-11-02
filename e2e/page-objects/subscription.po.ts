import type { Page } from '@playwright/test';

export function subscriptionPo(page: Page) {
  const filterTrigger = page.getByRole('combobox', { name: 'Type' });

  return {
    subscriptionLink: page
      .getByRole('navigation')
      .getByRole('link', { name: 'Subscriptions' }),
    filterTrigger,
    list: page.getByTestId('subscription-item'),
    async pickOptionFromFilter(option: string) {
      await filterTrigger.click();
      await page.getByRole('option', { name: option }).click();
    },
  };
}
