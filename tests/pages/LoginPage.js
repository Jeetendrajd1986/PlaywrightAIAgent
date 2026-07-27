// spec: none
// Updated Login Page Object

import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;

    // Login page locators
    this.usernameInput = page.locator(
      "input[name='username'], input[autocomplete='username'], input[placeholder='Username']"
    ).first();

    this.passwordInput = page.locator(
      "input[name='password'], input[autocomplete='current-password'], input[type='password'], input[placeholder='Password']"
    ).first();

    // Optional direct name-based locators
    this.usernameByName = page.locator("input[name='username']");
    this.passwordByName = page.locator("input[name='password']");

    // OrangeHRM Login button
    this.loginButton = page.getByRole('button',
       {
      name: 'Login',
        });

    // Forgot password
    this.forgotPassword = page.getByText(
      /forgot your password\?/i
    ).first();

    // Error message
    this.errorMessage = page.locator(
      '.oxd-alert .oxd-alert-content'
    );

    // Dashboard
    this.dashboardHeading = page.getByRole('heading', {
      name: 'Dashboard',
    });
  }

  /**
   * Navigate to Login Page
   */
  async navigate() {
    await this.page.goto('/web/index.php/auth/login', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    // Playwright automatically waits for these elements.
    // No need for locator.waitFor() with 60-second timeout.
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Enter username
   * @param {string} username
   */
  async enterUsername(username) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
  }

  /**
   * Enter password
   * @param {string} password
   */
  async enterPassword(password) {
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
  }

  /**
   * Click Login button
   *
   * @param {{
   *   expectedUrl?: RegExp,
   *   timeout?: number,
   *   waitForUrl?: boolean
   * }} options
   */
  async clickLogin({
    expectedUrl = /dashboard/,
    timeout = 30000,
    waitForUrl = true,
  } = {}) {
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();

    if (waitForUrl && expectedUrl) {
      await Promise.all([
        this.page.waitForURL(expectedUrl, {
          timeout,
          waitUntil: 'commit',
        }),
        this.loginButton.click(),
      ]);
    } else {
      await this.loginButton.click();
    }
  }

  /**
   * Click Forgot Password
   */
  async clickForgotPassword() {
    await expect(this.forgotPassword).toBeVisible();
    await this.forgotPassword.click();
  }

  /**
   * Get login error message
   *
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    const candidates = [
      this.page.getByRole('alert'),
      this.page.locator('.oxd-alert .oxd-alert-content'),
      this.page.locator('.oxd-input-field-error-message'),
      this.page.getByText('Required'),
      this.page.getByText(/required/i),
    ];

    for (const locator of candidates) {
      try {
        const first = locator.first();

        await expect(first).toBeVisible({
          timeout: 3000,
        });

        const text = (
          await first.textContent()
        )?.trim();

        if (text) {
          return text;
        }
      } catch {
        // Try next candidate
      }
    }

    return '';
  }

  /**
   * Check if Dashboard is displayed
   *
   * @returns {Promise<boolean>}
   */
  async isDashboardDisplayed() {
    return await this.dashboardHeading.isVisible();
  }
}