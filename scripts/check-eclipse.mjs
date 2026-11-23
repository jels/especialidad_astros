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
await page.waitForTimeout(500);
await page.getByRole('button', { name: /Ir a la diapositiva 2:/ }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: path.join(outDir, 'eclipse-presentation.png') });

const visual = page.locator('.pres-visual');
const metrics = await visual.evaluate((el) => ({
  client: [el.clientWidth, el.clientHeight],
  scroll: [el.scrollWidth, el.scrollHeight],
}));
const deck = await page.evaluate(() => {
  const m = document.querySelector('.presentation-deck > main');
  return [m?.clientHeight, m?.scrollHeight];
});

const pos1 = await page.locator('.eclipse-presentation input[type=range]').inputValue();
await page.waitForTimeout(900);
const pos2 = await page.locator('.eclipse-presentation input[type=range]').inputValue();

await page.locator('.eclipse-presentation button', { hasText: 'Pausar' }).first().click();
const pos3 = await page.locator('.eclipse-presentation input[type=range]').inputValue();
await page.waitForTimeout(500);
const pos4 = await page.locator('.eclipse-presentation input[type=range]').inputValue();
await page.screenshot({ path: path.join(outDir, 'eclipse-paused.png') });

// Scenario buttons
await page.locator('.eclipse-presentation .segmented button', { hasText: 'Lunar' }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(outDir, 'eclipse-lunar.png') });
await page.locator('.eclipse-presentation .segmented button', { hasText: 'Solar' }).click();
await page.waitForTimeout(300);

// Rail text
const railText = await page.locator('.pres-rail').innerText();

// Mission page screenshot
const mission = await browser.newPage({ viewport: { width: 1366, height: 900 } });
mission.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
mission.on('pageerror', (e) => errors.push(e.message));
await mission.goto(base + '/misiones/eclipses', { waitUntil: 'networkidle' });
await mission.waitForTimeout(800);
const eclipseSection = mission.locator('#eclipses');
await eclipseSection.scrollIntoViewIfNeeded();
await mission.waitForTimeout(700);
await eclipseSection.screenshot({ path: path.join(outDir, 'eclipse-mission.png') });

// Mobile presentation
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
mobile.on('pageerror', (e) => errors.push(e.message));
await mobile.goto(base + '/presentacion', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(400);
await mobile.getByRole('button', { name: /Ir a la diapositiva 2:/ }).click();
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: path.join(outDir, 'eclipse-mobile.png') });
const mobileMetrics = await mobile.locator('.pres-visual').evaluate((el) => ({
  client: [el.clientWidth, el.clientHeight],
  scroll: [el.scrollWidth, el.scrollHeight],
}));

await browser.close();
console.log(JSON.stringify({
  metrics,
  deck,
  autoMoved: [pos1, pos2],
  pausedStable: pos3 === pos4,
  paused: [pos3, pos4],
  railText: railText.slice(0, 200),
  mobileMetrics,
  errors,
}, null, 2));
