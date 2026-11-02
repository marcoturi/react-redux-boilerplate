import type { Page } from '@playwright/test';

export function appPo(page: Page) {
  return {
    homePage: page.getByTestId('home-page'),
  };
}
