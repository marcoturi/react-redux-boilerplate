import type { Page } from '@playwright/test';
import { subscriptionPo } from './subscription.po.ts';

export const createPageObjects = (page: Page) => ({
  subscriptionPo: subscriptionPo(page),
});

export type PageObjects = ReturnType<typeof createPageObjects>;
