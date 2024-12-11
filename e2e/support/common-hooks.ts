import AppPo from '../page-objects/app.po';
import SubscriptionPo from '../page-objects/subscription.po';
import config from './config';
import { ICustomWorld } from './custom-world';
import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  Status,
  setDefaultTimeout,
  ITestCaseHookParameter,
} from '@cucumber/cucumber';
import {
  chromium,
  ChromiumBrowser,
  firefox,
  FirefoxBrowser,
  webkit,
  WebKitBrowser,
  ConsoleMessage,
  devices,
} from '@playwright/test';
import { ensureDir } from 'fs-extra';

let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
const tracesDir = 'traces';

declare global {
  // eslint-disable-next-line no-var
  var browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
}

export interface PageObjects {
  pageObjects?: {
    appPo: ReturnType<typeof AppPo>;
    subscriptionPo: ReturnType<typeof SubscriptionPo>;
  };
}

setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 1000);

BeforeAll(async () => {
  switch (config.browser) {
    case 'firefox': {
      browser = await firefox.launch(config.browserOptions);
      break;
    }
    case 'webkit': {
      browser = await webkit.launch(config.browserOptions);
      break;
    }
    default: {
      browser = await chromium.launch(config.browserOptions);
    }
  }
  await ensureDir(tracesDir);
});

Before({ tags: '@pending' }, () => 'skipped' as any);

Before({ tags: '@debug' }, function (this: ICustomWorld) {
  this.debug = true;
});

Before({ tags: '@mobile' }, function (this: ICustomWorld) {
  this.mobile = true;
});

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  this.startTime = new Date();
  this.testName = pickle.name.replaceAll(/\W/g, '-');
  // customize the [browser context](https://playwright.dev/docs/next/api/class-browser#browsernewcontextoptions)

  const isMobile = this.mobile ? devices['iPhone 14 Pro'] : {};
  this.context = await browser.newContext({
    acceptDownloads: true,
    recordVideo: process.env.PWVIDEO ? { dir: 'screenshots' } : undefined,
    viewport: { width: 1200, height: 800 },
    ...isMobile,
  });

  await this.context.tracing.start({ screenshots: true, snapshots: true });
  this.page = await this.context.newPage();
  this.page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'log') {
      this.attach(msg.text());
    }
  });
  this.feature = pickle;

  this.pageObjects = {
    appPo: AppPo(this.page),
    subscriptionPo: SubscriptionPo(this.page),
  };
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  if (result) {
    this.attach(
      `Status: ${result?.status}. Duration:${result.duration?.seconds}s`,
    );

    if (result.status !== Status.PASSED) {
      const image = await this.page?.screenshot();

      // Replace : with _ because colons aren't allowed in Windows paths
      const timePart = this.startTime
        ?.toISOString()
        .split('.')[0]
        .replaceAll(':', '_');

      if (image) {
        this.attach(image, 'image/png');
      }
      await this.context?.tracing.stop({
        path: `${tracesDir}/${this.testName}-${timePart}trace.zip`,
      });
    }
  }
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async () => {
  await browser.close();
});
