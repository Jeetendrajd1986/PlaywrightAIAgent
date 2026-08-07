// spec: specs/saucedemo-mobile-pixel7.plan.md
// seed: tests/seed.spec.js

const { test, expect } = require('@playwright/test');

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('1.1 Login with valid credentials (happy path)', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    // 2. Enter standard_user in the Username field
    await page.locator('[data-test="username"]').fill('standard_user');
    // 3. Enter secret_sauce in the Password field
    await page.locator('[data-test="password"]').fill('secret_sauce');
    // 4. Tap the Login button
    await page.locator('[data-test="login-button"]').click();
    // 5. URL should change to https://www.saucedemo.com/inventory.html
    await expect(page).toHaveURL(/inventory\.html$/);
    // 6. Product list with the Open Menu (hamburger) button, sort dropdown, and at least one product card is visible
    await expect(page.getByRole('button', { name: 'Open Menu' })).toBeVisible();
    await expect(page.locator('[data-test="title"]')).toBeVisible();
    await expect(page.locator('.inventory_item').first()).toBeVisible();
  });

  test('1.2 Login with empty username and password', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    // 2. Leave Username field empty
    // 3. Leave Password field empty
    // 4. Tap the Login button
    await page.locator('[data-test="login-button"]').click();
    // 5. Error message 'Username is required' is displayed
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('1.3 Login with missing password', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    // 2. Enter standard_user in Username
    await page.locator('[data-test="username"]').fill('standard_user');
    // 3. Leave Password empty
    // 4. Tap Login button
    await page.locator('[data-test="login-button"]').click();
    // 5. Error message 'Password is required' is displayed
    await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
  });

  test('1.4 Login attempt with locked_out_user', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    // 2. Enter locked_out_user in Username
    await page.locator('[data-test="username"]').fill('locked_out_user');
    // 3. Enter secret_sauce in Password
    await page.locator('[data-test="password"]').fill('secret_sauce');
    // 4. Tap Login button
    await page.locator('[data-test="login-button"]').click();
    // 5. Error message containing 'locked out' is displayed
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('1.5 Login with invalid credentials', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    // 2. Enter invalid_user in Username
    await page.locator('[data-test="username"]').fill('invalid_user');
    // 3. Enter wrong_password in Password
    await page.locator('[data-test="password"]').fill('wrong_password');
    // 4. Tap Login button
    await page.locator('[data-test="login-button"]').click();
    // 5. Error message containing 'do not match' or 'Epic sadface' is displayed
    await expect(page.locator('[data-test="error"]')).toContainText('do not match');
  });

  test('1.6 Login then logout via menu', async ({ page }) => {
    // 1. Log in successfully as standard_user / secret_sauce
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html$/);
    // 2. Tap the Open Menu (hamburger) button
    await page.getByRole('button', { name: 'Open Menu' }).click();
    // 3. Tap the 'Logout' link in the drawer
    await page.locator('[data-test="logout-sidebar-link"]').click();
    // 4. User is redirected back to https://www.saucedemo.com/
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('1.7 Login form lists accepted usernames and password', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    // 2. Verify all 6 usernames listed and password text 'secret_sauce' visible
    const usernames = [
      'standard_user',
      'locked_out_user',
      'problem_user',
      'performance_glitch_user',
      'error_user',
      'visual_user',
    ];
    for (const username of usernames) {
      await expect(page.getByText(username)).toBeVisible();
    }
    await expect(page.getByText('secret_sauce')).toBeVisible();
  });
});