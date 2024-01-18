import { ICustomWorld } from '../support/custom-world';
import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then(/^I should see the home page$/, async function (this: ICustomWorld) {
  await expect(this.pageObjects.appPo.homePage).toBeVisible();
});

Given(/^open the app$/, async function (this: ICustomWorld) {
  await this.page.goto(this.parameters.SERVER_URL);
});
