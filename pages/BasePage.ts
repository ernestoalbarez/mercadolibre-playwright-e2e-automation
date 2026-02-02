import { Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Handles third-party overlays (e.g. Google One Tap) that may intercept pointer events.
   * This method is safe to call before critical interactions.
   */
  async handleThirdPartyOverlays(): Promise<void> {
    const googleOneTapIframe = this.page.locator('#credential_picker_container iframe');

    if (await googleOneTapIframe.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Attempt to dismiss overlay gracefully
      await this.page.keyboard.press('Escape').catch(() => {});
      await googleOneTapIframe.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  }
}
