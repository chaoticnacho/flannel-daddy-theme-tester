# Flannel Daddy Theme Tester

Automated Playwright regression tests for the Flannel Daddy Shopify theme.

## V1 coverage

- Homepage health
- Desktop and mobile Chromium
- Three-level navigation text
- Mens flannels collection
- Empty collection vs. true 404 detection
- Sample of internal homepage links
- Broken images
- Product-page add-to-cart UI presence
- Horizontal overflow checks
- Failure screenshots, traces, video, HTML report, and JUnit output

## Current preview URL

`https://pnvm7fr2pdb6t14j-68906025043.shopifypreview.com`

For GitHub Actions, create a repository secret named `SHOPIFY_PREVIEW_URL` and paste the current Shopify theme preview URL as its value.

## Local setup

```bash
npm install
npx playwright install chromium
npm test
```

To view the HTML report:

```bash
npm run report
```

## GitHub setup

Upload this project into the root of:

`chaoticnacho/flannel-daddy-theme-tester`

Then go to:

**Repository → Settings → Secrets and variables → Actions → New repository secret**

Create:

- Name: `SHOPIFY_PREVIEW_URL`
- Value: `https://pnvm7fr2pdb6t14j-68906025043.shopifypreview.com`

The tests run on pushes and pull requests to `main`, and can also be started manually from the Actions tab.

## Next expansion

After the GitHub connection is working again, V2 should add exact theme selectors for:
- opening desktop nested menus
- opening mobile drawer nested menus
- clicking each vendor link
- selecting variants
- true add-to-cart execution
- cart quantity/remove checks
- search
- footer/legal links
- accessibility checks
- visual regression snapshots
