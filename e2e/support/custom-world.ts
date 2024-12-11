import { PageObjects } from './common-hooks';
import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import * as messages from '@cucumber/messages';
import {
  APIRequestContext,
  BrowserContext,
  Page,
  PlaywrightTestOptions,
} from '@playwright/test';

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
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(options: IWorldOptions) {
    super(options);
  }

  debug = false;

  mobile = false;
}

setWorldConstructor(CustomWorld);
