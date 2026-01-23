import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';

type PagesFixture = {
  homePage: HomePage;
  searchResultsPage: SearchResultsPage;
};

export const test = base.extend<PagesFixture>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await use(homePage);
  },
  //searchResultsPage: async ({ page, homePage }, use) => {
  searchResultsPage: async ({ page }, use) => {
    // void homePage;
    await use(new SearchResultsPage(page));
  },
});

export { expect } from '@playwright/test';
