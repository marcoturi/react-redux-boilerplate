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
import type { CustomWorld } from './custom-world';

// BROWSER=firefox or BROWSER=webkit runs the scenarios in another engine
const browserTypes: Record<string, BrowserType | undefined> = {
  chromium,
  firefox,
  webkit,
};
let browser: Browser | undefined;
const tracesDir = 'traces';

setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 1000);

BeforeAll(async () => {
  const browserType = browserTypes[process.env.BROWSER ?? ''] ?? chromium;
  browser = await browserType.launch();
  await mkdir(tracesDir, { recursive: true });
});

Before({ tags: '@pending' }, () => 'skipped');

Before<CustomWorld>({ tags: '@mobile' }, function () {
  this.mobile = true;
});

Before<CustomWorld>(async function () {
  if (!browser) throw new Error('The browser did not start');
  // https://playwright.dev/docs/api/class-browser#browser-new-context
  this.context = await browser.newContext({
    acceptDownloads: true,
    recordVideo: process.env.PWVIDEO ? { dir: 'screenshots' } : undefined,
    viewport: { width: 1200, height: 800 },
    ...(this.mobile ? devices['iPhone 14 Pro'] : {}),
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

After<CustomWorld>(async function ({ pickle, result }) {
  const { context } = this;
  if (!context) return;

  if (result?.status === Status.FAILED) {
    // The page may be missing if the Before hook failed while creating it
    const [page] = context.pages();
    if (page) this.attach(await page.screenshot(), 'image/png');

    const name = pickle.name.replaceAll(/\W/g, '-');
    // No colons: they are not allowed in Windows paths
    const time = new Date().toISOString().replaceAll(/[:.]/g, '_');
    await context.tracing.stop({
      path: `${tracesDir}/${name}-${time}-trace.zip`,
    });
  }
  // Closes the page as well
  await context.close();
});

AfterAll(async () => {
  // AfterAll also runs when BeforeAll failed before launching the browser
  await browser?.close();
});
