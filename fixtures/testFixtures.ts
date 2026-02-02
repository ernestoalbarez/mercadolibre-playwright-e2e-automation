import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { PdpPage } from '../pages/PdpPage';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';

type PagesFixture = {
  homePage: HomePage;
  searchResultsPage: SearchResultsPage;
  pdpPage: PdpPage;
  cartPage: CartPage;
  loginPage: LoginPage;
};

export const test = base.extend<PagesFixture>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await use(homePage);
  },
  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },
  pdpPage: async ({ page }, use) => {
    await use(new PdpPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
