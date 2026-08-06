# Cart Test Plan

## Application Overview

Cart page tests for Sauce Labs demo (https://www.saucedemo.com) on **Pixel 7 (Mobile Chrome)** viewport. Covers adding/removing items, badge persistence, empty cart state, continue shopping, and checkout button accessibility.

**Target project:** `Mobile Chrome (Pixel 7)` defined in `playwright.config.js`.
**Valid credentials:** `standard_user` / `secret_sauce`.

## Test Scenarios

### 4. Cart

**Seed:** `tests/seed.spec.ts`

#### 4.1 Add multiple products to cart from inventory

**File:** `tests/saucedemo/cart.spec.js`

**Steps:**
  1. Log in as standard_user.
  2. Add Sauce Labs Backpack ($29.99).
  3. Add Sauce Labs Bike Light ($9.99).
    - expect: Cart badge shows "2"; both buttons change to "Remove".

#### 4.2 Add/Remove toggles cart badge correctly

**File:** `tests/saucedemo/cart.spec.js`

**Steps:**
  1. Log in as standard_user.
  2. Add Backpack (badge=1), add Bike Light (badge=2).
  3. Remove Backpack (badge=1).
  4. Remove Bike Light (badge hidden).

#### 4.3 Open cart page via cart icon

**File:** `tests/saucedemo/cart.spec.js`

**Steps:**
  1. Log in and add Backpack.
  2. Tap shopping cart icon.
    - expect: URL is /cart.html; "Your Cart" title is shown; the added item is listed.

#### 4.4 Empty cart state in cart page

**File:** `tests/saucedemo/cart.spec.js`

**Steps:**
  1. Log in as standard_user.
  2. Navigate directly to /cart.html.
    - expect: No product items displayed; Continue Shopping and Checkout buttons remain visible.

#### 4.5 Remove item from cart page

**File:** `tests/saucedemo/cart.spec.js`

**Steps:**
  1. Log in and add 2 items.
  2. Go to cart.
  3. Tap Remove next to Bike Light.
    - expect: Cart contains only Backpack; cart badge shows "1".

#### 4.6 Continue Shopping returns to inventory

**File:** `tests/saucedemo/cart.spec.js`

**Steps:**
  1. Log in and add at least one item.
  2. Open cart.
  3. Tap "Continue Shopping".
    - expect: User returns to /inventory.html and items remain in cart.

#### 4.7 Checkout button accessible from cart page

**File:** `tests/saucedemo/cart.spec.js`

**Steps:**
  1. Log in and add one item.
  2. Open cart.
    - expect: Checkout button is present and enabled.

#### 4.8 Cart badge persists across navigation

**File:** `tests/saucedemo/cart.spec.js`

**Steps:**
  1. Log in and add 2 items.
  2. Navigate: inventory -> product detail -> back -> cart -> continue shopping -> product detail.
    - expect: Cart badge always shows "2".