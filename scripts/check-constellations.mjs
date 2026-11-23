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
await page.getByRole('button', { name: /Ir a la diapositiva 9:/ }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, 'constellations-presentation.png') });

const activeName = () =>
  page.evaluate(() => {
    const badge = document.querySelector('.pres-constellation-case span');
    return badge?.textContent?.trim().split(' · ')[0] ?? null;
  });

const sequence = [await activeName()];
for (let i = 0; i < 5; i++) {
  await page.waitForTimeout(6300);
  sequence.push(await activeName());
}

// Pause
await page.locator('.pres-option', { hasText: 'Pausa' }).click();
const pausedName = await activeName();
await page.waitForTimeout(6800);
const stillPaused = await activeName();
await page.screenshot({ path: path.join(outDir, 'constellations-paused.png') });

// Manual select stays paused
await page.locator('.pres-option', { hasText: 'Orión' }).click();
await page.waitForTimeout(300);
const manualName = await activeName();
const autoLabel = await page.locator('.pres-option', { hasText: 'Auto' }).count();

// Resume and advance
await page.locator('.pres-option', { hasText: 'Auto' }).click();
const resumeStart = await activeName();
await page.waitForTimeout(6300);
const resumeEnd = await activeName();

const deck = await page.evaluate(() => {
  const main = document.querySelector('.presentation-deck > main');
  const rail = document.querySelector('.pres-rail');
  const visual = document.querySelector('.pres-visual');
  return {
    deck: [main?.clientHeight, main?.scrollHeight],
    rail: rail ? [rail.clientHeight, rail.scrollHeight] : null,
    visual: visual ? [visual.clientHeight, visual.scrollHeight] : null,
  };
});

// Re-entry reset
await page.getByRole('button', { name: /Ir a la diapositiva 10:/ }).click();
await page.waitForTimeout(300);
await page.getByRole('button', { name: /Ir a la diapositiva 9:/ }).click();
await page.waitForTimeout(500);
const reentryName = await activeName();
const reentryAuto = await page.locator('.pres-option', { hasText: 'Pausa' }).count();

// Mobile
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
mobile.on('pageerror', (e) => errors.push(e.message));
await mobile.goto(base + '/presentacion', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(300);
await mobile.getByRole('button', { name: /Ir a la diapositiva 9:/ }).click();
await mobile.waitForTimeout(600);
await mobile.screenshot({ path: path.join(outDir, 'constellations-mobile.png') });
const mobileMetrics = await mobile.evaluate(() => {
  const body = document.body;
  const visual = document.querySelector('.pres-visual');
  const diagram = document.querySelector('.pres-constellation-case');
  return {
    body: [body.clientWidth, body.scrollWidth],
    visual: [visual?.clientWidth, visual?.clientHeight],
    diagram: diagram ? [diagram.clientWidth, diagram.clientHeight] : null,
  };
});

await browser.close();
console.log(JSON.stringify({
  sequence,
  unique: [...new Set(sequence)].length,
  pausedStable: pausedName === stillPaused,
  pausedName,
  stillPaused,
  manualName,
  autoLabel,
  resumeMoved: resumeStart !== resumeEnd,
  resume: [resumeStart, resumeEnd],
  deck,
  reentryName,
  reentryAuto,
  mobileMetrics,
  errors,
}, null, 2));
