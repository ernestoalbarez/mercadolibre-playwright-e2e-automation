import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PdpLocators } from './locators/pdp.locators';

/**
 * PdpPage represents the Product Detail Page (PDP) in MercadoLibre.
 *
 * Responsibilities:
 * - Interact with primary product actions (buy now, add to cart).
 * - Abstract PDP-specific user actions behind a clean API.
 *
 * This page object does not validate business outcomes (e.g. cart state),
 * it only performs user interactions. Assertions should be handled at test level
 * or in dedicated expectation helpers.
 */
export class PdpPage extends BasePage {
  private readonly locators: PdpLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new PdpLocators(page);
  }

  /**
   * Clicks the "Add to cart" action button on the PDP.
   * Handles potential third-party overlays before performing the action.
   */
  async addToCart(): Promise<void> {
    await this.handleThirdPartyOverlays();
    await this.locators.getActionButton('addToCart').click();
  }

  /**
   * Clicks the "Buy now" action button on the PDP and initiates checkout.
   * Handles potential third-party overlays before performing the action.
   */
  async buyNow(): Promise<void> {
    await this.handleThirdPartyOverlays();
    await this.locators.getActionButton('buyNow').click();
  }

  /**
   * Returns the product title displayed on the PDP.
   * This method waits until the title is visible to ensure the page is loaded.
   */
  async getProductTitle(): Promise<string> {
    await this.locators.productTitle.waitFor({ state: 'visible' });
    return (await this.locators.productTitle.textContent()) ?? '';
  }

  /**
   * Returns the product price displayed on the PDP.
   * This method waits until the price element is visible.
   */
  async getProductPrice(): Promise<string> {
    await this.locators.productPrice.waitFor({ state: 'visible' });
    return (await this.locators.productPrice.textContent()) ?? '';
  }

  /**
   * Asserts that the PDP is loaded by validating
   * that product title and price are present.
   *
   * This method encapsulates basic PDP sanity checks
   * and keeps assertions out of the test layer.
   */
  async expectProductDetailsToBeVisible(): Promise<void> {
    const title = await this.getProductTitle();
    const price = await this.getProductPrice();

    expect(title, 'Product title should not be empty').not.toBe('');
    expect(price, 'Product price should not be empty').not.toBe('');
  }
}
