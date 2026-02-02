import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PdpLocators } from './locators/pdp.locators';

/**
 * PdpPage models the Product Detail Page (PDP) of MercadoLibre.
 *
 * This page object encapsulates all user interactions that can be performed
 * from a product detail context, such as:
 * - Reading product metadata (title, price)
 * - Selecting product variants
 * - Triggering primary purchase actions
 *
 * Design principles:
 * - Actions over assertions by default
 * - Assertions are exposed only when they represent page-level guarantees
 * - No business flow validation (e.g. cart contents) is performed here
 */
export class PdpPage extends BasePage {
  private readonly locators: PdpLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new PdpLocators(page);
  }

  /**
   * Adds the currently selected product variant to the shopping cart.
   *
   * This method assumes the PDP is already loaded and:
   * - Handles blocking third-party overlays (e.g. Google One Tap)
   * - Clicks the secondary PDP action ("Add to cart")
   *
   * Navigation or cart validation is intentionally left to the caller.
   */
  async addToCart(): Promise<void> {
    await this.handleThirdPartyOverlays();
    await this.locators.getActionButton('addToCart').click();
  }

  /**
   * Initiates the checkout flow by clicking the "Buy now" action.
   * Overlay handling is performed defensively before interaction.
   */
  async buyNow(): Promise<void> {
    await this.handleThirdPartyOverlays();
    await this.locators.getActionButton('buyNow').click();
  }

  /**
   * Retrieves the product title displayed on the PDP.
   *
   * A visibility wait is applied to ensure the PDP has fully rendered
   * before extracting text content.
   *
   * @returns The visible product title, or an empty string if not found.
   */
  async getProductTitle(): Promise<string> {
    await this.locators.productTitle.waitFor({ state: 'visible' });
    return (await this.locators.productTitle.textContent()) ?? '';
  }

  /**
   * Retrieves the product price displayed on the PDP.
   *
   * This method waits for the price element to become visible
   * to avoid race conditions during page load.
   *
   * @returns The visible product price, or an empty string if not found.
   */
  async getProductPrice(): Promise<string> {
    await this.locators.productPrice.waitFor({ state: 'visible' });
    return (await this.locators.productPrice.textContent()) ?? '';
  }

  /**
   * Performs a basic PDP sanity check.
   *
   * This assertion verifies that:
   * - Product title is present
   * - Product price is present
   *
   * Assertions are intentionally colocated at page level to
   * improve test readability and reuse.
   */
  async expectProductDetailsToBeVisible(): Promise<void> {
    const title = await this.getProductTitle();
    const price = await this.getProductPrice();

    expect(title, 'Product title should not be empty').not.toBe('');
    expect(price, 'Product price should not be empty').not.toBe('');
  }

  async selectVariantAndExpectUrlChange(expectedSlug: string): Promise<void> {
    const currentUrl = this.page.url();

    await Promise.all([
      this.page.waitForURL((url) => url.toString().includes(expectedSlug)),
      this.locators.variationOptionByLabel(expectedSlug.replace('-', ' ')).click(),
    ]);

    expect(this.page.url()).not.toBe(currentUrl);
  }

  /**
   * Selects a product variant based on a stable URL fragment.
   *
   * @param urlFragment - Unique URL substring identifying the variant
   */
  async selectVariantByUrlFragment(urlFragment: string): Promise<void> {
    const option = this.locators.variationOptionByUrlFragment(urlFragment);

    await Promise.all([
      this.page.waitForURL((url) => url.toString().includes(urlFragment)),
      option.click(),
    ]);
  }

  /**
   * Asserts that a variant selection has been applied by validating
   * the current URL contains the expected fragment.
   *
   * This is a structural validation rather than a visual one.
   *
   * @param urlFragment - Expected URL fragment after variant selection
   */
  async expectVariantApplied(urlFragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(urlFragment));
  }

  /**
   * Asserts that a specific variant option exists on the PDP.
   *
   * @param urlFragment - URL fragment identifying the variant option
   */
  async expectVariantOptionToExist(urlFragment: string): Promise<void> {
    await expect(this.locators.variationOptionByUrlFragment(urlFragment)).toHaveCount(1);
  }
}
