import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HomeLocators } from './locators/home.locators';

/**
 * HomePage represents the MercadoLibre home page.
 *
 * Responsibilities:
 * - Open the home page entry point.
 * - Handle cookie consent if present.
 * - Perform global actions available from the home page (search, cart).
 *
 * This page object encapsulates only high-level user interactions and delegates
 * DOM details to HomeLocators.
 */
export class HomePage extends BasePage {
  private readonly locators: HomeLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new HomeLocators(page);
  }

  /**
   * Opens the home page and handles cookie consent if it appears.
   */
  async open(): Promise<void> {
    await super.open('/');
    await this.acceptCookiesIfPresent();
  }

  /**
   * Accepts the cookie consent banner if it is displayed.
   * This method is intentionally defensive to avoid flakiness.
   */
  private async acceptCookiesIfPresent(): Promise<void> {
    if (await this.locators.acceptCookiesButton.isVisible()) {
      await this.locators.acceptCookiesButton.click();
    }
  }

  /**
   * Performs a search using the global search input.
   * @param term - Search term to submit.
   */
  async searchFor(term: string): Promise<void> {
    await this.locators.searchInput.fill(term);
    await this.locators.searchInput.press('Enter');
  }

  /**
   * Opens the shopping cart from the home page header.
   */
  async openCart(): Promise<void> {
    await this.locators.cartButton.click();
  }

  /**
   * Opens the login page from the home page header.
   */
  async openLogin(): Promise<void> {
    await this.locators.loginButton.click();
  }
}
