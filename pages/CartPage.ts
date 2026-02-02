import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartLocators } from './locators/cart.locators';

/**
 * CartPage represents the Cart Page in MercadoLibre.
 *
 * Responsibilities:
 * - Interact with cart-specific actions (e.g. remove item, update quantity).
 * - Abstract cart-specific user actions behind a clean API.
 *
 * This page object does not validate business outcomes (e.g. cart state),
 * it only performs user interactions. Assertions should be handled at test level
 * or in dedicated expectation helpers.
 */
export class CartPage extends BasePage {
  private readonly locators: CartLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new CartLocators(page);
  }

  /**
   * Returns the product name displayed in the cart.
   * This method waits until the product title is visible to ensure the cart page is loaded.
   */
  async getProductName(): Promise<string> {
    await this.locators.productTitle.waitFor({ state: 'visible' });
    return (await this.locators.productTitle.textContent()) ?? '';
  }

  /**
   * Returns the product price displayed in the cart.
   * This method waits until the product price is visible.
   */
  async getProductPrice(): Promise<string> {
    await this.locators.productPrice.waitFor({ state: 'visible' });
    return (await this.locators.productPrice.textContent()) ?? '';
  }

  /**
   * Asserts that the cart contains the expected product name and price.
   * This is a structural validation to ensure the correct product was added to the cart.
   */
  async expectProductInCart(expectedName: string, expectedPrice: string): Promise<void> {
    const actualName = await this.getProductName();
    const actualPrice = await this.getProductPrice();

    expect(actualName).toContain(expectedName);
    expect(actualPrice).toContain(expectedPrice);
  }

  /**
   * Removes the product from the cart.
   * This method handles potential third-party overlays before performing the action.
   */
  async removeProduct(): Promise<void> {
    await this.handleThirdPartyOverlays();

    const removeButton = this.page.getByRole('button', { name: /eliminar/i });
    await removeButton.waitFor({ state: 'visible' });
    await removeButton.click();
  }
}
