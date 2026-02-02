import { Page, Locator } from '@playwright/test';

/**
 * Maps PDP primary actions to their corresponding URL fragments.
 * These fragments are used to locate action buttons via the `formaction` attribute,
 * which is more stable than dynamic IDs or CSS classes.
 */
const PRODUCT_ACTIONS = {
  buyNow: '/gz/checkout/buy',
  addToCart: '/add-to-cart',
} as const;

/**
 * Supported product actions available on the PDP.
 * Derived from PRODUCT_ACTIONS keys to keep type safety in sync.
 */
type ProductAction = keyof typeof PRODUCT_ACTIONS;

/**
 * PdpLocators exposes all DOM locators for the Product Detail Page (PDP).
 *
 * This class contains only element selectors and no interaction logic.
 * It provides stable locators that are consumed by PdpPage to perform user actions.
 */
export class PdpLocators {
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

  /**
   * Returns the locator for a PDP primary action button.
   * @param action - The product action to locate (e.g. buyNow, addToCart).
   */
  getActionButton(action: ProductAction): Locator {
    return this.page.locator(`button[formaction*="${PRODUCT_ACTIONS[action]}"]`);
  }

  /**
   * Root locator for PDP variation groups.
   */
  get variationPickers(): Locator {
    return this.page.locator('.ui-pdp-outside_variations__picker');
  }

  /**
   * Generic locator for all variation option items.
   */
  get variationOptions(): Locator {
    return this.page.locator('[data-testid="thumbnail-item"]');
  }

  /**
   * Returns a locator for a PDP variant option matched by visible text.
   * Prefer `variationOptionByUrlFragment` when stability is critical.
   *
   * @param label - Visible label of the variant option (e.g. "256 GB", "Negro")
   */
  variationOptionByLabel(label: string): Locator {
    return this.page.locator('[data-testid="thumbnail-item"]', {
      hasText: label,
    });
  }

  /**
   * Returns a locator for a PDP variant option identified by a URL fragment.
   *
   * MercadoLibre performs a full navigation when a variant is selected,
   * so the href attribute is a stable and reliable selector.
   *
   * @param urlFragment - Partial URL that uniquely identifies the variant
   */
  variationOptionByUrlFragment(urlFragment: string): Locator {
    return this.page.locator(`[data-testid="thumbnail-item"][href*="${urlFragment}"]`);
  }
}
