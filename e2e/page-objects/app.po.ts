import type { Page } from '@playwright/test';

// Locators are lazy: they query the page when an action or assertion runs
export function appPo(page: Page) {
  return {
    homePage: page.getByTestId('home-page'),
  };
}
