import { LaunchOptions } from '@playwright/test';

const browserOptions: LaunchOptions = {
  slowMo: 0,
  args: [
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
  ],
  // headless: false,
  firefoxUserPrefs: {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true,
  },
};

const config = {
  browser: process.env.BROWSER || 'chromium',
  browserOptions,
};

export default config;
