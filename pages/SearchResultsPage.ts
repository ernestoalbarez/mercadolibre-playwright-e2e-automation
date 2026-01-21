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
}
