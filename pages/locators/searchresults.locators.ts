import { Page, Locator } from '@playwright/test';

export class SearchResultsLocators {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get resultsItems(): Locator {
    return this.page.locator('li.ui-search-layout__item');
  }

  /**
   * Locators internos para cada item
   * Usarlos sobre un elemento de resultsItems
   */
  async getItemTitle(item: Locator): Promise<string> {
    return await item.locator('.poly-component__title').innerText();
  }

  async getItemPrice(item: Locator): Promise<string> {
    return await item
      .locator('.poly-price__current .andes-money-amount__fraction')
      .first()
      .innerText();
  }

  getItemImage(item: Locator): Locator {
    return item.locator('[data-testid="picture"]');
  }

  getItemLink(item: Locator): Locator {
    return item.locator('a.poly-component__title');
  }

  getItemRating(item: Locator): Locator {
    return item.locator('.poly-phrase-label').first();
  }

  getItemSoldQuantity(item: Locator): Locator {
    return item.locator('.poly-phrase-label').last();
  }

  getItemShipping(item: Locator): Locator {
    return item.locator('.poly-component__shipping');
  }

  // Filtros generales
  get minPriceRange(): Locator {
    return this.page.locator('[data-testid="Minimum-price"]');
  }

  get maxPriceRange(): Locator {
    return this.page.locator('[data-testid="Maximum-price"]');
  }

  get priceFilterButton(): Locator {
    return this.page.locator('.ui-search-range-filter--price button');
  }

  get sortByDropdown(): Locator {
    return this.page.locator('.ui-search-sort-filter button');
  }

  // Tags de filtros aplicados
  get priceFilterTag(): Locator {
    return this.page
      .locator('.andes-tag')
      .filter({ has: this.page.locator('button[aria-label*="Precio" i]') });
  }
}
