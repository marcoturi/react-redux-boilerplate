import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { ICustomWorld } from '../support/custom-world';

Given<ICustomWorld>('user open the app', async function () {
  await this.page.goto(this.parameters.SERVER_URL);
});

Given<ICustomWorld>(
  'user open the {string} page',
  async function (path: string) {
    await this.page.goto(`${this.parameters.SERVER_URL}/${path}`);
  },
);

Given<ICustomWorld>('user reload current page', async function () {
  await this.page.reload();
});

Then<ICustomWorld>('user should see the home page', async function () {
  await expect(this.pageObjects.appPo.homePage).toBeVisible();
});
