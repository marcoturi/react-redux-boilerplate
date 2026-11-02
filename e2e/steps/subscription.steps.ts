import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../support/custom-world.ts';

When<CustomWorld>('user open the subscription link', async function () {
  await this.pageObjects.subscriptionPo.subscriptionLink.click();
});

Then<CustomWorld>('user should see the subscription page', async function () {
  await expect(this.pageObjects.subscriptionPo.filterTrigger).toBeVisible();
});

Then<CustomWorld>(
  'user should see {int} subscriptions',
  async function (count: number) {
    await expect(this.pageObjects.subscriptionPo.list).toHaveCount(count);
  },
);

When<CustomWorld>(
  'user change filter by {string}',
  async function (option: string) {
    await this.pageObjects.subscriptionPo.pickOptionFromFilter(option);
  },
);
