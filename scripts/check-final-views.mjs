import { chromium } from 'playwright';
import path from 'node:path';

const base = 'http://localhost:4300';
const outDir = path.join(process.cwd(), 'captures');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const errors = [];

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
mobile.on('pageerror', (e) => errors.push(e.message));
await mobile.goto(base + '/presentacion', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(300);
await mobile.getByRole('button', { name: /Ir a la diapositiva 9:/ }).click();
await mobile.waitForTimeout(500);
await mobile.screenshot({ path: path.join(outDir, 'constellations-mobile-2.png') });
const mobileMetrics = await mobile.evaluate(() => {
  const visual = document.querySelector('.pres-visual');
  const diagram = document.querySelector('.pres-constellation-case');
  return {
    body: [document.body.clientWidth, document.body.scrollWidth],
    visual: [visual?.clientWidth, visual?.clientHeight],
    diagram: diagram ? [diagram.clientWidth, diagram.clientHeight] : null,
  };
});

const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(e.message));

await page.goto(base + '/misiones/estrellas-fijas', { waitUntil: 'networkidle' });
const stars = page.locator('#estrellas');
await stars.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
const starsData = await stars.evaluate((el) => ({
  heading: el.querySelector('h2')?.textContent?.trim(),
  ficha: el.textContent?.includes('Ficha estelar'),
  comparison: el.textContent?.includes('¿Planeta o estrella fija?'),
  cards: el.querySelectorAll('.constellation-card').length,
}));

await page.goto(base + '/misiones/constelaciones', { waitUntil: 'networkidle' });
const constellations = page.locator('#constelaciones');
await constellations.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
const constellationData = await constellations.evaluate((el) => ({
  heading: el.querySelector('h2')?.textContent?.trim(),
  cards: el.querySelectorAll('.constellation-card').length,
  workshop: el.textContent?.includes('Taller de esquemas'),
}));

await browser.close();
console.log(JSON.stringify({ mobileMetrics, starsData, constellationData, errors }, null, 2));
