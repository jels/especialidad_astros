import { chromium } from 'playwright';
import path from 'node:path';

const base = 'http://localhost:4300';
const outDir = path.join(process.cwd(), 'captures');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(base + '/misiones/luna-y-mareas', { waitUntil: 'networkidle' });
const section = page.locator('#luna');
await section.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
const data = await section.evaluate((el) => ({
  heading: el.querySelector('h2')?.textContent?.trim(),
  cards: el.querySelectorAll('.glass').length,
  scene: !!el.querySelector('.moon-scene'),
  sidePanel: el.textContent?.includes('Ficha lunar'),
  bottomCards: el.textContent?.includes('Dos bultos de agua'),
}));
await section.screenshot({ path: path.join(outDir, 'moon-mission.png') });
await browser.close();
console.log(JSON.stringify({ data, errors }, null, 2));
