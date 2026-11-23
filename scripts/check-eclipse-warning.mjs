import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = 'http://localhost:4300';
const outDir = path.join(process.cwd(), 'captures');
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(base + '/presentacion', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await page.getByRole('button', { name: /Ir a la diapositiva 2:/ }).click();
await page.waitForTimeout(400);
const slider = page.locator('.eclipse-presentation input[type=range]');
await slider.evaluate((el) => {
  el.value = '25';
  el.dispatchEvent(new Event('input', { bubbles: true }));
});
await page.waitForTimeout(400);
const presentationWarning = await page
  .locator('.eclipse-presentation')
  .getByText('La Luna está fuera de la línea')
  .count();
const deck = await page.evaluate(() => {
  const m = document.querySelector('.presentation-deck > main');
  return [m?.clientHeight, m?.scrollHeight];
});
await page.screenshot({ path: path.join(outDir, 'eclipse-no-warning.png') });

const mission = await browser.newPage({ viewport: { width: 1366, height: 900 } });
mission.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
mission.on('pageerror', (e) => errors.push(e.message));
await mission.goto(base + '/misiones/eclipses', { waitUntil: 'networkidle' });
const section = mission.locator('#eclipses');
await section.scrollIntoViewIfNeeded();
await mission.waitForTimeout(500);
const missionSlider = section.locator('#moon-orbit');
await missionSlider.evaluate((el) => {
  el.value = '25';
  el.dispatchEvent(new Event('input', { bubbles: true }));
});
await mission.waitForTimeout(300);
const missionWarning = await section.getByText('La Luna está fuera de la línea').count();

await browser.close();
console.log(JSON.stringify({ presentationWarning, missionWarning, deck, errors }, null, 2));
