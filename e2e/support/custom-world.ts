import { setWorldConstructor, World } from '@cucumber/cucumber';
import type { BrowserContext, Page } from '@playwright/test';
import type { PageObjects } from '../page-objects';

enum Parameters {
  SERVER_URL = 'SERVER_URL',
}

export type WorldParams = Record<Parameters, string>;

export interface ICustomWorld extends World {
  mobile: boolean;
  context: BrowserContext;
  page: Page;
  pageObjects: PageObjects;
  parameters: WorldParams;

  testName?: string;
  startTime?: Date;
}

export class CustomWorld extends World implements ICustomWorld {
  mobile = false;

  // Set by the Before hook in common-hooks.ts before every scenario
  context!: BrowserContext;

  page!: Page;

  pageObjects!: PageObjects;
}

setWorldConstructor(CustomWorld);
