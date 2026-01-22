import { Page, Locator } from '@playwright/test';

export class HomeLocators {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get acceptCookiesButton(): Locator {
    return this.page.locator('[data-testid="action:understood-button"]');
  }

  get searchInput(): Locator {
    return this.page.locator('input.nav-search-input');
  }
}
