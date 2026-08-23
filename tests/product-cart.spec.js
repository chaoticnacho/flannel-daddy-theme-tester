const { test, expect } = require('@playwright/test');

test('discovers a product page and confirms add-to-cart UI exists', async ({ page }) => {
  await page.goto('/collections/all', { waitUntil: 'domcontentloaded' });
  const productLink = page.locator('a[href*="/products/"]').first();

  if (await productLink.count() === 0) {
    test.skip(true, 'No product link found on /collections/all');
  }

  const href = await productLink.getAttribute('href');
  await page.goto(href);

  const bodyText = (await page.locator('body').innerText()).toLowerCase();
  expect(bodyText).not.toMatch(/page not found|404 error/);

  const addToCart = page.getByRole('button', { name: /add to cart|add to bag/i }).first();
  await expect(addToCart).toBeVisible();
});
