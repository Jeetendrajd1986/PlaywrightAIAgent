# OrangeHRM Login Page Object Model

## Application Overview

OrangeHRM login Page Object Model with reusable selectors and a sample Playwright test.

## Test Scenarios

### 1. OrangeHRM Login POM

**Seed:** `tests/seed.spec.js`

#### 1.1. Login page object example

**File:** `specs/orangehrm-login-pom.md`

**Steps:**
  1. Define a LoginPage class with selectors for the username field, password field, login button, and optional error message.
    - expect: The page object exposes methods to open the login page, verify that the form is visible, and submit credentials.
  2. Use the page object in a Playwright test with the OrangeHRM demo credentials.
    - expect: The test navigates to the dashboard after a successful login.
