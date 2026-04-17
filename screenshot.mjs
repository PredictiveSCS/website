/**
 * screenshot.mjs — Puppeteer screenshot helper
 * Usage: node screenshot.mjs <url> [label]
 * Output: ./temporary screenshots/screenshot-N[-label].png
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const outDir     = path.join(__dirname, 'temporary screenshots');
const url        = process.argv[2] || 'http://localhost:3000';
const label      = process.argv[3] || '';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Auto-increment filename
let n = 1;
while (fs.existsSync(path.join(outDir, `screenshot-${n}${label ? '-' + label : ''}.png`))) n++;
const outFile = path.join(outDir, `screenshot-${n}${label ? '-' + label : ''}.png`);

const browser = await puppeteer.launch({
  executablePath: (
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    'C:/Users/Alex/.cache/puppeteer/chrome/win64-131.0.6778.204/chrome-win64/chrome.exe'
  ),
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 800)); // let fonts settle

await page.screenshot({ path: outFile, fullPage: true });
console.log(`Screenshot saved: ${outFile}`);

await browser.close();
