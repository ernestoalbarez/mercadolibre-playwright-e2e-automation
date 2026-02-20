import { Page, Locator } from '@playwright/test';

/**
 * LoginLocators exposes all DOM locators for the Login Page.
 *
 * This class contains only element selectors and no interaction logic.
 * It provides stable locators that are consumed by LoginPage to perform user actions.
 */
export class LoginLocators {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Username / email input field.
   */
  get usernameInput(): Locator {
    return this.page.getByTestId('user_id');
  }

  /**
   * Continue button used to submit the username/email.
   */
  get continueButton(): Locator {
    return this.page.getByRole('button', { name: /continuar/i });
  }

  /**
   * Link to initiate account creation flow.
   */
  get createAccountButton(): Locator {
    return this.page.getByRole('link', { name: /crear cuenta/i });
  }

  /**
   * Error message container displayed after invalid input.
   */
  get errorMessage(): Locator {
    return this.page.locator('#identification-message');
  }

  /**
   * Google SSO / One Tap overlay entry point.
   */
  get ssoOverlay(): Locator {
    return this.page.getByRole('button', { name: /google/i });
  }
}
