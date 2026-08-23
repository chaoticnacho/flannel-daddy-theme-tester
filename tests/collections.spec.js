const { test, expect } = require('@playwright/test');
const { assertDocumentHealthy } = require('./helpers');

test('Mens flannels collection loads', async ({ page }) => {
  const response = await page.goto('/collections/men-s-flannels', { waitUntil: 'domcontentloaded' });
  expect(response).not.toBeNull();
  expect(response.status()).toBeLessThan(400);
  await assertDocumentHealthy(page);
});

test('known vendor-filter pages may be empty but must not be 404s', async ({ page }) => {
  for (const path of [
    '/collections/men-s-flannels/Clutch-%26-Throttle',
    '/collections/men-s-flannels/Hales'
  ]) {
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    if (response) expect(response.status()).toBeLessThan(400);
    const body = (await page.locator('body').innerText()).toLowerCase();
    expect(body).not.toMatch(/page not found|404 error|this page doesn.?t exist/);
  }
});
