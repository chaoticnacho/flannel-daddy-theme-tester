const { expect } = require('@playwright/test');

async function assertNoBrokenImages(page) {
  const broken = await page.locator('img').evaluateAll(imgs =>
    imgs.filter(img => img.complete && img.naturalWidth === 0)
        .map(img => img.currentSrc || img.src || img.alt || 'unknown image')
  );
  expect(broken, `Broken images: ${broken.join(', ')}`).toEqual([]);
}

async function assertNoVisible404(page) {
  const body = (await page.locator('body').innerText()).toLowerCase();
  expect(body).not.toMatch(/page not found|404 error|this page doesn.?t exist/);
}

async function assertDocumentHealthy(page) {
  await expect(page.locator('body')).toBeVisible();
  await assertNoVisible404(page);
  await assertNoBrokenImages(page);
}

module.exports = { assertNoBrokenImages, assertNoVisible404, assertDocumentHealthy };
