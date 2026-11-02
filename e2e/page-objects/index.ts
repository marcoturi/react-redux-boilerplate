import type { Page } from '@playwright/test';
import { appPo } from './app.po.ts';
import { subscriptionPo } from './subscription.po.ts';

export const createPageObjects = (page: Page) => ({
  appPo: appPo(page),
  subscriptionPo: subscriptionPo(page),
});

export type PageObjects = ReturnType<typeof createPageObjects>;
