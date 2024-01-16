import { Page } from '@playwright/test';

const AppPo = (page: Page) => ({
  homePage: page.getByTestId('home-page'),
});

export default AppPo;
