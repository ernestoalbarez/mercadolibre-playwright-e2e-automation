import { test } from '../../fixtures/testFixtures';

test.describe('MercadoLibre - Sorting Search Results', () => {
  const variations = [
    { title: 'ascending', dropdownOption: 'price_asc', expected: 'asc', searchTerm: 'samsung' },
    { title: 'descending', dropdownOption: 'price_desc', expected: 'desc', searchTerm: 'xiaomi' },
  ];

  for (const variation of variations) {
    test(`should search ${variation.searchTerm} and sort by price ${variation.title} order`, async ({
      homePage,
      searchResultsPage,
    }) => {
      await homePage.searchFor(variation.searchTerm);
      await searchResultsPage.expectResultsToBeVisible();
      await searchResultsPage.selectSortBy(variation.dropdownOption as any);
      await searchResultsPage.expectResultsToBeSortedByPrice(variation.expected as any);
    });
  }
});
