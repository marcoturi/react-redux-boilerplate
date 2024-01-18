import { ICustomWorld } from '../support/custom-world';
import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given(/^click the subscription link$/, async function (this: ICustomWorld) {
  await this.pageObjects.subscriptionPo.subscriptionLink.click();
});

Then(
  /^I should see the subscription page$/,
  async function (this: ICustomWorld) {
    await expect(this.pageObjects.subscriptionPo.filterContainer).toBeVisible();
    expect(await this.pageObjects.subscriptionPo.list.count()).toBe(3);
  },
);
