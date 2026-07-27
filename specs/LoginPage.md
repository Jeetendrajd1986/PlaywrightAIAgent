# OrangeHRM Login Automation Specification

## Application Overview

# Feature

Automate the OrangeHRM login experience using Playwright Test with a Page Object Model (POM). The specification covers the login form, primary user actions, validation behavior, error handling, and reusable automation patterns for generating pages/LoginPage.js and tests/login.spec.js.

# Business Objective

Enable reliable end-to-end validation of the authentication flow for the OrangeHRM demo site. The automation should confirm that valid users can log in successfully, invalid users receive clear feedback, and core security behaviors remain intact.

# Page Description

The login page is the entry point for OrangeHRM authentication. It presents a simple form with username and password fields, a login button, and a forgot password link. The page is expected to render a form-based authentication experience and transition to the dashboard after successful login.

# UI Elements

| Element Name | Purpose | Recommended Playwright Locator | Alternative Locator | Wait Strategy |
| --- | --- | --- | --- | --- |
| Username Field | Enters the login username | `page.locator('input[name="username"]')` | `page.locator('input[autocomplete="username"]')` | Wait for visibility and enabled state before interaction |
| Password Field | Enters the login password | `page.locator('input[name="password"]')` | `page.locator('input[type="password"]')` | Wait for visibility and enabled state before interaction |
| Login Button | Submits the login form | `page.getByRole('button', { name: 'Login' })` | `page.locator('button[type="submit"]')` | Wait until visible and enabled before clicking |
| Forgot Password Link | Opens the password recovery flow | `page.getByRole('link', { name: /forgot your password/i })` | `page.locator('a').filter({ hasText: 'Forgot your password?' })` | Wait for visibility before clicking |
| Error Message | Displays login failure feedback | `page.getByRole('alert').filter({ hasText: 'Invalid credentials' })` | `page.locator('.oxd-alert-content')` | Wait until the visible alert appears after a failed login attempt |
| Login Heading | Confirms the page is the login screen | `page.getByRole('heading', { name: 'Login' })` | `page.locator('h5')` | Wait for visibility on page load |

# LoginPage Class Design

The page object should encapsulate all selectors and actions related to the OrangeHRM login page.

## Methods

- `navigate()`
  - Opens the login URL and waits for the form to render.
- `enterUsername(username)`
  - Fills the username field with the provided value.
- `enterPassword(password)`
  - Fills the password field with the provided value.
- `clickLogin({ waitForUrl = true })`
  - Clicks the login button and optionally waits for a dashboard redirect. Use `waitForUrl: false` for failed-login validation.
- `clickForgotPassword()`
  - Clicks the forgot password link and verifies the recovery experience is reached.
- `getErrorMessage()`
  - Returns the visible error message text after a failed attempt.
- `isDashboardDisplayed()`
  - Verifies that the dashboard is visible after successful authentication.

### Suggested Class Skeleton

```js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator("input[name='username']");
    this.passwordInput = page.locator("input[name='password']");
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot your password/i });
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
  }

  async navigate() {
    await this.page.goto('/web/index.php/auth/login', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await this.usernameInput.waitFor({ state: 'visible', timeout: 20000 });
    await this.passwordInput.waitFor({ state: 'visible', timeout: 20000 });
  }

  async enterUsername(username) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickLogin({ expectedUrl = /dashboard/, timeout = 15000, waitForUrl = true } = {}) {
    if (waitForUrl && expectedUrl) {
      await Promise.all([
        this.page.waitForURL(expectedUrl, { timeout }),
        this.loginButton.click(),
      ]);
      return;
    }
    await this.loginButton.click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async getErrorMessage() {
    const alertLocator = this.page.getByRole('alert').filter({ hasText: 'Invalid credentials' });
    await alertLocator.waitFor({ state: 'visible', timeout: 10000 });
    return (await alertLocator.textContent())?.trim() ?? '';
  }

  async isDashboardDisplayed() {
    return await this.dashboardHeading.isVisible();
  }
}
```

# Positive Test Scenarios

1. Successful login with valid credentials
   - Navigate to the login page.
   - Enter valid username and password.
   - Click Login.
   - Expect the dashboard to load.

2. Successful login from a fresh browser session
   - Open the application in a new browser context.
   - Complete the login flow.
   - Verify the dashboard is visible and the user remains authenticated.

3. Forgot password navigation
   - Click the forgot password link.
   - Verify the password recovery page is displayed.

# Negative Test Scenarios

1. Invalid username and password
   - Attempt login with an incorrect password.
   - Expect an error message and no dashboard redirect.

2. Empty username or password
   - Submit the form without entering values.
   - Expect the form to remain on the login page and validation feedback to be shown if the app exposes it.

3. Unknown username
   - Use a non-existent username.
   - Expect a generic authentication failure message and no access to the dashboard.

# Boundary Test Scenarios

1. Very long username and password values
   - Enter strings above the expected size limit.
   - Expect the application to handle them gracefully without crashing.

2. Whitespace-only values
   - Enter spaces or tabs in the input fields.
   - Expect the form to reject the attempt or show an appropriate validation message.

3. Leading and trailing whitespace in credentials
   - Verify that the login flow behaves consistently and does not produce false positives.

# Security Test Scenarios

1. Password masking
   - Confirm the password field is masked and the entered value is not displayed in plain text.


# Validation Points

- The login page loads successfully at the target URL.
- Username and password inputs are visible and enabled.
- The login button is visible and clickable.
- A successful login redirects to the dashboard.
- A failed login shows an error message and keeps the user on the login page.
- The forgot password link navigates to the recovery experience.
- The URL changes appropriately between login and dashboard states.

# Test Data

| Scenario | Username | Password | Expected Result |
| --- | --- | --- | --- |
| Valid login | `Admin` | `admin123` | Dashboard is displayed |
| Invalid password | `Admin` | `wrongPassword` | Error message shown |
| Empty credentials | `` | `` | Form remains on login page |
| Unknown user | `notARealUser` | `admin123` | Error message shown |
| Boundary input | Long string value | Long string value | Graceful handling without crash |

# Reusable Components

- `LoginPage` class for all login-related selectors and actions.
- `testData` constants for valid and invalid credentials.
- Helper methods for waiting on page state transitions.
- Optional `BasePage` class for shared navigation and assertion helpers if the suite grows.

# Expected Folder Structure

```text
pages/
  LoginPage.js
tests/
  login.spec.js
test-data/
  login.data.js
```

# How to Run

Use the configured Playwright projects for each environment:

```bash
npx playwright test --project=ua-chromium
npx playwright test --project=prod-chromium
```

Run both environments at once:

```bash
npx playwright test
```

## Test Scenarios

### 1. OrangeHRM Login Automation

**Seed:** `tests/seed.spec.js`

#### 1.1. Create automation specification

**File:** `tests/login.spec.js`

**Steps:**
  1. Document the Page Object Model design for the OrangeHRM login page.
    - expect: The specification includes UI element locators, page object methods, and test scenarios for implementation.
