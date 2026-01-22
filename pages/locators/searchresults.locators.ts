import { Page, Locator } from '@playwright/test';

export class SearchResultsLocators {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get resultsItems(): Locator {
    return this.page.locator('li.ui-search-layout__item');
  }
}
