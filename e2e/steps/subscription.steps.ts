import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { ICustomWorld } from '../support/custom-world';

Given<ICustomWorld>('user open the subscription link', async function () {
  await this.pageObjects.subscriptionPo.subscriptionLink.click();
});

Then<ICustomWorld>('user should see the subscription page', async function () {
  await expect(this.pageObjects.subscriptionPo.filterTrigger).toBeVisible();
});

Then<ICustomWorld>(
  'user should see {int} subscriptions',
  async function (count: number) {
    await expect(this.pageObjects.subscriptionPo.list).toHaveCount(count);
  },
);

When<ICustomWorld>(
  'user change filter by {string}',
  async function (option: string) {
    await this.pageObjects.subscriptionPo.pickOptionFromFilter(option);
  },
);
