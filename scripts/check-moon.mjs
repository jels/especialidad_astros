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
await page.getByRole('button', { name: /Ir a la diapositiva 5:/ }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: path.join(outDir, 'moon-presentation.png') });

const visual = page.locator('.pres-visual');
const metrics = await visual.evaluate((el) => ({
  client: [el.clientWidth, el.clientHeight],
  scroll: [el.scrollWidth, el.scrollHeight],
  scene: (() => {
    const s = el.querySelector('.moon-scene');
    return s ? [s.clientWidth, s.clientHeight] : null;
  })(),
}));
const deck = await page.evaluate(() => {
  const m = document.querySelector('.presentation-deck > main');
  return [m?.clientHeight, m?.scrollHeight];
});

const slider = page.locator('.moon-presentation input[type=range]');
const p1 = await slider.inputValue();
await page.waitForTimeout(1000);
const p2 = await slider.inputValue();

// Pause
await page.locator('.moon-presentation button', { hasText: '⏸' }).click();
const p3 = await slider.inputValue();
await page.waitForTimeout(500);
const p4 = await slider.inputValue();
await page.screenshot({ path: path.join(outDir, 'moon-paused.png') });

// Preset llena
await page.locator('.moon-presentation .preset', { hasText: 'Llena' }).click();
await page.waitForTimeout(300);
const p5 = await slider.inputValue();
const tideLabel = await page.locator('.moon-presentation').getByText('Mareas vivas').count();
await page.screenshot({ path: path.join(outDir, 'moon-llena.png') });

// Re-entry autoplay
await page.getByRole('button', { name: /Ir a la diapositiva 6:/ }).click();
await page.waitForTimeout(300);
await page.getByRole('button', { name: /Ir a la diapositiva 5:/ }).click();
await page.waitForTimeout(800);
const p6 = await slider.inputValue();
const playingCount = await page.locator('.moon-presentation button', { hasText: '⏸' }).count();

// Mobile
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
mobile.on('pageerror', (e) => errors.push(e.message));
await mobile.goto(base + '/presentacion', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(300);
await mobile.getByRole('button', { name: /Ir a la diapositiva 5:/ }).click();
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: path.join(outDir, 'moon-mobile.png') });
const mobileMetrics = await mobile.evaluate(() => {
  const deck = document.querySelector('.presentation-deck > main');
  const visual = document.querySelector('.pres-visual');
  const scene = document.querySelector('.moon-scene');
  return {
    deck: [deck?.clientHeight, deck?.scrollHeight],
    visual: [visual?.clientWidth, visual?.clientHeight],
    scene: scene ? [scene.clientWidth, scene.clientHeight] : null,
  };
});

await browser.close();
console.log(JSON.stringify({
  metrics,
  deck,
  autoMoved: [p1, p2],
  pausedStable: p3 === p4,
  paused: [p3, p4],
  presetLlena: p5,
  tideLabel,
  reentry: p6,
  playingCount,
  mobileMetrics,
  errors,
}, null, 2));
