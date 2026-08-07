# Mobile UX Test Plan

## Application Overview

Mobile-specific UX checks for Sauce Labs demo (https://www.saucedemo.com) on **Pixel 7 (Mobile Chrome)** viewport. These scenarios are documented for manual verification since they validate visual / device-specific behavior that is difficult to assert reliably via Playwright locators.

**Target project:** `Mobile Chrome (Pixel 7)` defined in `playwright.config.js`.
**Valid credentials:** `standard_user` / `secret_sauce`.

## Test Scenarios

### 6. Mobile UX

**Seed:** `tests/seed.spec.js`

_(Note: Mobile-UX scenarios were not generated as automated tests; they are documented here for manual verification and may be addressed via Playwright's accessibility audits in the future.)_

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