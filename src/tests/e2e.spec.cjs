const { test, expect } = require('@playwright/test');

test.skip('visit and create inbox', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=New Address');
  const addr = await page.locator('[data-testid="address"]').innerText();
  expect(addr).toContain('@');
});
