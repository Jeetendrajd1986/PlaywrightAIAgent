// @ts-check
import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';


/**
 * @param {string} filename
 * @returns {Record<string, string>}
 */
const parseEnvFile = (filename) => {
  const filePath = path.resolve(__dirname, filename);

  if (!fs.existsSync(filePath)) {
    return {};
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    return content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .reduce((env, line) => {
        const [key, ...rest] = line.split('=');

        if (key) {
          env[key.trim()] = rest.join('=').trim();
        }

        return env;
      }, /** @type {Record<string, string>} */ ({}));
  } catch {
    return {};
  }
};

const uatEnv = parseEnvFile('.env.uat');
const prodEnv = parseEnvFile('.env.prod');

const rawUa = process.env.BASE_URL_UA ?? uatEnv.BASE_URL;
const rawProd = process.env.BASE_URL_PROD ?? prodEnv.BASE_URL;

/**
 * @param {string|undefined} value
 * @param {string} fallback
 * @returns {string}
 */
const normalizeBaseURL = (value, fallback) => {
  if (!value) {
    return fallback;
  }

  try {
    const url = new URL(value);
    return `${url.protocol}//${url.host}`;
  } catch {
    return value.replace(/\/\/.*/, '');
  }
};

const UA_BASE = normalizeBaseURL(
  rawUa,
  'https://uat-yourapplication.com'
);

const PROD_BASE = normalizeBaseURL(
  rawProd,
  'https://opensource-demo.orangehrmlive.com'
);

// CI/CD configuration
const isCI = Boolean(process.env.CI);

// Local: 0 retries
// CI: 2 retries
// Override with PLAYWRIGHT_RETRIES if required
const retries = Number(
  process.env.PLAYWRIGHT_RETRIES ?? (isCI ? 2 : 0)
);

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  // Prevent test.only() from being committed to CI
  forbidOnly: isCI,

  // Retry failed tests
  retries,

  // Run 4 tests in parallel
 // workers: 4,


  //Worker Configuration  Use one worker in CI; default workers locally
    workers: isCI ? 1 : 4,

  reporter: [
    ['allure-playwright'],
    ['html'],
    ['line']
  ],

  use: {
    // Trace is collected only when a test is retried
    trace: 'on-first-retry',

    // Capture screenshot only when a test fails
    screenshot: 'only-on-failure',

    // Keep video only for failed tests
    video: 'retain-on-failure',

    // Default timeout for Playwright actions
    actionTimeout: 30000,

    // Default timeout for page navigation
    navigationTimeout: 60000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: PROD_BASE,
        screenshot:"on"
      //video:"on",
      //trace:"on"
      
      },
    },

    {
      name: 'ua-chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: UA_BASE,
        screenshot:"on",
      video:"on",
      trace:"on"
      
      },
    },

    {
      name: 'prod-chromium',
      use: {
        ...devices['Desktop Chrome'],
       baseURL: PROD_BASE,
       screenshot:"on",
       video: 'retain-on-failure',
       trace: 'on-first-retry',
      
      },
    },

   {
      name: 'Mobile Safari (iPhone 14)',
      use: { ...devices['iPhone 14'] },
    },

   {
  name: 'Mobile Chrome (Pixel 7)',
  use: {
    ...devices['Pixel 7'],
    // viewport: {
//width: 412,
   // height: 915
  //},
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
},


  ],
});