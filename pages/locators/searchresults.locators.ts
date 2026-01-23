import { Page, Locator } from '@playwright/test';

export class SearchResultsLocators {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * @returns Locator for the list of result items.
   */
  get resultsItems(): Locator {
    return this.page.locator('li.ui-search-layout__item');
  }

  /**
   * Extracts the title from a specific item.
   * @param item - The parent item Locator.
   */
  async getItemTitle(item: Locator): Promise<string> {
    return await item.locator('.poly-component__title').innerText();
  }

  /**
   * Extracts the price from a specific item.
   * @param item - The parent item Locator.
   */
  async getItemPrice(item: Locator): Promise<string> {
    return await item.locator('.poly-price__current .andes-money-amount').first().innerText();
  }

  /**
   * Extracts the image locator from a specific item.
   * @param item - The parent item Locator.
   */
  getItemImage(item: Locator): Locator {
    return item.locator('[data-testid="picture"]');
  }

  /**
   * Extracts the url locator from a specific item.
   * @param item - The parent item Locator.
   */
  getItemLink(item: Locator): Locator {
    return item.locator('a.poly-component__title');
  }

  /**
   * Extracts the rating locator from a specific item.
   * @param item - The parent item Locator.
   */
  getItemRating(item: Locator): Locator {
    return item.locator('.poly-phrase-label').first();
  }

  /**
   * Extracts the sold quantity from a specific item.
   * @param item - The parent item Locator.
   */
  getItemSoldQuantity(item: Locator): Locator {
    return item.locator('.poly-phrase-label').last();
  }

  /**
   * Extracts the shipping locator from a specific item.
   * @param item - The parent item Locator.
   */
  getItemShipping(item: Locator): Locator {
    return item.locator('.poly-component__shipping');
  }

  // General filter options

  /**
   * @returns Locator for the minimum price input filter.
   */
  get minPriceRange(): Locator {
    return this.page.locator('[data-testid="Minimum-price"]');
  }

  /**
   * @returns Locator for the maximum price input filter.
   */
  get maxPriceRange(): Locator {
    return this.page.locator('[data-testid="Maximum-price"]');
  }

  /**
   * @returns Locator for the apply price filter button.
   */
  get priceFilterButton(): Locator {
    return this.page.locator('.ui-search-range-filter--price button:not([disabled])');
  }

  /**
   * @returns Locator for the sort by dopdown.
   */
  get sortByDropdown(): Locator {
    return this.page.locator('.ui-search-sort-filter button');
  }

  /**
   * @returns Locator for the free shipping switch option.
   */
  get freeShippingSwitch(): Locator {
    return this.page.locator('input#shipping_cost_highlighted_free');
  }

  // Applied filter tags

  /**
   * @returns Locator for price filter tag.
   */
  get priceFilterTag(): Locator {
    return this.page
      .locator('.andes-tag')
      .filter({ has: this.page.locator('button[aria-label*="Precio" i]') });
  }
}
