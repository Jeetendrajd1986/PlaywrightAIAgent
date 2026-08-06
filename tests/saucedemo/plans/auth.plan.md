# Authentication Test Plan

## Application Overview

Login flow for Sauce Labs demo (https://www.saucedemo.com) on **Pixel 7 (Mobile Chrome)** viewport. Covers valid login, validation errors for missing/invalid credentials, session logout, and form hint visibility.

**Target project:** `Mobile Chrome (Pixel 7)` defined in `playwright.config.js`.
**Valid credentials:** `standard_user` / `secret_sauce`.

## Test Scenarios

### 1. Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1 Login with valid credentials (happy path)

**File:** `tests/saucedemo/auth.spec.js`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Page loads with login form.
  2. Enter standard_user in the Username field
  3. Enter secret_sauce in the Password field
  4. Tap the Login button
    - expect: URL changes to https://www.saucedemo.com/inventory.html.
  5. Verify Open Menu (hamburger) button is visible.
  6. Verify product list title and at least one product card are visible.

#### 1.2 Login with empty username and password

**File:** `tests/saucedemo/auth.spec.js`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Leave Username field empty
  3. Leave Password field empty
  4. Tap the Login button
    - expect: Error message "Username is required" is displayed.

#### 1.3 Login with missing password

**File:** `tests/saucedemo/auth.spec.js`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter standard_user in Username
  3. Leave Password empty
  4. Tap Login button
    - expect: Error message "Password is required" is displayed.

#### 1.4 Login attempt with locked_out_user

**File:** `tests/saucedemo/auth.spec.js`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter locked_out_user in Username
  3. Enter secret_sauce in Password
  4. Tap Login button
    - expect: Error message containing "locked out" is displayed; URL remains on login page.

#### 1.5 Login with invalid credentials

**File:** `tests/saucedemo/auth.spec.js`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter invalid_user in Username
  3. Enter wrong_password in Password
  4. Tap Login button
    - expect: Error message containing "do not match" or "Epic sadface" is displayed.

#### 1.6 Login then logout via menu

**File:** `tests/saucedemo/auth.spec.js`

**Steps:**
  1. Log in successfully as standard_user / secret_sauce.
  2. Tap the Open Menu (hamburger) button.
  3. Tap the Logout link in the drawer.
    - expect: User is redirected back to https://www.saucedemo.com/ and login form is shown.

#### 1.7 Login form lists accepted usernames and password

**File:** `tests/saucedemo/auth.spec.js`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: All 6 usernames (standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, visual_user) and password text "secret_sauce" are visible.