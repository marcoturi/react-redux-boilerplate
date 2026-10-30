import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { ICustomWorld } from '../support/custom-world';

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
  async function (this: ICustomWorld, num: string) {
    await expect(this.pageObjects.subscriptionPo.list()).toHaveCount(+num);
  },
);

When(
  /^user change filter by "([^"]*)"$/,
  async function (this: ICustomWorld, option: string) {
    await this.pageObjects.subscriptionPo.pickOptionFromFilter(option);
  },
);
