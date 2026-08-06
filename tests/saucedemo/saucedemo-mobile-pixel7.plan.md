# Sauce Demo Mobile (Pixel 7) Test Plan

## Application Overview

The Sauce Labs "Swag Labs" demo e-commerce application (https://www.saucedemo.com) tested on a **Pixel 7 (Mobile Chrome)** viewport. It supports user authentication, product browsing with sort filtering, product detail viewing, cart management, multi-step checkout (information, overview, completion), order confirmation, and session controls (logout, reset app state). The mobile UI presents a hamburger menu, vertically stacked product cards, and responsive forms for the checkout flow.

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

### 3. Product Details

**Seed:** `tests/seed.spec.ts`

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

### 5. Checkout

**Seed:** `tests/seed.spec.ts`

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

### 6. Mobile UX

**Seed:** `tests/seed.spec.ts`

_(Note: Mobile-UX scenarios were not generated as automated tests; they are documented for manual verification.)_

#### 6.1 No horizontal scrollbar on Pixel 7 viewport

**Steps:**
  1. Visit login page.
    - expect: Page width fits within viewport with no horizontal scroll.
  2. Repeat verification on inventory, cart, and checkout-step-one.

#### 6.2 Touch targets have adequate size

**Steps:**
  1. Visit login page.
    - expect: Login button has tap-friendly height (>= 36-40 CSS px).
  2. Visit inventory and verify Add to cart buttons are comfortably tappable.

#### 6.3 Form inputs trigger keyboard and remain visible

**Steps:**
  1. Log in and open checkout step one.
  2. Tap First Name field.
    - expect: Soft keyboard opens and the field stays in view.

#### 6.4 Vertical scrolling works in inventory list

**Steps:**
  1. Log in as standard_user.
  2. Swipe up on the product list.
    - expect: All 6 products are reachable via vertical scroll.

#### 6.5 Orientation change preserves layout

**Steps:**
  1. Log in and view the inventory in portrait.
  2. Rotate to landscape.
    - expect: Page reflows without horizontal overflow; cart badge count is preserved.

#### 6.6 No critical console errors during flow

**Steps:**
  1. Run a full flow: Login -> Inventory -> Add -> Cart -> Checkout -> Finish -> Back Home.
    - expect: No uncaught JavaScript errors and no 404/500 network responses for own assets.

## Summary

| Suite | Total Scenarios | Generated as Tests |
|---|---|---|
| 1. Authentication | 7 | 7 |
| 2. Inventory | 10 | 7 (2.7, 2.9 not generated) |
| 3. Product Details | 5 | 5 |
| 4. Cart | 8 | 8 |
| 5. Checkout | 10 | 9 (5.9 not generated) |
| 6. Mobile UX | 6 | 0 (manual verification) |
| **Total** | **46** | **36** |