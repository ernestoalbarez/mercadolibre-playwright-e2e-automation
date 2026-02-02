import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginLocators } from './locators/login.locators';

export class LoginPage extends BasePage {
  private readonly locators: LoginLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new LoginLocators(page);
  }

  /**
   * Fills the username/email field and submits the login form.
   *
   * @param username - Email or username used to identify the user.
   */
  async submitUsername(username: string): Promise<void> {
    await this.locators.usernameInput.fill(username);
    await this.locators.continueButton.click();
  }

  /**
   * Validates that an identification error message is displayed.
   *
   * @param expectedMessage - Optional partial text to validate.
   */
  async expectIdentificationError(expectedMessage?: string): Promise<void> {
    await expect(this.locators.errorMessage).toBeVisible();

    if (expectedMessage) {
      await expect(this.locators.errorMessage).toContainText(expectedMessage);
    }
  }

  /**
   * Navigates to the account creation flow from the login page.
   */
  async goToCreateAccount(): Promise<void> {
    await this.locators.createAccountButton.click();
  }

  /**
   * Handles potential third-party SSO overlays (e.g. Google One Tap)
   * that may interfere with login interactions.
   */
  async handleSSOOverlay(): Promise<void> {
    await super.handleThirdPartyOverlays();
  }
}
