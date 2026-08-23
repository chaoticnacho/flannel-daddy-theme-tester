const { test, expect } = require('@playwright/test');
const { assertDocumentHealthy } = require('./helpers');

test.describe('Storefront smoke tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(400);
    await assertDocumentHealthy(page);
  });

  test('main navigation is present', async ({ page }) => {
    await page.goto('/');
    const bodyText = (await page.locator('body').innerText()).toLowerCase();
    expect(bodyText).toContain('mens');
    expect(bodyText).toContain('womens');
  });
});
