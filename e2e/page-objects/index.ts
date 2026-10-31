import type { Page } from '@playwright/test';
import { appPo } from './app.po';
import { subscriptionPo } from './subscription.po';

export const createPageObjects = (page: Page) => ({
  appPo: appPo(page),
  subscriptionPo: subscriptionPo(page),
});

export type PageObjects = ReturnType<typeof createPageObjects>;
