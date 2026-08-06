// spec: specs/saucedemo-mobile-pixel7.plan.md
// seed: tests/seed.spec.ts

const { test, expect } = require('@playwright/test');

test.describe('Inventory', () => {
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

  test('2.1 Inventory page default state after login', async ({ page }) => {
    // 1. Log in successfully as standard_user
    // 2. Verify URL is /inventory.html
    await expect(page).toHaveURL(/inventory\.html$/);
    // 3. Verify all 6 products listed
    await expect(page.locator('.inventory_item')).toHaveCount(6);
    // 4. Verify cart badge is not displayed
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    // 5. Verify footer social links and copyright text visible
    await expect(page.locator('a[href="https://twitter.com/saucelabs"]')).toBeVisible();
    await expect(page.locator('a[href="https://www.facebook.com/saucelabs"]')).toBeVisible();
    await expect(page.locator('a[href="https://www.linkedin.com/company/sauce-labs/"]')).toBeVisible();
  });

  test('2.2 Sort products by Name (A to Z) - default', async ({ page }) => {
    // 1. Log in as standard_user
    // 2. Verify first product is 'Sauce Labs Backpack'
    await expect(page.locator('.inventory_item_name').first()).toHaveText('Sauce Labs Backpack');
  });

  test('2.3 Sort products by Name (Z to A)', async ({ page }) => {
    // 1. Log in as standard_user
    // 2. Select 'Name (Z to A)'
    await page.locator('[data-test="product-sort-container"]').selectOption('za');
    // 3. Verify first product is 'Test.allTheThings() T-Shirt (Red)'
    await expect(page.locator('.inventory_item_name').first()).toHaveText('Test.allTheThings() T-Shirt (Red)');
  });

  test('2.4 Sort products by Price (low to high)', async ({ page }) => {
    // 1. Log in as standard_user
    // 2. Select 'Price (low to high)'
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    // 3. Verify first product is Sauce Labs Onesie ($7.99)
    await expect(page.locator('.inventory_item_name').first()).toHaveText('Sauce Labs Onesie');
    await expect(page.locator('.inventory_item_price').first()).toHaveText('$7.99');
  });

  test('2.5 Sort products by Price (high to low)', async ({ page }) => {
    // 1. Log in as standard_user
    // 2. Select 'Price (high to low)'
    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
    // 3. Verify first product is Sauce Labs Fleece Jacket ($49.99)
    await expect(page.locator('[data-test="item-5-title-link"]')).toBeVisible();
    await expect(page.locator('.inventory_item_name').first()).toHaveText('Sauce Labs Fleece Jacket');
    await expect(page.locator('.inventory_item_price').first()).toHaveText('$49.99');
  });

  test('2.6 Hamburger menu opens and closes', async ({ page }) => {
    // 1. Log in as standard_user
    // 2. Tap Open Menu
    await page.getByRole('button', { name: 'Open Menu' }).click();
    // 3. Verify All Items, About, Logout, Reset App State links visible
    await expect(page.locator('[data-test="inventory-sidebar-link"]')).toBeVisible();
    await expect(page.locator('[data-test="about-sidebar-link"]')).toBeVisible();
    await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeVisible();
    await expect(page.locator('[data-test="reset-sidebar-link"]')).toBeVisible();
    // 4. Tap Close Menu
    await page.getByRole('button', { name: 'Close Menu' }).click();
    // 5. Verify drawer dismissed - wait for the link to detach from DOM
    await expect(page.locator('[data-test="logout-sidebar-link"]')).toBeHidden();
  });

  test('2.8 Reset App State clears cart', async ({ page }) => {
    // 1. Log in as standard_user
    // 2. Add 2 products to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    // 3. Open hamburger menu
    await page.getByRole('button', { name: 'Open Menu' }).click();
    // 4. Tap 'Reset App State'
    await page.locator('[data-test="reset-sidebar-link"]').click();
    // 5. Verify cart badge disappears
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    // 6. Reload the page so the inventory buttons fully re-render as "Add to cart"
    await page.reload();
    // 7. Verify all Add to cart buttons re-appear
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toBeVisible();
  });

  test('2.10 Footer social media links', async ({ page }) => {
    // 1. Log in as standard_user
    // 2. Verify footer has Twitter, Facebook, LinkedIn with correct href targets
    await expect(page.locator('a[href="https://twitter.com/saucelabs"]')).toHaveAttribute('href', 'https://twitter.com/saucelabs');
    await expect(page.locator('a[href="https://www.facebook.com/saucelabs"]')).toHaveAttribute('href', 'https://www.facebook.com/saucelabs');
    await expect(page.locator('a[href="https://www.linkedin.com/company/sauce-labs/"]')).toHaveAttribute('href', 'https://www.linkedin.com/company/sauce-labs/');
  });
});