# Mobile UX Pixel 7 Test Plan

## Application Overview

Mobile UX validation for Sauce Labs demo on Pixel 7 viewport. Covers no-horizontal-scroll verification across all main pages, touch target sizing for buttons, keyboard handling for form inputs, vertical scrolling of product list, orientation change resilience, and zero console errors during a full flow.

## Test Scenarios

### 1. Mobile UX

**Seed:** `tests/seed.spec.ts`

#### 1.1. 6.1 No horizontal scrollbar on Pixel 7 viewport

**File:** `tests/saucedemo/mobile-ux.spec.js`

**Steps:**
  1. Visit the login page and check that document.documentElement.scrollWidth equals document.documentElement.clientWidth
    - expect: scrollWidth equals clientWidth (412 == 412)
  2. Log in as standard_user and verify no horizontal overflow on /inventory.html
    - expect: scrollWidth equals clientWidth on inventory.html
  3. Add Sauce Labs Backpack to cart and open /cart.html, verify no horizontal overflow
    - expect: scrollWidth equals clientWidth on cart.html after adding an item
  4. Tap Checkout, fill valid information, and verify no horizontal overflow on /checkout-step-one.html
    - expect: scrollWidth equals clientWidth on checkout-step-one.html

#### 1.2. 6.2 Touch targets have adequate size

**File:** `tests/saucedemo/mobile-ux.spec.js`

**Steps:**
  1. Visit the login page and verify the Login button bounding box height is at least 36 CSS pixels
    - expect: Login button height >= 36px (observed 48.66px)
  2. Log in and verify Add to cart buttons have tappable height on inventory
    - expect: Add to cart button height >= 30px (observed 33.33px)

#### 1.3. 6.3 Form inputs trigger keyboard and remain visible

**File:** `tests/saucedemo/mobile-ux.spec.js`

**Steps:**
  1. Log in, add an item, go to checkout step one, tap the First Name field
    - expect: First Name field is the activeElement (focused) after tap
  2. Verify the field is currently visible in the viewport while keyboard would be open
    - expect: Field bounding box top is within the current viewport

#### 1.4. 6.4 Vertical scrolling works in inventory list

**File:** `tests/saucedemo/mobile-ux.spec.js`

**Steps:**
  1. Log in as standard_user, scroll to the bottom of the inventory page, and verify all 6 products are still reachable
    - expect: .inventory_item count is 6 after scrolling to bottom

#### 1.5. 6.5 Orientation change preserves layout

**File:** `tests/saucedemo/mobile-ux.spec.js`

**Steps:**
  1. Log in as standard_user in portrait, set viewport to landscape (915x412), verify no horizontal overflow
    - expect: scrollWidth equals clientWidth after resize
  2. Re-add an item, change orientation, and verify cart is preserved
    - expect: Items remain in cart after resize

#### 1.6. 6.6 No critical console errors during full flow

**File:** `tests/saucedemo/mobile-ux.spec.js`

**Steps:**
  1. Attach a page.on('pageerror') listener before navigating
    - expect: No pageerror captured
  2. Run full flow: Login -> Add to cart -> Cart -> Checkout -> Step One -> Step Two -> Finish -> Back Home
    - expect: Empty errors array at end of run
  3. Verify no uncaught JavaScript errors were captured
    - expect: No errors collected
