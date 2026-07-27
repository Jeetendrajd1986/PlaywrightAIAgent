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

const attachScreenshot = async (page, name) => {
  try {
    const buffer = await page.screenshot({ fullPage: true, type: 'png' });
    await test.info().attach(name, {
      body: buffer,
      contentType: 'image/png',
    });
  } catch (_) {
    try {
      const buffer = await page.screenshot({ type: 'png' });
      await test.info().attach(name, {
        body: buffer,
        contentType: 'image/png',
      });
    } catch {
      // never fail a test because of a screenshot
    }
  }
};

test.describe('OrangeHRM Login', () => {
  test.describe.configure({ timeout: 180000 });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(180000);
    await attachScreenshot(page, '00-login-page-loaded');
  });

  test.afterEach(async ({ page }, testInfo) => {
    const safeTitle = testInfo.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    await attachScreenshot(page, `final-${testInfo.status}-${safeTitle}`);
  });

  test('logs in successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.enterUsername(loginData.valid.username);
    await loginPage.enterPassword(loginData.valid.password);
    await loginPage.clickLogin();

    await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });

    // The dashboard's "Dashboard" appears in the sidebar nav (a span), not as a heading.
    // Wait for either the URL or a sidebar element to confirm we are inside the app.
    await page.waitForFunction(() => location.pathname.includes('/dashboard'), null, { timeout: 20000 });
    await expect(page.getByText(/^Dashboard$/).first()).toBeVisible({ timeout: 20000 });
    await attachScreenshot(page, '01-dashboard-loaded');
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

    // Be lenient: any visible "Invalid credentials" alert is enough
    const alert = page.getByRole('alert').filter({ hasText: /Invalid credentials/i });
    await expect(alert).toBeVisible({ timeout: 15000 });
    await attachScreenshot(page, '01-unknown-username-error');

    await expect(page).toHaveURL(/auth\/login/);
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('navigates to forgot password flow', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    // Be defensive: if the forgot-password link wasn't rendered, reload once
    try {
      await loginPage.clickForgotPassword();
    } catch (_) {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await loginPage.navigate();
      await loginPage.clickForgotPassword();
    }

    // OrangeHRM's forgot-password URL ends with /auth/requestPasswordResetCode
    await expect(page).toHaveURL(/forgotPassword|requestPasswordResetCode|passwordRecovery|auth\/requestPasswordReset/);

    const heading = page.getByRole('heading', { name: /Reset Password/i });
    await heading.waitFor({ state: 'visible', timeout: 15000 });

    await attachScreenshot(page, '01-forgot-password-landing');

    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  });
});
