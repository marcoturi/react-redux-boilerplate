import { ICustomWorld } from '../support/custom-world';
import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then(/^user should see the home page$/, async function (this: ICustomWorld) {
  await expect(this.pageObjects.appPo.homePage()).toBeVisible();
});

Given(/^user open the app$/, async function (this: ICustomWorld) {
  await this.page.goto(this.parameters.SERVER_URL);
});

Given(
  /^user open the "([^"]*)" page$/,
  async function (this: ICustomWorld, page) {
    await this.page.goto(`${this.parameters.SERVER_URL}/${page}`);
  },
);

Given(/^user reload current page$/, async function (this: ICustomWorld) {
  await this.page.reload();
});
