import { test } from '../../fixtures/testFixtures.js';

test.describe('PDP | Product Variants', () => {
  test('should update URL when selecting different product variants', async ({
    page,
    homePage,
    searchResultsPage,
    pdpPage,
  }) => {
    await homePage.open();
    await homePage.searchFor('xiaomi redmi note 14');

    await searchResultsPage.clickFirstResult();
    await pdpPage.expectProductDetailsToBeVisible();

    const variants = await pdpPage.getAvailableVariants();

    if (variants.length < 2) {
      test.skip(true, 'Product does not have at least 2 variants to test URL updates.');
    }

    const originalUrl = page.url();

    // Select the second variant (assuming the first one might be the currently selected one)
    await pdpPage.selectVariant(variants[1]);
    await pdpPage.expectUrlToChange(originalUrl);
  });
});
