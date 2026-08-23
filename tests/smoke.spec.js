const { test, expect } = require('@playwright/test');
const { assertDocumentHealthy } = require('./helpers');

test.describe('Storefront smoke tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response.status()).toBeLessThan(400);
    await assertDocumentHealthy(page);
  });

  test('primary navigation shell is present', async ({ page }, testInfo) => {
    await page.goto('/');

    if (testInfo.project.name.includes('mobile')) {
      const menuControl = page.locator(
        'button[aria-label*="menu" i], [role="button"][aria-label*="menu" i]'
      ).first();
      await expect(menuControl).toBeVisible();
    } else {
      await expect(page.getByText(/^mens$/i).first()).toBeVisible();
      await expect(page.getByText(/^womens$/i).first()).toBeVisible();
    }
  });
});
