# Flannel Daddy Theme Tester V2

V2 improves the original Shopify regression suite by making the checks behave more like a real shopper.

## V2 fixes

- Opens the mobile menu before checking navigation.
- Opens or hovers `Mens`, then `Flannels`, before checking vendor links.
- Verifies Clutch & Throttle, Divided Flannel, and Hales only after the nested menu is opened.
- Verifies vendor links have non-empty destinations.
- Excludes `/account` from generic link checks because Shopify may return 406 to automated account requests.
- Reduces link-check volume and adds delays to avoid Shopify 429 rate limiting.
- Treats 429 responses as rate-limit events, not broken links.
- Keeps screenshots, traces, and videos on failures.
- Uses Node 24 in GitHub Actions to remove the Node 20 deprecation warning.

## Target

Keep the GitHub Actions secret:

`SHOPIFY_PREVIEW_URL`

set to:

`https://flanneldaddyloot.com`

until we have a stable remote staging target.

## Run

From GitHub:

**Actions → Shopify Theme Regression Tests → Run workflow**

If a test fails, download the `playwright-report` or `test-results` artifact from the run.
