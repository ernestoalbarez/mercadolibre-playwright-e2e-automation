import { test } from '../../fixtures/testFixtures';

test.describe('MercadoLibre - Search flow', () => {
  test('should search for a product and show results', async ({ homePage, searchResultsPage }) => {
    await homePage.open();
    await homePage.searchFor('iphone');

    await searchResultsPage.expectResultsToBeVisible();
  });
});
