// spec: specs/saucedemo-mobile-pixel7.plan.md
// seed: tests/seed.spec.ts

const { test, expect } = require('@playwright/test');

test.describe('Product Details', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any leftover state from previous tests
    await page.context().clearCookies();
    await page.goto('https://www.saucedemo.com/');
    await page.evaluate(() => {
      try { window.sessionStorage.clear(); } catch {}
      try { window.localStorage.clear(); } catch {}
    });
    // Login as standard_user
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html$/);
  });

  test('3.1 Open product detail by clicking title', async ({ page }) => {
    // 1. Log in as standard_user
    // 2. Tap 'Sauce Labs Backpack' title
    await page.locator('[data-test="item-4-title-link"]').click();
    // 3. Verify URL is /inventory-item.html?id=4
    await expect(page).toHaveURL(/inventory-item\.html\?id=4$/);
    // 4. Verify detail page shows image, name, description, price, Add to cart
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.inventory_details_price')).toHaveText('$29.99');
    await expect(page.locator('.inventory_details_desc')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
  });

  test('3.2 Open product detail by clicking image', async ({ page }) => {
    // 1. Log in as standard_user
    // 2. Tap the image for Sauce Labs Backpack
    await page.locator('[data-test="item-4-img-link"]').click();
    // 3. Verify /inventory-item.html?id=4 page reached
    await expect(page).toHaveURL(/inventory-item\.html\?id=4$/);
  });

  test('3.3 Back to products button', async ({ page }) => {
    // 1. Log in, open Backpack detail
    await page.locator('[data-test="item-4-title-link"]').click();
    // 2. Tap 'Back to products'
    await page.locator('[data-test="back-to-products"]').click();
    // 3. Verify user returns to /inventory.html
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('3.4 Add product to cart from detail page', async ({ page }) => {
    // 1. Log in, navigate to Backpack detail
    await page.locator('[data-test="item-4-title-link"]').click();
    // 2. Tap 'Add to cart'
    await page.locator('[data-test="add-to-cart"]').click();
    // 3. Verify button changes to 'Remove'
    await expect(page.locator('[data-test="remove"]')).toBeVisible();
    // 4. Verify cart badge displays '1'
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('3.5 Remove product from cart via detail page', async ({ page }) => {
    // 1. Log in, add Backpack from detail page
    await page.locator('[data-test="item-4-title-link"]').click();
    await page.locator('[data-test="add-to-cart"]').click();
    // 2. Tap 'Remove'
    await page.locator('[data-test="remove"]').click();
    // 3. Verify button reverts to 'Add to cart'
    await expect(page.locator('[data-test="add-to-cart"]')).toBeVisible();
    // 4. Verify cart badge disappears
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});