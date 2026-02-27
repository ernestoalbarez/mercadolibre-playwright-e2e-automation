import type { Page, Locator } from '@playwright/test';

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
   * Locator for the product title.
   */
  get productTitle(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  /**
   * Locator for the product price.
   */
  get productPrice(): Locator {
    return this.page.getByTestId('price-part');
  }
}
