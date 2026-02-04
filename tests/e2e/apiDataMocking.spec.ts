import { test } from '../../fixtures/testFixtures';
import mockSearch from '../mocks/search.mock.json';

test('should render mocked search results', async ({ page, homePage, searchResultsPage }) => {
  await page.route('**/sites/MLA/search**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSearch),
    })
  );

  await homePage.searchFor('macbook');

  await searchResultsPage.expectResultsCount(3);
  await searchResultsPage.expectResultTitles([
    'Mock MacBook Air M1 256GB',
    'Mock MacBook Pro M2 512GB',
    'Mock MacBook Pro M3 1TB',
  ]);
});
