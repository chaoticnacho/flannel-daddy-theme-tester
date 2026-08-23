const { test, expect } = require('@playwright/test');

test.describe('Three-level navigation', () => {
  test('Mens > Flannels exposes vendor names', async ({ page }) => {
    await page.goto('/');
    const bodyText = (await page.locator('body').innerText()).toLowerCase();
    for (const text of ['mens', 'flannels', 'clutch & throttle', 'divided flannel', 'hales']) {
      expect(bodyText).toContain(text);
    }
  });

  test('Mens > Shorties exposes Hales', async ({ page }) => {
    await page.goto('/');
    const bodyText = (await page.locator('body').innerText()).toLowerCase();
    expect(bodyText).toContain('shorties');
    expect(bodyText).toContain('hales');
  });
});
