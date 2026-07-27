/**
 * Login suite for OrangeHRM.
 *
 * Run locally:
 *   npx playwright test --project=ua-chromium
 *   npx playwright test --project=prod-chromium
 *
 * The `ua-chromium` and `prod-chromium` projects use per-environment base URLs.
 */
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { loginData } from './test-data/login.data.js';

test.describe('OrangeHRM Login', () => {
  test.describe.configure({ timeout: 180000 });

  test('logs in successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.enterUsername(loginData.valid.username);
    await loginPage.enterPassword(loginData.valid.password);
    await loginPage.clickLogin();

    await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
    await loginPage.dashboardHeading.waitFor({ state: 'visible', timeout: 20000 });
    await expect(loginPage.dashboardHeading).toBeVisible();
    expect(await loginPage.isDashboardDisplayed()).toBeTruthy();
  });

  test('shows an error message for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.enterUsername(loginData.invalid.username);
    await loginPage.enterPassword(loginData.invalid.password);
    await loginPage.clickLogin({ waitForUrl: false });

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe('Invalid credentials');
    await expect(page).toHaveURL(/auth\/login/);
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('shows validation when username and password are empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.enterUsername(loginData.empty.username);
    await loginPage.enterPassword(loginData.empty.password);
    await loginPage.clickLogin({ waitForUrl: false });

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe('Required');
    await expect(page).toHaveURL(/auth\/login/);
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('shows an error message for unknown username', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.enterUsername(loginData.unknown.username);
    await loginPage.enterPassword(loginData.unknown.password);
    await loginPage.clickLogin({ waitForUrl: false });

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe('Invalid credentials');
    await expect(page).toHaveURL(/auth\/login/);
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('navigates to forgot password flow', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.clickForgotPassword();

    await expect(page).toHaveURL(/forgotPassword|requestPasswordReset|passwordRecovery|auth\/requestPasswordReset/);
  });
});
