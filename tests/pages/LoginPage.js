// spec: none
// Updated login page object
import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    // Robust selectors: support both attribute-based and accessible-name based lookups
    this.usernameInput = page.locator(
      "input[name='username'], input[autocomplete='username'], input[placeholder='Username']"
    ).first();
    this.passwordInput = page.locator(
      "input[name='password'], input[autocomplete='current-password'], input[type='password'], input[placeholder='Password']"
    ).first();
    this.usernameByName = page.locator("input[name='username']");
    this.passwordByName = page.locator("input[name='password']");
    this.loginButton = page.getByRole('button', { name: /Log In|Login/i });
    this.forgotPasswordSelector = 'text=/forgot your password\?/i';
    this.errorMessage = page.locator('.oxd-alert .oxd-alert-content');
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
  }

  async navigate() {
    try {
      await this.page.goto('/web/index.php/auth/login', {
        waitUntil: 'commit',
        timeout: 25000,
      });
    } catch (err) {
      // Try a slightly different strategy if first navigation times out
      try {
        await this.page.goto('/web/index.php/auth/login', {
          waitUntil: 'domcontentloaded',
          timeout: 25000,
        });
      } catch (innerErr) {
        // rethrow the original error to preserve context
        throw err;
      }
    }

    // Wait for the URL to contain '/auth/login' to ensure we are on the login page
    await this.page.waitForURL('/web/index.php/auth/login', { timeout: 20000 });

    // Wait for the login button to be visible as a sign that the form is loaded
    await this.loginButton.waitFor({ state: 'visible', timeout: 60000 });

    // Now wait for the inputs
    await this.usernameInput.waitFor({ state: 'visible', timeout: 60000 });
    await this.passwordInput.waitFor({ state: 'visible', timeout: 60000 });
  }

  async enterUsername(username) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickLogin({ expectedUrl = /dashboard/, timeout = 30000, waitForUrl = true } = {}) {
    await this.loginButton.waitFor({ state: 'visible', timeout: 15000 });
    await expect(this.loginButton).toBeEnabled({ timeout: 15000 });

    await this.loginButton.click();

    if (waitForUrl && expectedUrl) {
      await this.page.waitForURL(expectedUrl, { timeout, waitUntil: 'commit' });
    }
  }

  async clickForgotPassword() {
    const forgot = this.page.getByText(/forgot your password\?/i).first();
    await forgot.waitFor({ state: 'visible', timeout: 20000 });
    await forgot.click();
  }

  async getErrorMessage() {
    const candidates = [
      this.page.getByRole('alert'),
      this.page.locator('.oxd-alert .oxd-alert-content'),
      this.page.locator('.oxd-input-field-error-message'),
      this.page.locator('text=Required'),
      this.page.locator('text=/required/i'),
    ];

    for (const loc of candidates) {
      try {
        const first = loc.first();
        await first.waitFor({ state: 'visible', timeout: 3000 });
        const text = (await first.textContent())?.trim();
        if (text) return text;
      } catch (e) {
        // ignore and try next candidate
      }
    }

    // Fallback: try to read any alert-like content without throwing
    try {
      const anyAlert = this.page.locator('.oxd-alert .oxd-alert-content').first();
      if ((await anyAlert.count()) > 0) return (await anyAlert.textContent())?.trim() ?? '';
    } catch {
      // no-op
    }

    return '';
  }

  async isDashboardDisplayed() {
    return await this.dashboardHeading.isVisible();
  }
}
