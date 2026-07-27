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
  if (!fs.existsSync(filePath)) return {};
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .reduce((env, line) => {
        const [key, ...rest] = line.split('=');
        env[key] = rest.join('=').trim();
        return env;
      }, /** @type {Record<string, string>} */ ({}));
  } catch {
    return {};
  }
};

const uatenv = parseEnvFile('.env.uat');
const prodenv = parseEnvFile('.env.prod');

const rawUa = process.env.BASE_URL_UA ?? uatenv.BASE_URL;
const rawProd = process.env.BASE_URL_PROD ?? prodenv.BASE_URL;
/**
 * @param {string|undefined} value
 * @param {string} fallback
 * @returns {string}
 */const normalizeBaseURL = (value, fallback) => {
  if (!value) return fallback;
  try {
    const url = new URL(value);
    return `${url.protocol}//${url.host}`;
  } catch {
    return value.replace(/\/\/.*/, '');
  }
};

const UA_BASE = normalizeBaseURL(rawUa, 'https://uat-yourapplication.com');
const PROD_BASE = normalizeBaseURL(rawProd, 'https://opensource-demo.orangehrmlive.com');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [ ['allure-playwright'] ],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: PROD_BASE,
        screenshot: 'on',
        video: 'on',
        trace: 'on',
      },
    },
    {
      name: 'ua-chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: UA_BASE,
        screenshot: 'on',
        video: 'on',
        trace: 'on',
      },
    },
    {
      name: 'prod-chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: PROD_BASE,
        screenshot: 'on',
        video: 'on',
        trace: 'on',
      },
    },
  ],
});

