const { test, expect } = require('@playwright/test');

async function firstVisible(locator) {
  const count = await locator.count();
  for (let i = 0; i < count; i++) {
    const item = locator.nth(i);
    if (await item.isVisible().catch(() => false)) return item;
  }
  return null;
}

async function openMobileMenu(page) {
  const candidates = [
    page.locator('button[aria-label*="menu" i]'),
    page.locator('[role="button"][aria-label*="menu" i]'),
    page.getByRole('button', { name: /menu/i }),
    page.locator('summary').filter({ hasText: /menu/i })
  ];

  for (const candidate of candidates) {
    const item = await firstVisible(candidate);
    if (item) {
      await item.click();
      await page.waitForTimeout(250);
      return;
    }
  }

  throw new Error('Could not find a visible mobile menu control.');
}

async function revealMens(page, isMobile) {
  const mens = page.getByText(/^mens$/i);

  if (isMobile) {
    const item = await firstVisible(mens);
    if (!item) throw new Error('Mens menu item was not visible after opening the mobile menu.');
    await item.click();
    await page.waitForTimeout(250);
    return;
  }

  const item = await firstVisible(mens);
  if (!item) throw new Error('Mens navigation item was not visible on desktop.');
  await item.hover();
  await page.waitForTimeout(300);
}

async function revealFlannels(page, isMobile) {
  const flannels = page.getByText(/^(men.?s )?flannels$/i);
  const item = await firstVisible(flannels);
  if (!item) throw new Error('Flannels submenu item was not visible after opening Mens.');

  if (isMobile) {
    await item.click();
  } else {
    await item.hover();
  }
  await page.waitForTimeout(300);
}

async function assertVendorLink(page, pattern) {
  const links = page.getByRole('link', { name: pattern });
  const count = await links.count();

  expect(count, `Expected vendor link ${pattern} to exist in the opened Flannels menu.`).toBeGreaterThan(0);

  let visible = false;
  for (let i = 0; i < count; i++) {
    if (await links.nth(i).isVisible().catch(() => false)) {
      visible = true;
      break;
    }
  }

  expect(visible, `Vendor link ${pattern} exists but is not visible after opening the nested menu.`).toBe(true);
}

test.describe('Three-level navigation', () => {
  test('Mens > Flannels exposes vendor links after real menu interaction', async ({ page }, testInfo) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const isMobile = testInfo.project.name.includes('mobile');

    if (isMobile) {
      await openMobileMenu(page);
    }

    await revealMens(page, isMobile);
    await revealFlannels(page, isMobile);

    await assertVendorLink(page, /clutch\s*(?:&|and)\s*throttle/i);
    await assertVendorLink(page, /divided flannel/i);
    await assertVendorLink(page, /hales/i);
  });

  test('vendor links have usable destinations', async ({ page }, testInfo) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const isMobile = testInfo.project.name.includes('mobile');

    if (isMobile) {
      await openMobileMenu(page);
    }

    await revealMens(page, isMobile);
    await revealFlannels(page, isMobile);

    const patterns = [
      /clutch\s*(?:&|and)\s*throttle/i,
      /divided flannel/i,
      /hales/i
    ];

    for (const pattern of patterns) {
      const link = page.getByRole('link', { name: pattern }).first();
      await expect(link).toHaveAttribute('href', /.+/);
      const href = await link.getAttribute('href');
      expect(href, `${pattern} has an empty href`).not.toBe('#');
    }
  });
});
