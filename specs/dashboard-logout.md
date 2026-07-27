# Dashboard Logout Scenarios

## Page
OrangeHRM Dashboard

## Purpose
Document the logout flows for the OrangeHRM Dashboard page using the existing seed login helper to reach the dashboard state.

## Seed
`tests/seed.spec.js`

## Test Scenarios

### 1. Logout from dashboard profile menu
- Precondition: User is logged in and on `https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index`.
- Steps:
  1. Open the topbar user dropdown with the profile name.
  2. Click `Logout`.
- Expected:
  - User is redirected to `/web/index.php/auth/login`.
  - Username and password fields are visible.
  - The login page is displayed.

### 2. Verify session is ended after logout
- Precondition: User is logged in and on the dashboard.
- Steps:
  1. Logout from the profile menu.
 2. Navigate directly to `/web/index.php/dashboard/index`.
- Expected:
  - The app redirects back to the login page.
  - Dashboard is not accessible without re-authentication.

### 3. Browser back should not restore dashboard after logout
- Precondition: User is logged in and on the dashboard.
- Steps:
  1. Logout from the profile menu.
 2. Press browser back or navigate to the previous page.
- Expected:
  - The user remains on the login page.
  - Dashboard content is not restored.

## Notes
- Use `tests/seed.spec.js` as a shared login helper to keep tests focused on logout behavior.
- Keep the dashboard logout test file scoped to logout scenarios only.
