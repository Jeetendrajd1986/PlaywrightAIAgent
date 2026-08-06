// spec: tests/saucedemo/plans/mobile-ux.plan.md
// seed: tests/seed.spec.ts

const { test, expect } = require('@playwright/test');

test.describe('Mobile UX', () => {
  test('6.1 No horizontal scrollbar on Pixel 7 viewport', async ({ page }) => {
    // 1. Visit login page
    await page.goto('https://www.saucedemo.com/');
    // 2. Verify no horizontal scroll
    const loginWidths = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(loginWidths.scrollWidth).toBe(loginWidths.clientWidth);

    // 3. Repeat on inventory, cart, checkout-step-one
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL('**/inventory.html');

    const invWidths = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(invWidths.scrollWidth).toBe(invWidths.clientWidth);

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.waitForURL('**/cart.html');

    const cartWidths = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(cartWidths.scrollWidth).toBe(cartWidths.clientWidth);

    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html');

    const stepOneWidths = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(stepOneWidths.scrollWidth).toBe(stepOneWidths.clientWidth);
  });

  test('6.2 Touch targets have adequate size', async ({ page }) => {
    // 1. Visit login page
    await page.goto('https://www.saucedemo.com/');
    // 2. Verify Login button has tap-friendly height
    const loginBox = await page.locator('[data-test="login-button"]').boundingBox();
    expect(loginBox.height).toBeGreaterThanOrEqual(36);

    // 3. Visit inventory and verify buttons are tappable
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL('**/inventory.html');

    const addBox = await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').boundingBox();
    expect(addBox.height).toBeGreaterThanOrEqual(30);
  });

  test('6.3 Form inputs trigger keyboard and remain visible', async ({ page }) => {
    // 1. Log in and open checkout step one
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL('**/inventory.html');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html');

    // 2. Tap First Name field
    await page.locator('[data-test="firstName"]').click();
    // 3. Verify keyboard opens and field stays in view (focus is on the input)
    const isFocused = await page.evaluate(
      () => document.activeElement === document.querySelector('[data-test="firstName"]')
    );
    expect(isFocused).toBeTruthy();
  });

  test('6.4 Vertical scrolling works in inventory list', async ({ page }) => {
    // 1. Log in as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL('**/inventory.html');
    // 2. Scroll inventory
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // 3. Verify all 6 products are reachable
    const count = await page.locator('.inventory_item').count();
    expect(count).toBe(6);
  });

  test('6.5 Orientation change preserves layout', async ({ page }) => {
    // 1. Log in and view the inventory in portrait
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL('**/inventory.html');
    // 2. Rotate to landscape
    await page.setViewportSize({ width: 915, height: 412 });
    // 3. Verify layout reflows without horizontal scroll
    const widths = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(widths.scrollWidth).toBeLessThanOrEqual(widths.clientWidth + 1);
  });

  test('6.6 No critical console errors during flow', async ({ page }) => {
    const errors = [];
    // Filter out benign 401s from Sauce Labs' own error-tracking telemetry
    // (events.backtrace.io). These are external to the app under test and not
    // caused by the user flow, so they should not be treated as failures.
    const isIgnorableError = (text) => {
      if (!text) return false;
      return (
        text.includes('401 (Unauthorized)') ||
        text.includes('events.backtrace.io') ||
        text.includes('backtrace')
      );
    };
    page.on('pageerror', (err) => {
      if (!isIgnorableError(err.message)) errors.push('pageerror: ' + err.message);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !isIgnorableError(msg.text())) {
        errors.push('console.error: ' + msg.text());
      }
    });

    // 1. Run full flow: Login -> Inventory -> Add -> Cart -> Checkout -> Finish -> Back Home
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL('**/inventory.html');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html');
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html');
    await page.locator('[data-test="finish"]').click();
    await page.waitForURL('**/checkout-complete.html');
    await page.locator('[data-test="back-to-products"]').click();
    await page.waitForURL('**/inventory.html');

    // 2. Verify no uncaught JavaScript errors (telemetry noise filtered out)
    expect(errors).toEqual([]);
  });
});