import { setWorldConstructor, World } from '@cucumber/cucumber';
import type * as messages from '@cucumber/messages';
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

export type WorldParams = Record<Parameters, any>;

export interface CucumberWorldConstructorParams {
  parameters: WorldParams;
}

export interface ICustomWorld extends World, PageObjects {
  debug: boolean;
  mobile: boolean;
  feature?: messages.Pickle;
  context?: BrowserContext;
  page?: Page;
  parameters: WorldParams;

  testName?: string;
  startTime?: Date;

  server?: APIRequestContext;

  playwrightOptions?: PlaywrightTestOptions;
}

export class CustomWorld extends World implements ICustomWorld {
  debug = false;

  mobile = false;
}

setWorldConstructor(CustomWorld);
