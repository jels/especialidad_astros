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

// Go to eclipse, pause, leave and return: auto-play should restart.
await page.getByRole('button', { name: /Ir a la diapositiva 2:/ }).click();
await page.waitForTimeout(500);
await page.locator('.eclipse-presentation button', { hasText: 'Pausar' }).first().click();
const paused = await page.locator('.eclipse-presentation input[type=range]').inputValue();
await page.getByRole('button', { name: /Ir a la diapositiva 3:/ }).click();
await page.waitForTimeout(300);
await page.getByRole('button', { name: /Ir a la diapositiva 2:/ }).click();
await page.waitForTimeout(700);
const reentry = await page.locator('.eclipse-presentation input[type=range]').inputValue();
const reentryPlaying = await page.locator('.eclipse-presentation').getByText('Pausar').count();

// Mobile
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
mobile.on('pageerror', (e) => errors.push(e.message));
await mobile.goto(base + '/presentacion', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(300);
await mobile.getByRole('button', { name: /Ir a la diapositiva 2:/ }).click();
await mobile.waitForTimeout(600);
await mobile.screenshot({ path: path.join(outDir, 'eclipse-mobile-2.png') });
const mobileMetrics = await mobile.evaluate(() => {
  const deck = document.querySelector('.presentation-deck > main');
  const visual = document.querySelector('.pres-visual');
  const scene = document.querySelector('.eclipse-scene-sky');
  return {
    deck: [deck?.clientHeight, deck?.scrollHeight],
    visual: [visual?.clientWidth, visual?.clientHeight],
    scene: [scene?.clientWidth, scene?.clientHeight],
  };
});

await browser.close();
console.log(JSON.stringify({ paused, reentry, reentryPlaying, mobileMetrics, errors }, null, 2));
