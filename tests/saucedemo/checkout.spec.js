// spec: specs/saucedemo-mobile-pixel7.plan.md
// seed: tests/seed.spec.js

const { test, expect } = require('@playwright/test');

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any leftover state from previous tests
    await page.context().clearCookies();
    await page.evaluate(() => {
      try { window.sessionStorage.clear(); } catch {}
      try { window.localStorage.clear(); } catch {}
    });
    // Login as standard_user and reset app state to ensure a clean cart
    await page.goto('https://www.saucedemo.com/');


    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html$/);
    // Reset the app state to guarantee a clean cart
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('link', { name: 'Reset App State' }).click();
    // Close the menu so it does not intercept pointer events
    await page.getByRole('button', { name: 'Close Menu' }).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  // Additionally, navigate to cart and ensure it is empty
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  // Return to inventory page for subsequent steps
  await page.locator('[data-test="continue-shopping"]').click();
  await expect(page).toHaveURL(/inventory\.html$/);
  }); 

  // Helper to add the Sauce Labs Backpack and navigate to the cart, ready for checkout
  async function addBackpackAndOpenCart(page) {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/cart\.html$/);
  }

  test('5.1 Checkout step one - valid information', async ({ page }) => {
    // 1. Log in (handled by beforeEach), add Backpack
    // 2. Open cart, tap Checkout
    await addBackpackAndOpenCart(page);
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    // 3. Fill First Name 'John', Last Name 'Doe', Zip '12345'
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    // 4. Tap Continue
    await page.locator('[data-test="continue"]').click();
    // expect: URL is /checkout-step-two.html
    await expect(page).toHaveURL(/checkout-step-two\.html$/);
  });

  test('5.2 Missing First Name shows validation error', async ({ page }) => {
    // 1. Log in, add product, proceed to checkout step one
    await addBackpackAndOpenCart(page);
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    // 2. Leave First Name empty
    // 3. Enter Last Name 'Doe', Zip '12345'
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    // 4. Tap Continue
    await page.locator('[data-test="continue"]').click();
    // 5. Verify error 'First Name is required'
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  test('5.3 Missing Last Name shows validation error', async ({ page }) => {
    await addBackpackAndOpenCart(page);
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
  });

  test('5.4 Missing Zip shows validation error', async ({ page }) => {
    await addBackpackAndOpenCart(page);
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
  });

  test('5.5 Cancel from step one returns to cart', async ({ page }) => {
    // 1. Log in, add product, proceed to checkout step one
    await addBackpackAndOpenCart(page);
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/checkout-step-one\.html$/);
    // 2. Tap 'Cancel'
    await page.locator('[data-test="cancel"]').click();
    // 3. Verify returns to /cart.html
    await expect(page).toHaveURL(/cart\.html$/);
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  test('5.6 Checkout overview shows totals', async ({ page }) => {
    // 1. Log in, add Backpack, proceed through step one
    await addBackpackAndOpenCart(page);
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html$/);
    // 2. Verify Item total $29.99, Tax $2.40, Total $32.39
    await expect(page.locator('[data-test="subtotal-label"]')).toContainText('29.99');
    await expect(page.locator('[data-test="tax-label"]')).toContainText('2.40');
    await expect(page.locator('[data-test="total-label"]')).toContainText('32.39');
    await expect(page.locator('[data-test="payment-info-value"]')).toContainText('SauceCard');
    await expect(page.locator('[data-test="shipping-info-value"]')).toContainText('Free Pony Express Delivery');
  });

  test('5.7 Cancel from overview returns to inventory', async ({ page }) => {
    // 1. Log in, add product, reach checkout step two
    await addBackpackAndOpenCart(page);
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html$/);
    // 2. Tap 'Cancel'
    await page.locator('[data-test="cancel"]').click();
    // 3. Verify returns to /inventory.html
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('5.8 Complete order shows confirmation', async ({ page }) => {
    // 1. Log in, add Backpack, reach checkout step two
    await addBackpackAndOpenCart(page);
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-two\.html$/);
    // 2. Tap 'Finish'
    await page.locator('[data-test="finish"]').click();
    // 3. Verify URL is /checkout-complete.html
    await expect(page).toHaveURL(/checkout-complete\.html$/);
    // 4. Verify 'Thank you for your order!' visible
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });

  test('5.9 Back Home returns to inventory after completion', async ({ page }) => {
    // 1. Complete order
    await addBackpackAndOpenCart(page);
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/checkout-complete\.html$/);
    // 2. Tap 'Back Home'
    await page.locator('[data-test="back-to-products"]').click();
    // 3. Verify returns to /inventory.html
    await expect(page).toHaveURL(/inventory\.html$/);
  });

  test('5.10 End-to-end purchase flow (happy path)', async ({ page }) => {
    // 1. Log in as standard_user (handled by beforeEach up to inventory)
    // 2. Sort by Price (low to high)
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    // 3. Add Onesie ($7.99) and Bike Light ($9.99)
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    // 4. Open cart, verify both items
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('.cart_item')).toHaveCount(2);
    // 5. Checkout
    await page.locator('[data-test="checkout"]').click();
    // 6. Fill First Name 'Jane', Last Name 'Smith', Zip '90210'
    await page.locator('[data-test="firstName"]').fill('Jane');
    await page.locator('[data-test="lastName"]').fill('Smith');
    await page.locator('[data-test="postalCode"]').fill('90210');
    // 7. Continue, then Finish
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    // 8. Verify 'Thank you for your order!' page
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });
});
