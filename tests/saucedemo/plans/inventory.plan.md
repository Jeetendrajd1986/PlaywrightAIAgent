# Inventory Test Plan

## Application Overview

Inventory page tests for Sauce Labs demo (https://www.saucedemo.com) on **Pixel 7 (Mobile Chrome)** viewport. Covers default state, sort filters (A-Z, Z-A, price low-high, price high-low), hamburger menu drawer interactions, and footer social media links.

**Target project:** `Mobile Chrome (Pixel 7)` defined in `playwright.config.js`.
**Valid credentials:** `standard_user` / `secret_sauce`.

## Test Scenarios

### 2. Inventory

**Seed:** `tests/seed.spec.ts`

#### 2.1 Inventory page default state after login

**File:** `tests/saucedemo/inventory.spec.js`

**Steps:**
  1. Log in successfully as standard_user.
    - expect: URL is /inventory.html.
  2. Verify all 6 products listed.
  3. Verify cart badge is not displayed.
  4. Verify footer social links (Twitter, Facebook, LinkedIn) and copyright text are visible.

#### 2.2 Sort products by Name (A to Z) - default

**File:** `tests/saucedemo/inventory.spec.js`

**Steps:**
  1. Log in as standard_user.
    - expect: First product is "Sauce Labs Backpack".

#### 2.3 Sort products by Name (Z to A)

**File:** `tests/saucedemo/inventory.spec.js`

**Steps:**
  1. Log in as standard_user.
  2. Select "Name (Z to A)" from the Sort dropdown.
    - expect: First product is "Test.allTheThings() T-Shirt (Red)".

#### 2.4 Sort products by Price (low to high)

**File:** `tests/saucedemo/inventory.spec.js`

**Steps:**
  1. Log in as standard_user.
  2. Select "Price (low to high)" from the Sort dropdown.
    - expect: First product is Sauce Labs Onesie ($7.99); last is Sauce Labs Fleece Jacket ($49.99).

#### 2.5 Sort products by Price (high to low)

**File:** `tests/saucedemo/inventory.spec.js`

**Steps:**
  1. Log in as standard_user.
  2. Select "Price (high to low)" from the Sort dropdown.
    - expect: First product is Sauce Labs Fleece Jacket ($49.99).

#### 2.6 Hamburger menu opens and closes

**File:** `tests/saucedemo/inventory.spec.js`

**Steps:**
  1. Log in as standard_user.
  2. Tap Open Menu.
    - expect: All Items, About, Logout, Reset App State links are visible.
  3. Tap Close Menu.
    - expect: Drawer is dismissed.

#### 2.7 About link navigates to saucelabs.com

**File:** _(not generated)_

**Steps:**
  1. Log in as standard_user.
  2. Open hamburger menu.
  3. Tap "About" link.
    - expect: Browser navigates to https://saucelabs.com/.

#### 2.8 Reset App State clears cart

**File:** `tests/saucedemo/inventory.spec.js`

**Steps:**
  1. Log in as standard_user.
  2. Add 2 products to cart.
    - expect: Cart badge shows "2".
  3. Open hamburger menu.
  4. Tap "Reset App State".
    - expect: Cart badge disappears and all Add to cart buttons re-appear.

#### 2.9 All Items link navigates back to inventory

**File:** _(not generated)_

**Steps:**
  1. Log in as standard_user.
  2. Tap a product title to go to its detail page.
  3. Open hamburger menu.
  4. Tap "All Items".
    - expect: URL is /inventory.html.

#### 2.10 Footer social media links

**File:** `tests/saucedemo/inventory.spec.js`

**Steps:**
  1. Log in as standard_user.
    - expect: Twitter, Facebook, LinkedIn links have correct href targets.