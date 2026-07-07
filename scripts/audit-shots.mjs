/**
 * Visual audit screenshots via Playwright (driving installed Edge).
 *
 *   node scripts/audit-shots.mjs <outDir> [tag]
 *
 * Captures the homepage at 1440 / 768 / 375 px, then scrolls the 1440
 * viewport slowly through the journey via mouse-wheel steps (so Lenis
 * smoothing + staged reveals are exercised) and captures 4 mid-transition
 * states.
 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT = resolve(process.argv[2] ?? '.');
const TAG = process.argv[3] ?? 'before';
const URL = 'http://127.0.0.1:3100';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });

async function heroShot(width, height, name, isMobile = false) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile,
    hasTouch: isMobile,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(9000); // preloader + intro
  await page.screenshot({ path: `${OUT}/${TAG}-${name}.png` });
  console.log(`saved ${TAG}-${name}.png`);
  await ctx.close();
}

await heroShot(1440, 900, '1440-hero');
await heroShot(768, 1024, '768-hero');
await heroShot(375, 812, '375-hero', true);

// slow scroll-through on desktop, capturing transition states
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(9000);

  const stops = [
    ['scroll-1-about', 14],
    ['scroll-2-services', 26],
    ['scroll-3-work', 46],
    ['scroll-4-contact', 96],
  ];
  let current = 0;
  const total = await page.evaluate(() => document.body.scrollHeight - innerHeight);
  await page.mouse.move(720, 450);
  for (const [name, pct] of stops) {
    const target = (pct / 100) * total;
    // wheel in steps so Lenis smoothing + staged reveals actually play
    while (current < target) {
      const step = Math.min(420, target - current);
      await page.mouse.wheel(0, step);
      current += step;
      await page.waitForTimeout(90);
    }
    await page.waitForTimeout(700); // catch reveals mid-flight, not settled
    await page.screenshot({ path: `${OUT}/${TAG}-${name}.png` });
    console.log(`saved ${TAG}-${name}.png`);
  }
  await ctx.close();
}

await browser.close();
console.log('audit complete');
