import { Page, Locator } from '@playwright/test';

/**
 * HomeLocators contains all DOM locators for the MercadoLibre home page.
 *
 * This class is responsible only for exposing stable and reusable locators.
 * It does not contain any interaction logic or assertions.
 *
 * Locators defined here are consumed by HomePage to perform user actions.
 */
export class HomeLocators {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Cookie consent accept button displayed on first visit.
   */
  get acceptCookiesButton(): Locator {
    return this.page.locator('[data-testid="action:understood-button"]');
  }

  /**
   * Global search input located in the home page header.
   */
  get searchInput(): Locator {
    return this.page.locator('input.nav-search-input');
  }

  /**
   * Shopping cart button located in the top navigation bar.
   */
  get cartButton(): Locator {
    return this.page.locator('#nav-cart');
  }

  /**
   * Login button located in the top navigation bar.
   */
  get loginButton(): Locator {
    return this.page.locator('[data-link-id="login"]');
  }
}
