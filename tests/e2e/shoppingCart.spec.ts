import { test } from '../../fixtures/testFixtures';

/**
 * E2E test covering the main shopping flow in MercadoLibre:
 * - Search for a product
 * - Open the first search result
 * - Capture product name and price from PDP
 * - Add product to cart
 * - Validate product details in cart
 */
test.describe('MercadoLibre - Add product to cart flow', () => {
  /**
   * [FIXME] This test is currently failing in public production environments due to mandatory
   * login redirects when adding products to the cart or accessing it as a guest.
   *
   * Technical Root Cause: Mercado Libre initiates a redirect to the login domain, causing the
   * initial DOM elements to detach before the flow can be verified.
   *
   * Recommendation: This flow should be tested in a controlled staging environment or using
   * an authenticated 'storageState' to bypass the public landing/login wall.
   */
  test.fixme('should add first search result to cart and validate name and price', async ({
    homePage,
    searchResultsPage,
    pdpPage,
    cartPage,
  }) => {
    const searchTerm = 'samsung';
    await homePage.open();
    await homePage.searchFor(searchTerm);

    await searchResultsPage.expectResultsToBeVisible();
    await searchResultsPage.clickFirstResult();

    await pdpPage.expectProductDetailsToBeVisible();
    const productName = await pdpPage.getProductTitle();
    const productPrice = await pdpPage.getProductPrice();
    await pdpPage.addToCart();

    await homePage.openCart();
    await cartPage.expectProductInCart(productName, productPrice);
  });
});
