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
    const gotoOptions = {
      waitUntil: 'load',
      timeout: 120000,
    };

    const maxAttempts = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        await this.page.goto('/web/index.php/auth/login', gotoOptions);
        lastError = undefined;
        break;
      } catch (error) {
        lastError = error;

        if (attempt >= maxAttempts || !this.isTransientNetworkError(error)) {
          throw error;
        }

        // Wait briefly before retrying on transient network errors
        await this.page.waitForTimeout(1500 * attempt);
      }
    }

    if (lastError) {
      throw lastError;
    }

    // The login form fields can be hidden behind an iframe or a slow loader.
    // Wait briefly for the page DOM to settle before checking visibility.
    await this.page.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await expect(this.usernameInput).toBeVisible({ timeout: 60000 });
    await expect(this.passwordInput).toBeVisible({ timeout: 60000 });
    await expect(this.loginButton).toBeVisible({ timeout: 60000 });
  }

  /**
   * Detect transient network errors that are worth retrying.
   *
   * @param {unknown} error
   * @returns {boolean}
   */
  isTransientNetworkError(error) {
    if (!error) return false;
    const message = String(error.message || error);
    return /ERR_CONNECTION_RESET|ERR_CONNECTION_CLOSED|ERR_CONNECTION_TIMED_OUT|ERR_CONNECTION_REFUSED|ERR_NETWORK_CHANGED|ERR_INTERNET_DISCONNECTED|ERR_NAME_NOT_RESOLVED|ERR_EMPTY_RESPONSE|ERR_ABORTED|ERR_FAILED|navigation timeout|TimeoutError/i.test(
      message
    );
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
      this.page.locator('.oxd-alert-content-text'),
      this.page.locator('.oxd-alert-content-text'),
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