# Product Details Test Plan

## Application Overview

Product detail page tests for Sauce Labs demo (https://www.saucedemo.com) on **Pixel 7 (Mobile Chrome)** viewport. Covers opening product details via title and image, back navigation, and add/remove cart actions from the detail page.

**Target project:** `Mobile Chrome (Pixel 7)` defined in `playwright.config.js`.
**Valid credentials:** `standard_user` / `secret_sauce`.

## Test Scenarios

### 3. Product Details

**Seed:** `tests/seed.spec.js`

#### 3.1 Open product detail by clicking title

**File:** `tests/saucedemo/product-details.spec.js`

**Steps:**
  1. Log in as standard_user.
  2. Tap "Sauce Labs Backpack" title.
    - expect: URL is /inventory-item.html?id=4.
  3. Verify detail page shows image, name, description, price, and Add to cart button.

#### 3.2 Open product detail by clicking image

**File:** `tests/saucedemo/product-details.spec.js`

**Steps:**
  1. Log in as standard_user.
  2. Tap the image for Sauce Labs Backpack.
    - expect: /inventory-item.html?id=4 detail page is reached.

#### 3.3 Back to products button

**File:** `tests/saucedemo/product-details.spec.js`

**Steps:**
  1. Log in and open Backpack detail.
  2. Tap "Back to products".
    - expect: User returns to /inventory.html with the full product list.

#### 3.4 Add product to cart from detail page

**File:** `tests/saucedemo/product-details.spec.js`

**Steps:**
  1. Log in and navigate to Backpack detail.
  2. Tap "Add to cart".
    - expect: Button changes to "Remove" and cart badge displays "1".

#### 3.5 Remove product from cart via detail page

**File:** `tests/saucedemo/product-details.spec.js`

**Steps:**
  1. Log in, add Backpack from detail page.
  2. Tap "Remove".
    - expect: Button reverts to "Add to cart" and cart badge disappears.