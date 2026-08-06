# Sauce Demo Mobile UX (Pixel 7) Test Specification

## Application Overview

The mobile-ux test scenarios require a `.spec.js` file but the planner tool does not write JS test files. The code below should be saved as `tests/saucedemo/mobile-ux.spec.js`.

## Test Scenarios

### 1. Mobile UX

**Seed:** `tests/seed.spec.ts`

#### 1.1. Mobile UX tests on Pixel 7 viewport

**File:** `tests/saucedemo/mobile-ux.spec.js`

**Steps:**
  1. Review the JavaScript code block below and save it to the file
    - expect: File saved to tests/saucedemo/mobile-ux.spec.js with 6 tests covering 6.1-6.6
  2. Run the spec with: npx playwright test --project="Mobile Chrome (Pixel 7)" tests/saucedemo/mobile-ux.spec.js
    - expect: All tests must pass against Mobile Chrome (Pixel 7) project
