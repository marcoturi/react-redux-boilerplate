import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../support/custom-world.ts';

Given<CustomWorld>('user open the app', async function () {
  await this.page.goto(this.parameters.SERVER_URL);
});

Given<CustomWorld>(
  'user open the {string} page',
  async function (path: string) {
    await this.page.goto(`${this.parameters.SERVER_URL}/${path}`);
  },
);

When<CustomWorld>('user reload current page', async function () {
  await this.page.reload();
});

Then<CustomWorld>('user should see the home page', async function () {
  await expect(this.pageObjects.appPo.homePage).toBeVisible();
});
