import { expect } from '@playwright/test';
import { LoginPage } from '../tests/pages/LoginPage.js';
import { loginData } from '../tests/test-data/login.data.js';

export async function seedLogin(page) {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await loginPage.enterUsername(loginData.valid.username);
  await loginPage.enterPassword(loginData.valid.password);

  await loginPage.clickLogin({ waitForUrl: true, timeout: 60000 });
  await expect(loginPage.dashboardHeading).toBeVisible({ timeout: 60000 });
}
