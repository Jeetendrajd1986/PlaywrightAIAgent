const { chromium } = require('@playwright/test');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const reportDir = path.join(__dirname, '..', 'allure-report');
const pdfPath = path.join(__dirname, '..', 'allure-report.pdf');
const port = 47899;

function findAllureCommand() {
  // Prefer the locally installed CLI shipped with allure-commandline
  const local = path.join(
    __dirname,
    '..',
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'allure.cmd' : 'allure'
  );
  if (fs.existsSync(local)) {
    return { cmd: local, useShell: false };
  }
  // Fall back to whatever is on PATH
  return { cmd: 'allure', useShell: process.platform === 'win32' };
}

function runAllureGenerate() {
  const { cmd, useShell } = findAllureCommand();
  console.log(`Generating Allure HTML report using: ${cmd}`);
  execFileSync(cmd, ['generate', 'allure-results', '--clean', '-o', reportDir], {
    stdio: 'inherit',
    shell: useShell,
    windowsVerbatimArguments: process.platform === 'win32',
  });
}

function startStaticServer(rootDir, portToUse) {
  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg':  'image/svg+xml',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.ico':  'image/x-icon',
    '.woff': 'font/woff',
    '.woff2':'font/woff2',
    '.ttf':  'font/ttf',
    '.map':  'application/json; charset=utf-8',
    '.txt':  'text/plain; charset=utf-8',
  };

  const server = http.createServer((req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      let filePath = path.join(rootDir, urlPath);
      if (urlPath === '/' || urlPath.endsWith('/')) {
        filePath = path.join(filePath, 'index.html');
      }
      if (!filePath.startsWith(rootDir)) {
        res.writeHead(403); res.end('Forbidden'); return;
      }
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(rootDir, 'index.html');
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } catch (err) {
      res.writeHead(500); res.end(String(err));
    }
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(portToUse, '127.0.0.1', () => resolve(server));
  });
}

(async () => {
  runAllureGenerate();

  console.log(`Starting static server for ${reportDir} on http://127.0.0.1:${port}`);
  const server = await startStaticServer(reportDir, port);
  const serverUrl = `http://127.0.0.1:${port}/`;

  try {
    console.log(`Opening Allure report: ${serverUrl}`);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
    });

    await page.goto(serverUrl, { waitUntil: 'domcontentloaded' });

    // Give the SPA a moment to fetch data and render charts/tables
    try {
      await page.waitForSelector('.widget', { timeout: 15000 });
    } catch (_) { /* not all pages have .widget; continue */ }
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);

    console.log('Generating PDF...');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      landscape: true,
      margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
    });

    await browser.close();
    console.log(`PDF created successfully: ${pdfPath}`);
  } finally {
    server.close();
  }

  if (!fs.existsSync(pdfPath)) {
    throw new Error('PDF was not generated.');
  }
})().catch((err) => {
  console.error('Failed to generate Allure PDF:', err);
  process.exit(1);
});