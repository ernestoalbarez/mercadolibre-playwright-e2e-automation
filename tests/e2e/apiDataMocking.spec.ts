import { test } from '../../fixtures/testFixtures.js';
import mockSearch from '../mocks/search.mock.json' with { type: 'json' };
import { buildSearchHtmlFromMock } from '../../utils/mockData.js';

test('should render mocked search results', async ({ page, homePage, searchResultsPage }) => {
  const mockedSearchHtml = buildSearchHtmlFromMock(mockSearch, 3);

  await page.route('**/listado.mercadolibre.com.ar/*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: mockedSearchHtml,
    });
  });

  await homePage.searchFor('macbook');

  await searchResultsPage.expectResultsCount(3);
  await searchResultsPage.expectResultTitles([
    'Mock MacBook Air M1 256GB',
    'Mock MacBook Pro M2 512GB',
    'Mock MacBook Pro M3 1TB',
  ]);
});
