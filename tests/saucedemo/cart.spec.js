// spec: specs/saucedemo-mobile-pixel7.plan.md
// seed: tests/seed.spec.ts

const { test, expect } = require('@playwright/test');

test.describe('Cart', () => {
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

  test('4.1 Add multiple products to cart from inventory', async ({ page }) => {
    // 1. Log in as standard_user
    // 2. Add Backpack ($29.99)
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    // 3. Add Bike Light ($9.99)
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    // 4. Verify cart badge shows '2'
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    // 5. Verify both buttons change to 'Remove'
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
  });

  test('4.2 Add/Remove toggles cart badge', async ({ page }) => {
    // 1. Log in as standard_user
    // 2. Add Backpack (badge=1), add Bike Light (badge=2)
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    // 3. Remove Backpack (badge=1)
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    // 4. Remove Bike Light (badge hidden)
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('4.3 Open cart page via cart icon', async ({ page }) => {
    // 1. Log in, add Backpack
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    // 2. Tap shopping cart icon
    await page.locator('[data-test="shopping-cart-link"]').click();
    // 3. Verify URL is /cart.html
    await expect(page).toHaveURL(/cart\.html$/);
    // 4. Verify cart page displays the item
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
  });

  test('4.4 Empty cart state', async ({ page }) => {
    // 1. Log in as standard_user
    // 2. Navigate directly to /cart.html
    await page.locator('[data-test="shopping-cart-link"]').click();
    // 3. Verify no product items displayed
    await expect(page).toHaveURL(/cart\.html$/);
    await expect(page.locator('.cart_item')).toHaveCount(0);
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
  });

  test('4.5 Remove item from cart page', async ({ page }) => {
    // 1. Log in, add 2 items
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    // 2. Go to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    // 3. Tap Remove next to Bike Light
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    // 4. Verify cart only contains Backpack
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    // 5. Verify cart badge shows '1'
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('4.6 Continue Shopping returns to inventory', async ({ page }) => {
    // 1. Log in, add at least one item
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    // 2. Open cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    // 3. Tap 'Continue Shopping'
    await page.locator('[data-test="continue-shopping"]').click();
    // 4. Verify returns to /inventory.html
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('4.7 Checkout button accessible from cart', async ({ page }) => {
    // 1. Log in, add one item
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    // 2. Open cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    // 3. Verify Checkout button present and tappable
    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeEnabled();
  });

  test('4.8 Cart badge persists across navigation', async ({ page }) => {
    // 1. Log in, add 2 items
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    // 2. Navigate inventory -> detail -> back -> cart -> back -> detail
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await page.locator('[data-test="item-4-title-link"]').click();
    // 3. Verify cart badge always '2'
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });
});