const { test, expect } = require('@playwright/test');

test('sample of internal homepage links do not return 404/5xx', async ({ page, request, baseURL }) => {
  await page.goto('/');
  const hrefs = await page.locator('a[href]').evaluateAll(links =>
    [...new Set(links.map(a => a.getAttribute('href')).filter(Boolean))]
  );

  const internal = hrefs.filter(href =>
    href.startsWith('/') &&
    !href.startsWith('//') &&
    !href.startsWith('/cdn/') &&
    !href.startsWith('/challenge') &&
    !href.includes('#')
  ).slice(0, 40);

  const failures = [];
  for (const href of internal) {
    try {
      const response = await request.get(new URL(href, baseURL).toString(), { maxRedirects: 5 });
      if (response.status() >= 400) failures.push(`${href} -> ${response.status()}`);
    } catch {
      failures.push(`${href} -> request error`);
    }
  }

  expect(failures, `Broken internal links:\n${failures.join('\n')}`).toEqual([]);
});
