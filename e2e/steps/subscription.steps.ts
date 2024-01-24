import { ICustomWorld } from '../support/custom-world';
import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given(/^user open the subscription link$/, async function (this: ICustomWorld) {
  await this.pageObjects.subscriptionPo.subscriptionLink().click();
});

Then(
  /^user should see the subscription page$/,
  async function (this: ICustomWorld) {
    await expect(this.pageObjects.subscriptionPo.filterTrigger()).toBeVisible();
  },
);

Then(
  /^user should see "([^"]*)" subscriptions$/,
  async function (this: ICustomWorld, num) {
    await expect(this.pageObjects.subscriptionPo.list().first()).toBeVisible();
    expect(await this.pageObjects.subscriptionPo.list().count()).toBe(+num);
  },
);

When(
  /^user change filter by "([^"]*)"$/,
  async function (this: ICustomWorld, option) {
    await this.pageObjects.subscriptionPo.pickOptionFromFilter(option);
  },
);
