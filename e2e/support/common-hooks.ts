import { mkdir } from 'node:fs/promises';
import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  Status,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import {
  type Browser,
  type BrowserType,
  chromium,
  devices,
  firefox,
  webkit,
} from '@playwright/test';
import { createPageObjects } from '../page-objects';
import { config } from './config';
import type { ICustomWorld } from './custom-world';

const browserTypes: Record<string, BrowserType | undefined> = {
  chromium,
  firefox,
  webkit,
};
let browser: Browser | undefined;
const tracesDir = 'traces';

setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 1000);

BeforeAll(async () => {
  const browserType = browserTypes[config.browser] ?? chromium;
  browser = await browserType.launch(config.browserOptions);
  await mkdir(tracesDir, { recursive: true });
});

Before({ tags: '@pending' }, () => 'skipped');

Before<ICustomWorld>({ tags: '@mobile' }, function () {
  this.mobile = true;
});

Before<ICustomWorld>(async function ({ pickle }) {
  if (!browser) throw new Error('The browser did not start');
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
  this.page.on('console', (msg) => {
    if (msg.type() === 'log') {
      this.attach(msg.text());
    }
  });
  this.pageObjects = createPageObjects(this.page);
});

After<ICustomWorld>(async function ({ result }) {
  if (result) {
    this.attach(
      `Status: ${result.status}. Duration:${result.duration?.seconds}s`,
    );

    if (result.status !== Status.PASSED) {
      const image = await this.page.screenshot();

      // Replace : with _ because colons aren't allowed in Windows paths
      const timePart = this.startTime
        ?.toISOString()
        .split('.')[0]
        ?.replaceAll(':', '_');

      this.attach(image, 'image/png');
      await this.context.tracing.stop({
        path: `${tracesDir}/${this.testName}-${timePart}trace.zip`,
      });
    }
  }
  await this.page.close();
  await this.context.close();
});

AfterAll(async () => {
  // AfterAll also runs when BeforeAll failed before launching the browser
  await browser?.close();
});
