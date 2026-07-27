import { test, expect } from '@playwright/test';
import { seedLogin } from '../Script/seed.spec.js';

const attachScreenshot = async (page, name) => {
  try {
    const buffer = await page.screenshot({ fullPage: true, type: 'png' });
    await test.info().attach(name, {
      body: buffer,
      contentType: 'image/png',
    });
  } catch (e) {
    // Fall back to viewport-only screenshot
    try {
      const buffer = await page.screenshot({ type: 'png' });
      await test.info().attach(name, {
        body: buffer,
        contentType: 'image/png',
      });
    } catch {
      // swallow - the test result still reflects the failure
    }
  }
};

test.describe('Dashboard Logout', () => {
  test.describe.configure({ timeout: 180000 });
  test.beforeEach(async ({ page }) => {
    test.setTimeout(180000);
    await seedLogin(page);
    await attachScreenshot(page, '00-dashboard-loaded');
  });

  // Always attach a final screenshot for any test status
  test.afterEach(async ({ page }, testInfo) => {
    const safeTitle = testInfo.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    await attachScreenshot(page, `final-${testInfo.status}-${safeTitle}`);
  });

  test('Logout from dashboard profile menu', async ({ page }) => {
    // Open the user dropdown from the dashboard topbar
    await page.locator('.oxd-userdropdown-name').click();
    await attachScreenshot(page, '01-user-dropdown-open');

    // Click the Logout action
    await page.locator('a.oxd-userdropdown-link:has-text("Logout")').click();

    // Wait for the login page to finish loading
    await page.waitForURL('/web/index.php/auth/login', { timeout: 30000, waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded');

    // Verify login page is visible after logout
    await expect(page.locator("input[name='username']")).toBeVisible({ timeout: 30000 });
    await expect(page.locator("input[name='password']")).toBeVisible({ timeout: 30000 });

    await attachScreenshot(page, '02-after-logout-profile-menu');
  });

  test('Dashboard is not accessible after logout', async ({ page }) => {
    await page.locator('.oxd-userdropdown-name').click();
    await page.locator('a.oxd-userdropdown-link:has-text("Logout")').click();

    // Wait for the login page to finish loading
    await page.waitForURL('/web/index.php/auth/login', { timeout: 30000, waitUntil: 'commit' });
    await page.waitForLoadState('domcontentloaded');

    // After logout, attempt to navigate back to the dashboard
    await page.goto('/web/index.php/dashboard/index', { waitUntil: 'commit', timeout: 30000 });
    await expect(page).toHaveURL(/auth\/login/);

    await attachScreenshot(page, '02-after-logout-dashboard-blocked');
  });
});
