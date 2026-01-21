import { test, expect } from '@playwright/test';

test.describe('MercadoLibre - Search flow', () => {
  test('should search for a product and show results', async ({ page }) => {
    await page.goto('/');

    // Aceptar cookies si aparece
    const acceptCookies = page.getByRole('button', { name: /aceptar/i });
    if (await acceptCookies.isVisible()) {
      await acceptCookies.click();
    }

    // Buscar un producto
    const searchInput = page.getByRole('textbox', { name: /buscar/i });
    await searchInput.fill('iphone');
    await searchInput.press('Enter');

    // Validar resultados
    const results = page.locator('li.ui-search-layout__item');
    await expect(results.first()).toBeVisible();
  });
});