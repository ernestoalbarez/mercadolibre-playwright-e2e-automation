import { test } from '../../fixtures/testFixtures';

test.describe('MercadoLibre - Search flow', () => {
  test('should search for a product and show results', async ({ homePage, searchResultsPage }) => {
    await homePage.searchFor('iphone');
    await searchResultsPage.expectResultsToBeVisible();
  });
});

test.describe('MercadoLibre - Search Filters', () => {
  test('should search xiaomi and filter by price range', async ({
    homePage,
    searchResultsPage,
  }) => {
    const min = '200000';
    const max = '500000';

    await homePage.searchFor('xiaomi');
    await searchResultsPage.expectResultsToBeVisible();
    await searchResultsPage.applyPriceFilter(min, max);
    await searchResultsPage.validatePriceRangeFiltering(min, max);
  });
});
