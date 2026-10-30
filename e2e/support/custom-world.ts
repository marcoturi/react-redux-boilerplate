import {
  type ITestCaseHookParameter,
  setWorldConstructor,
  World,
} from '@cucumber/cucumber';
import type {
  APIRequestContext,
  BrowserContext,
  Page,
  PlaywrightTestOptions,
} from '@playwright/test';
import type { PageObjects } from './common-hooks';

enum Parameters {
  SERVER_URL = 'SERVER_URL',
}

export type WorldParams = Record<Parameters, string>;

export interface CucumberWorldConstructorParams {
  parameters: WorldParams;
}

export interface ICustomWorld extends World, PageObjects {
  debug: boolean;
  mobile: boolean;
  feature?: ITestCaseHookParameter['pickle'];
  context: BrowserContext;
  page: Page;
  parameters: WorldParams;

  testName?: string;
  startTime?: Date;

  server?: APIRequestContext;

  playwrightOptions?: PlaywrightTestOptions;
}

export class CustomWorld extends World implements ICustomWorld {
  debug = false;

  mobile = false;

  // Set by the Before hook in common-hooks.ts before every scenario
  context!: BrowserContext;

  page!: Page;

  pageObjects!: PageObjects['pageObjects'];
}

setWorldConstructor(CustomWorld);
