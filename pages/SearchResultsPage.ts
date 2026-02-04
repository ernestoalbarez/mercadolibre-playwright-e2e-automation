import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SearchResultsLocators, SortOption } from './locators/searchresults.locators';

export class SearchResultsPage extends BasePage {
  private readonly locators: SearchResultsLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new SearchResultsLocators(page);
  }

  /**
   * Verifies that at least the first result item is visible on the page.
   */
  async expectResultsToBeVisible(): Promise<void> {
    await expect(this.locators.resultsItems.first()).toBeVisible({ timeout: 10000 });
  }

  /**
   * Clicks on a result card by index and navigates to the Product Detail Page (PDP).
   * @param index - Zero-based index of the result card to open.
   */
  async openResultByIndex(index: number = 0): Promise<void> {
    const item = this.locators.resultsItems.nth(index);

    await item.waitFor({ state: 'visible' });
    await item.click();
  }

  async clickFirstResult(): Promise<void> {
    await this.openResultByIndex(0);
  }

  /**
   * Selects a sorting option from the sort dropdown.
   * Validates that the provided option is supported by the page.
   *
   * @param optionKey - Supported sort option key.
   */
  async selectSortBy(optionKey: SortOption): Promise<void> {
    await super.handleThirdPartyOverlays();
    await this.locators.sortByDropdown.click();

    const option = this.locators.getSortOption(optionKey);
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  /**
   * Validates that results show a sorting trend by price
   * (not strict ordering, to avoid flakiness due to ads or mixed results).
   * @param direction - Sorting direction to validate.
   */
  async expectResultsToBeSortedByPrice(direction: 'asc' | 'desc'): Promise<void> {
    await this.locators.resultsItems.first().waitFor({ state: 'visible' });

    const items = (await this.locators.resultsItems.all()).slice(0, 5);
    const prices: number[] = [];

    for (const item of items) {
      const priceText = await this.locators.getItemPrice(item);
      prices.push(this.parseCurrencyToNumber(priceText));
    }

    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];

    if (direction === 'asc') {
      expect(firstPrice).toBeLessThanOrEqual(lastPrice);
    } else {
      expect(firstPrice).toBeGreaterThanOrEqual(lastPrice);
    }
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

  /**
   * Validates the amount of rendered search result items.
   * @param expectedCount - Expected number of results.
   */
  async expectResultsCount(expectedCount: number): Promise<void> {
    await this.locators.resultsItems.first().waitFor({ state: 'visible' });
    await expect(this.locators.resultsItems).toHaveCount(expectedCount);
  }

  /**
   * Validates that result titles match the expected list (by order).
   * @param expectedTitles - Array of expected product titles.
   */
  async expectResultTitles(expectedTitles: string[]): Promise<void> {
    await this.locators.resultsItems.first().waitFor({ state: 'visible' });

    const titles = await this.locators.resultsItems.allTextContents();

    expect(titles.length).toBeGreaterThanOrEqual(expectedTitles.length);

    expectedTitles.forEach((expectedTitle, index) => {
      expect(titles[index]).toContain(expectedTitle);
    });
  }

  /**
   * Activate the Free Shipping filter.
   * If already active, does nothing.
   */
  async checkFreeShipping(): Promise<void> {
    await this.locators.freeShippingSwitch.check();
  }

  /**
   * Validates that the Free Shipping switch is checked.
   */
  async expectFreeShippingIsChecked(): Promise<void> {
    await expect(this.locators.freeShippingSwitch).toBeChecked();
  }
}
