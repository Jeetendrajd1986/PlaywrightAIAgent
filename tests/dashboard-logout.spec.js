import { test, expect } from '@playwright/test';
import { seedLogin } from '../Script/seed.spec.js';

const attachScreenshot = async (page, name) => {
  try {
    const buffer = await page.screenshot({
      fullPage: true,
      type: 'png',
    });

    await test.info().attach(name, {
      body: buffer,
      contentType: 'image/png',
    });
  } catch (e) {
    console.error(`Full-page screenshot failed: ${name}`, e);

    try {
      const buffer = await page.screenshot({
        type: 'png',
      });

      await test.info().attach(name, {
        body: buffer,
        contentType: 'image/png',
      });
    } catch (error) {
      console.error(`Viewport screenshot also failed: ${name}`, error);
    }
  }
};

test.describe('Dashboard Logout', () => {

  test.describe.configure({
    timeout: 180000,
  });

  test.beforeEach(async ({ page }) => {
    await seedLogin(page);

    await expect(
      page.locator('.oxd-userdropdown-name')
    ).toBeVisible();

    await attachScreenshot(page, '00-dashboard-loaded');
  });

  test.afterEach(async ({ page }, testInfo) => {
    const safeTitle = testInfo.title
      .replace(/[^a-z0-9]+/gi, '-')
      .toLowerCase();

    await attachScreenshot(
      page,
      `final-${testInfo.status}-${safeTitle}`
    );
  });

  test('Logout from dashboard profile menu', async ({ page }) => {

    // Open user dropdown
    await page.locator('.oxd-userdropdown-name').click();

    await attachScreenshot(
      page,
      '01-user-dropdown-open'
    );

    // Click Logout
    await page
      .locator('a.oxd-userdropdown-link:has-text("Logout")')
      .click();

    // Wait for login page
    await page.waitForURL(
      '**/web/index.php/auth/login',
      {
        timeout: 30000,
        waitUntil: 'domcontentloaded',
      }
    );

    // Verify login page
    await expect(
      page.locator('input[name="username"]')
    ).toBeVisible();

    await expect(
      page.locator('input[name="password"]')
    ).toBeVisible();

    // Capture screenshot
    await attachScreenshot(
      page,
      '02-after-logout-profile-menu'
    );
  });


  test('Dashboard is not accessible after logout', async ({ page }) => {

    // Open user dropdown
    await page.locator('.oxd-userdropdown-name').click();

    // Click Logout
    await page
      .locator('a.oxd-userdropdown-link:has-text("Logout")')
      .click();

    // Wait for login page
    await page.waitForURL(
      '**/web/index.php/auth/login',
      {
        timeout: 30000,
        waitUntil: 'domcontentloaded',
      }
    );

    // Attempt to access dashboard
    await page.goto(
      '/web/index.php/dashboard/index',
      {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      }
    );

    // Application should redirect to login
    await expect(page).toHaveURL(
      /\/web\/index\.php\/auth\/login/
    );

    // Important: wait for actual login UI
    await expect(
      page.locator('input[name="username"]')
    ).toBeVisible();

    await expect(
      page.locator('input[name="password"]')
    ).toBeVisible();

    // Capture screenshot after login page is rendered
    await attachScreenshot(
      page,
      '02-after-logout-dashboard-blocked'
    );
  });
});