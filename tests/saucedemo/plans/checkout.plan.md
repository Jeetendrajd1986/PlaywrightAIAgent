# Checkout Test Plan

## Application Overview

Checkout flow tests for Sauce Labs demo (https://www.saucedemo.com) on **Pixel 7 (Mobile Chrome)** viewport. Covers step-one information validation, step-two overview totals, cancellation, order completion, and end-to-end happy path.

**Target project:** `Mobile Chrome (Pixel 7)` defined in `playwright.config.js`.
**Valid credentials:** `standard_user` / `secret_sauce`.

## Test Scenarios

### 5. Checkout

**Seed:** `tests/seed.spec.js`

#### 5.1 Checkout step one - valid information

**File:** `tests/saucedemo/checkout.spec.js`

**Steps:**
  1. Log in, add Backpack.
  2. Open cart, tap Checkout.
    - expect: URL is /checkout-step-one.html.
  3. Fill First Name "John", Last Name "Doe", Zip "12345".
  4. Tap Continue.
    - expect: URL is /checkout-step-two.html.

#### 5.2 Missing First Name shows validation error

**File:** `tests/saucedemo/checkout.spec.js`

**Steps:**
  1. Log in, add product, proceed to checkout step one.
  2. Leave First Name empty.
  3. Enter Last Name "Doe", Zip "12345".
  4. Tap Continue.
    - expect: Error "First Name is required" is displayed.

#### 5.3 Missing Last Name shows validation error

**File:** `tests/saucedemo/checkout.spec.js`

**Steps:**
  1. Log in, add product, proceed to checkout step one.
  2. Enter First Name "John", Zip "12345".
  3. Leave Last Name empty.
  4. Tap Continue.
    - expect: Error "Last Name is required" is displayed.

#### 5.4 Missing Zip/Postal Code shows validation error

**File:** `tests/saucedemo/checkout.spec.js`

**Steps:**
  1. Log in, add product, proceed to checkout step one.
  2. Enter First Name "John", Last Name "Doe".
  3. Leave Zip empty.
  4. Tap Continue.
    - expect: Error "Postal Code is required" is displayed.

#### 5.5 Cancel from step one returns to cart

**File:** `tests/saucedemo/checkout.spec.js`

**Steps:**
  1. Log in, add product, proceed to checkout step one.
  2. Tap "Cancel".
    - expect: User returns to /cart.html; items remain in cart.

#### 5.6 Checkout overview shows totals

**File:** `tests/saucedemo/checkout.spec.js`

**Steps:**
  1. Log in, add Backpack, proceed through step one with valid info.
    - expect: Item total $29.99, Tax $2.40, Total $32.39; Payment Information "SauceCard #31337"; Shipping Information "Free Pony Express Delivery!".

#### 5.7 Cancel from overview returns to inventory

**File:** `tests/saucedemo/checkout.spec.js`

**Steps:**
  1. Log in, add product, reach checkout step two.
  2. Tap "Cancel".
    - expect: User returns to /inventory.html; items remain in cart.

#### 5.8 Complete order shows confirmation page

**File:** `tests/saucedemo/checkout.spec.js`

**Steps:**
  1. Log in, add Backpack, reach checkout step two.
  2. Tap "Finish".
    - expect: URL is /checkout-complete.html; "Thank you for your order!" is visible.

#### 5.9 Back Home returns to inventory after completion

**File:** _(not generated)_

**Steps:**
  1. Complete an order.
  2. Tap "Back Home".
    - expect: User is redirected back to /inventory.html.

#### 5.10 End-to-end purchase flow (happy path)

**File:** `tests/saucedemo/checkout.spec.js`

**Steps:**
  1. Log in as standard_user.
  2. Sort by Price (low to high).
  3. Add Sauce Labs Onesie ($7.99) and Sauce Labs Bike Light ($9.99).
  4. Open cart and verify both items are listed.
  5. Tap Checkout.
  6. Fill First Name "Jane", Last Name "Smith", Zip "90210".
  7. Tap Continue, then Finish.
    - expect: Checkout complete page shows "Thank you for your order!".