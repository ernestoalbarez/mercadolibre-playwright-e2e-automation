import { test } from '../../fixtures/testFixtures';

test.describe('PDP | Product Variants', () => {
  test('should update URL when selecting different product variants', async ({
    homePage,
    searchResultsPage,
    pdpPage,
  }) => {
    await homePage.open();
    await homePage.searchFor('xiaomi redmi note 14');

    await searchResultsPage.clickFirstResult();
    await pdpPage.expectProductDetailsToBeVisible();

    await pdpPage.expectVariantOptionToExist('azul-oceano');
    await pdpPage.selectVariantByUrlFragment('azul-oceano');
    await pdpPage.expectVariantApplied('azul-oceano');

    await pdpPage.expectVariantOptionToExist('128-gb-6-gb');
    await pdpPage.selectVariantByUrlFragment('128-gb-6-gb');
    await pdpPage.expectVariantApplied('128-gb-6-gb');
  });
});
