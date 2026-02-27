import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { SearchResultsPage } from '../pages/SearchResultsPage.js';
import { PdpPage } from '../pages/PdpPage.js';
import { CartPage } from '../pages/CartPage.js';
import { LoginPage } from '../pages/LoginPage.js';
// Fixture extending the base Playwright test to include custom page objects

type PagesFixture = {
  homePage: HomePage;
  searchResultsPage: SearchResultsPage;
  pdpPage: PdpPage;
  cartPage: CartPage;
  loginPage: LoginPage;
};

export const test = base.extend<PagesFixture>({
  page: async ({ page }, use) => {
    // Neutralize Google One Tap / Sign-in as it often overlays and intercepts clicks in production
    // We use "Visual Neutralization" via CSS instead of network blocking to avoid browser stalls
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.innerHTML = `
    #credential_picker_container,
    iframe[src*="accounts.google.com/gsi"] {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;
      document.head.appendChild(style);
    });
    // Increase default timeouts for slower browsers (e.g., Webkit)
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);
    // Re-apply neutralization on each navigation load
    page.on('load', async () => {
      await page.evaluate(() => {
        const style = document.createElement('style');
        style.innerHTML = `
      #credential_picker_container,
      iframe[src*="accounts.google.com/gsi"] {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }`;
        document.head.appendChild(style);
      });
    });
    // Ensure the overlay is hidden before proceeding with tests
    await page.locator('#credential_picker_container').waitFor({ state: 'hidden' });
    await use(page);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await use(homePage);
  },

  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },
  pdpPage: async ({ page }, use) => {
    await use(new PdpPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
