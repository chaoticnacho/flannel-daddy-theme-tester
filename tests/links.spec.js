const { test, expect } = require('@playwright/test');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

test('sample of internal homepage links are healthy without triggering Shopify rate limits', async ({ page, request, baseURL }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const hrefs = await page.locator('a[href]').evaluateAll(links =>
    [...new Set(links.map(a => a.getAttribute('href')).filter(Boolean))]
  );

  const internal = hrefs.filter(href =>
    href.startsWith('/') &&
    !href.startsWith('//') &&
    !href.startsWith('/cdn/') &&
    !href.startsWith('/challenge') &&
    !href.startsWith('/account') &&
    !href.includes('#')
  ).slice(0, 12);

  const failures = [];
  const rateLimited = [];

  for (const href of internal) {
    try {
      const response = await request.get(new URL(href, baseURL).toString(), { maxRedirects: 5 });
      const status = response.status();

      if (status === 429) {
        rateLimited.push(href);
      } else if (status === 404 || status >= 500) {
        failures.push(`${href} -> ${status}`);
      }
    } catch (error) {
      failures.push(`${href} -> request error: ${error.message}`);
    }

    await sleep(350);
  }

  if (rateLimited.length) {
    console.log(`Shopify rate-limited ${rateLimited.length} link check(s); they were not counted as broken.`);
  }

  expect(failures, `Broken internal links:\n${failures.join('\n')}`).toEqual([]);
});
