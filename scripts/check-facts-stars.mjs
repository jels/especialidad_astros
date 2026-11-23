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
await page.waitForTimeout(400);
const slides = [];
for (const i of [2, 5, 6, 8, 9, 10, 11, 12]) {
  await page.getByRole('button', { name: new RegExp(`Ir a la diapositiva ${i}:`) }).click();
  await page.waitForTimeout(600);
  slides.push(await page.evaluate((index) => {
    const main = document.querySelector('.presentation-deck > main');
    const rail = document.querySelector('.pres-rail');
    const visual = document.querySelector('.pres-visual');
    return {
      index,
      deck: [main?.clientHeight, main?.scrollHeight],
      rail: rail ? [rail.clientHeight, rail.scrollHeight] : null,
      visual: visual ? [visual.clientHeight, visual.scrollHeight] : null,
      railText: rail?.textContent?.slice(0, 40),
    };
  }, i));
}

await page.getByRole('button', { name: /Ir a la diapositiva 2:/ }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, 'eclipse-big-facts.png') });

await page.getByRole('button', { name: /Ir a la diapositiva 8:/ }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(outDir, 'stars-presentation-2.png') });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
mobile.on('pageerror', (e) => errors.push(e.message));
await mobile.goto(base + '/presentacion', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(300);
await mobile.getByRole('button', { name: /Ir a la diapositiva 8:/ }).click();
await mobile.waitForTimeout(600);
await mobile.screenshot({ path: path.join(outDir, 'stars-mobile-2.png') });
const mobileMetrics = await mobile.evaluate(() => {
  const deck = document.querySelector('.presentation-deck > main');
  const visual = document.querySelector('.pres-visual');
  const scene = visual?.querySelector('.stars-scene');
  const rail = document.querySelector('.pres-rail');
  return {
    body: [document.body.clientWidth, document.body.scrollWidth],
    deck: [deck?.clientWidth, deck?.scrollWidth, deck?.clientHeight, deck?.scrollHeight],
    visual: [visual?.clientWidth, visual?.clientHeight],
    scene: scene ? [scene.clientWidth, scene.clientHeight] : null,
    rail: rail ? [rail.clientWidth, rail.clientHeight, rail.scrollHeight] : null,
  };
});

await browser.close();
console.log(JSON.stringify({ slides, mobileMetrics, errors }, null, 2));
