import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HomeLocators } from './locators/home.locators';

export class HomePage extends BasePage {
  private readonly locators: HomeLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new HomeLocators(page);
  }

  async open(): Promise<void> {
    await super.open('/');
    await this.acceptCookiesIfPresent();
  }

  private async acceptCookiesIfPresent(): Promise<void> {
    if (await this.locators.acceptCookiesButton.isVisible()) {
      await this.locators.acceptCookiesButton.click();
    }
  }

  async searchFor(term: string): Promise<void> {
    await this.locators.searchInput.fill(term);
    await this.locators.searchInput.press('Enter');
  }
}
