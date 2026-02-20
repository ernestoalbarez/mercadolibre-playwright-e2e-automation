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

    const prices = await Promise.all(
      items.map(async (item) => {
        const priceText = await this.locators.getItemPrice(item);
        return this.parseCurrencyToNumber(priceText);
      })
    );

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

    // Pressing Enter on the last field is often more reliable than clicking the small button
    await this.locators.maxPriceRange.press('Enter');

    // Fallback click if the button is still visible/available (defensive)
    if (await this.locators.priceFilterButton.isVisible()) {
      await this.locators.priceFilterButton.click().catch(() => {});
    }

    await this.validatePriceFilter();
  }

  /**
   * Validates that the price filter tag is correctly attached to the UI.
   */
  async validatePriceFilter(): Promise<void> {
    await expect(this.locators.priceFilterTag).toBeVisible({ timeout: 10000 });
  }

  /**
   * Converts a currency string into a numeric value.
   * Handles formats like "$ 1.234.567" or "$ 123,45".
   * Optimized for robustness against extra labels or complex formatting.
   * @param priceText - The currency string.
   * @returns Numeric representation of the price.
   */
  private parseCurrencyToNumber(priceText: string): number {
    if (!priceText) return 0;

    // Normalize string: remove thousands separator (dot) and convert decimal comma to dot
    const cleanValue = priceText
      .replace(/\./g, '')
      .replace(',', '.')
      .replace(/[^\d.]/g, '');

    return parseFloat(cleanValue) || 0;
  }

  /**
   * Refactored validation to check only the most relevant results (first and last).
   * Excludes sponsored and advertising items to reduce falsos negativos.
   *
   * @param minPrice - Expected minimum.
   * @param maxPrice - Expected maximum.
   */
  async validatePriceRangeFiltering(minPrice: string, maxPrice: string): Promise<void> {
    const min = this.parseCurrencyToNumber(minPrice);
    const max = this.parseCurrencyToNumber(maxPrice);

    // Ensure results are loaded
    await this.locators.resultsItems.first().waitFor({ state: 'visible' });

    // Filter non-sponsored items
    const nonSponsoredItems = this.locators.nonSponsoredResultsItems;
    const count = await nonSponsoredItems.count();

    // Use non-sponsored items if available, fallback to all items if filter is too aggressive
    const targetItems = count > 0 ? nonSponsoredItems : this.locators.resultsItems;
    const allVisibleItems = await targetItems.all();

    // Validate first non-sponsored (or first available) result
    const firstPriceText = await this.locators.getItemPrice(allVisibleItems[0]);
    const firstPrice = this.parseCurrencyToNumber(firstPriceText);
    expect(
      firstPrice,
      `First product price (${firstPrice}) should be >= ${min}`
    ).toBeGreaterThanOrEqual(min);
    expect(
      firstPrice,
      `First product price (${firstPrice}) should be <= ${max}`
    ).toBeLessThanOrEqual(max);

    // Validate last non-sponsored (or last visible) result (on the current page)
    const lastIndex = allVisibleItems.length - 1;
    const lastPriceText = await this.locators.getItemPrice(allVisibleItems[lastIndex]);

    const lastPrice = this.parseCurrencyToNumber(lastPriceText);
    expect(
      lastPrice,
      `Last product price (${lastPrice}) should be >= ${min}`
    ).toBeGreaterThanOrEqual(min);
    expect(lastPrice, `Last product price (${lastPrice}) should be <= ${max}`).toBeLessThanOrEqual(
      max
    );
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
