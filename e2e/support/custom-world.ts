import { setWorldConstructor, World } from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';
import type { PageObjects } from '../page-objects/index.ts';

// `worldParameters` in cucumber.mjs
type WorldParams = { SERVER_URL: string };

export class CustomWorld extends World<WorldParams> {
  mobile = false;

  // Set by the Before hook in common-hooks.ts for every scenario. The After
  // hook runs even when that hook was skipped (@pending) or failed, so it
  // must not assume a context
  context?: BrowserContext;

  page!: Page;

  pageObjects!: PageObjects;
}

setWorldConstructor(CustomWorld);
