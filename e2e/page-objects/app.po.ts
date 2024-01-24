import { Page } from '@playwright/test';

const AppPo = (page: Page) => {
  function homePage() {
    return page.getByTestId('home-page');
  }

  return {
    homePage,
  };
};

export default AppPo;
