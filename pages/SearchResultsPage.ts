import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SearchResultsLocators } from './locators/searchresults.locators';

export class SearchResultsPage extends BasePage {
  private readonly locators: SearchResultsLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new SearchResultsLocators(page);
  }

  /**
   * Verifies that at least the first result item is visible on the page.
   * @returns A promise that resolves when the first result is visible.
   */
  async expectResultsToBeVisible(): Promise<void> {
    await expect(this.locators.resultsItems.first()).toBeVisible({ timeout: 10000 });
  }

  /**
   * Selects a sorting option from the sort dropdown.
   * @param optionKey - The key value of the sort option.
   */
  async selectSortBy(optionKey: 'relevance' | 'price_asc' | 'price_desc') {
    await this.locators.sortByDropdown.click();
    const option = this.page.locator(`li[data-key="${optionKey}"]`);
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  /**
   * Applies a price filter range and waits for the UI to update.
   * @param min - Minimum price value.
   * @param max - Maximum price value.
   */
  async applyPriceFilter(min: string, max: string): Promise<void> {
    await this.locators.minPriceRange.fill(min);
    await this.locators.maxPriceRange.fill(max);

    await this.locators.priceFilterButton.click();
    await this.validatePriceFilter();
  }

  /**
   * Validates that the price filter tag is correctly attached to the UI.
   */
  async validatePriceFilter(): Promise<void> {
    await expect(this.locators.priceFilterTag).toBeVisible();
  }

  /**
   * Converts a currency string into a numeric value.
   * Handles formats like "$ 1.234.567" or "$ 123,45".
   * @param price - The currency string.
   * @returns Numeric representation of the price.
   */
  private parseCurrencyToNumber(price: string): number {
    const cleanValue = price
      .replace(/\./g, '')
      .replace(',', '.')
      .replace(/[^\d.]/g, '');
    return parseFloat(cleanValue);
  }

  /**
   * Iterates through results and verifies they are within the price range.
   * @param minPrice - Expected minimum.
   * @param maxPrice - Expected maximum.
   */
  async validatePriceRangeFiltering(minPrice: string, maxPrice: string): Promise<void> {
    const min = this.parseCurrencyToNumber(minPrice);
    const max = this.parseCurrencyToNumber(maxPrice);

    await this.locators.resultsItems.first().waitFor({ state: 'visible' });
    const items = await this.locators.resultsItems.all();

    for (const item of items) {
      const price = this.parseCurrencyToNumber(await this.locators.getItemPrice(item));

      expect(price).toBeGreaterThanOrEqual(min);
      expect(price).toBeLessThanOrEqual(max);
    }
  }
}
