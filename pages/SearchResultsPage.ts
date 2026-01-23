import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SearchResultsLocators } from './locators/searchresults.locators';

export class SearchResultsPage extends BasePage {
  private readonly locators: SearchResultsLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new SearchResultsLocators(page);
  }

  async expectResultsToBeVisible(): Promise<void> {
    await expect(this.locators.resultsItems.first()).toBeVisible();
  }

  async selectSortBy(optionKey: 'relevance' | 'price_asc' | 'price_desc') {
    await this.locators.sortByDropdown.click();

    const option = this.page.locator(`li[data-key="${optionKey}"]`);
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  async applyPriceFilter(min: string, max: string): Promise<void> {
    await this.locators.minPriceRange.waitFor({ state: 'visible' });
    await this.locators.minPriceRange.clear();
    await this.locators.minPriceRange.pressSequentially(min, { delay: 100 });

    await this.locators.maxPriceRange.waitFor({ state: 'visible' });
    await this.locators.maxPriceRange.clear();
    await this.locators.maxPriceRange.pressSequentially(max, { delay: 100 });

    await Promise.all([
      this.locators.priceFilterButton.waitFor({ state: 'visible' }),
      this.locators.priceFilterButton.click(),
    ]);
  }

  async validatePriceFilter(): Promise<void> {
    await expect(this.locators.priceFilterTag).toBeAttached();
  }

  async validatePriceRangeFiltering(minPrice: string, maxPrice: string): Promise<void> {
    await this.validatePriceFilter();
    const priceToNumber = (str: string) => Number(str.replace(/\D/g, ''));

    const itemsCount = await this.locators.resultsItems.count();
    await this.locators.resultsItems.first().waitFor({ state: 'visible' });

    for (let i = 0; i < itemsCount; i++) {
      const item = this.locators.resultsItems.nth(i);
      const itemPrice = await this.locators.getItemPrice(item);

      expect(priceToNumber(itemPrice)).toBeGreaterThanOrEqual(priceToNumber(minPrice));
      expect(priceToNumber(itemPrice)).toBeLessThanOrEqual(priceToNumber(maxPrice));
    }
  }
}
