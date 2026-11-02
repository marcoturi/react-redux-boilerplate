import { setWorldConstructor, World } from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';
import type { PageObjects } from '../page-objects/index.ts';

type WorldParams = { SERVER_URL: string };

export class CustomWorld extends World<WorldParams> {
  context?: BrowserContext;

  page!: Page;

  pageObjects!: PageObjects;
}

setWorldConstructor(CustomWorld);
