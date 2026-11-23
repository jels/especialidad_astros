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
await page.getByRole('button', { name: /Ir a la diapositiva 6:/ }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(outDir, 'dance-presentation.png') });

const earthX = () =>
  page.evaluate(() => {
    const label = [...document.querySelectorAll('.dance-presentation .dance-scene text')].find(
      (t) => t.textContent?.trim() === 'TIERRA',
    );
    return label?.getAttribute('x');
  });

const x1 = await earthX();
await page.waitForTimeout(1000);
const x2 = await earthX();

const metrics = await page.locator('.pres-visual').evaluate((el) => ({
  client: [el.clientWidth, el.clientHeight],
  scroll: [el.scrollWidth, el.scrollHeight],
  scene: (() => {
    const s = el.querySelector('.dance-scene');
    return s ? [s.clientWidth, s.clientHeight] : null;
  })(),
}));
const deck = await page.evaluate(() => {
  const m = document.querySelector('.presentation-deck > main');
  return [m?.clientHeight, m?.scrollHeight];
});

// Pause
await page.locator('.dance-presentation button[aria-label="Pausar animación"]').click();
const x3 = await earthX();
await page.waitForTimeout(500);
const x4 = await earthX();
await page.screenshot({ path: path.join(outDir, 'dance-paused.png') });

// Solar alignment
await page.locator('.dance-presentation .control-btn', { hasText: 'Eclipse solar' }).click();
await page.waitForTimeout(300);
const solarStatus = await page.locator('.dance-presentation').getByText('Posible eclipse solar').count();
await page.screenshot({ path: path.join(outDir, 'dance-solar.png') });

// Re-entry autoplay
await page.getByRole('button', { name: /Ir a la diapositiva 7:/ }).click();
await page.waitForTimeout(300);
await page.getByRole('button', { name: /Ir a la diapositiva 6:/ }).click();
await page.waitForTimeout(500);
const y1 = await earthX();
await page.waitForTimeout(700);
const y2 = await earthX();
const playingCount = await page.locator('.dance-presentation button[aria-label="Pausar animación"]').count();

// Mobile
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
mobile.on('pageerror', (e) => errors.push(e.message));
await mobile.goto(base + '/presentacion', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(300);
await mobile.getByRole('button', { name: /Ir a la diapositiva 6:/ }).click();
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: path.join(outDir, 'dance-mobile.png') });
const mobileMetrics = await mobile.evaluate(() => {
  const deck = document.querySelector('.presentation-deck > main');
  const visual = document.querySelector('.pres-visual');
  const scene = document.querySelector('.dance-scene');
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
  autoMoved: [x1, x2],
  pausedStable: x3 === x4,
  paused: [x3, x4],
  solarStatus,
  reentryMoved: [y1, y2],
  playingCount,
  mobileMetrics,
  errors,
}, null, 2));
