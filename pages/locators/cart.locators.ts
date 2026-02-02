import { Page, Locator } from '@playwright/test';

/**
 * CartLocators exposes all DOM locators for the Cart Page.
 *
 * This class contains only element selectors and no interaction logic.
 * It provides stable locators that are consumed by CartPage to perform user actions.
 */
export class CartLocators {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Locator for the product title displayed on the PDP.
   */
  get productTitle(): Locator {
    return this.page.locator('h1.ui-pdp-title');
  }

  /**
   * Locator for the product price displayed on the PDP.
   */
  get productPrice(): Locator {
    return this.page.locator('.ui-pdp-price__second-line [data-testid="price-part"]');
  }
}
