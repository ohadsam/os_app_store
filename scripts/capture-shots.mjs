// Takes store screenshots of the web apps by running them from their local clones in headless Chromium (no network needed for the
// shots below). Native Android apps cannot be run here; their screenshots are added later (docs/CATALOG.md).
// Usage: APPS_DIR=/path/to/clones node scripts/capture-shots.mjs [appId ...]   (output: web/art/shots/<id>/<name>.jpg)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { serve } from './serve.mjs';
const DIR = process.env.APPS_DIR || '/home/user/ohadsam';
const PLAN = { // id -> { root, steps: [{ name, hash?, click?, eval? }] }
  sonrise: { root: 'morning_organizer/web', steps: [{ name: 'home' }, { name: 'guide', hash: '#/guide' }, { name: 'settings', hash: '#/settings' }] },
  findmycar: { root: 'find_my_car', steps: [{ name: 'home' }, { name: 'history', click: '#navBtnHistory' }, { name: 'vehicles', click: '#navBtnSettings' }] },
  kodesh: { root: 'kodesh-app', steps: [{ name: 'tehilim', click: '#t-tehilim' }, { name: 'lashon', click: '#t-lashon' }, { name: 'daf', click: '#t-daf' }] },
  seating: { root: 'table_orginizer', steps: [{ name: 'planner', eval: "document.getElementById('btnLoadDemo')?.click()" }] },
};
// Best-effort: closes welcome / what's-new / error dialogs (the apps' first-run screens) so the shots show the real app.
const DISMISS = '^\\W*(דלג|הבנתי|לא עכשיו|בואו נתחיל|סגור|סגירה|×|✕|✖|x$|close|got it|skip)';
async function dismissDialogs(page) {
  for (let i = 0; i < 5; i++) {
    const hit = await page.evaluate((src) => {
      const re = new RegExp(src, 'i'), vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
      const btns = [...document.querySelectorAll('button, [role=button]')].filter(vis).filter((b) => re.test((b.textContent || '').trim()) || re.test(b.getAttribute('aria-label') || ''));
      const strong = /(דלג|הבנתי|לא עכשיו|בואו נתחיל|got it|skip)/i, b = btns.find((x) => strong.test(x.textContent || '')) || btns.find((x) => x.closest('dialog, .modal, [role=dialog], .overlay, .sheet, #whatsNewModal')) || null; if (b) { b.click(); return true; } return false;
    }, DISMISS);
    if (!hit) break; await page.waitForTimeout(500);
  }
}
const only = process.argv.slice(2), browser = await chromium.launch();
for (const [id, cfg] of Object.entries(PLAN)) {
  if (only.length && !only.includes(id)) continue;
  const server = await serve(`${DIR}/${cfg.root}`, 0), base = `http://localhost:${server.address().port}/`;
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5, locale: 'he-IL', serviceWorkers: 'block', reducedMotion: 'reduce', permissions: [], geolocation: { latitude: 32.08, longitude: 34.78 } });
  const page = await ctx.newPage(); page.on('dialog', (d) => d.accept()); mkdirSync(`web/art/shots/${id}`, { recursive: true });
  await page.route(/^https?:\/\/(?!localhost)/, (r) => r.abort()); // offline: apps show their own empty/fallback states
  await page.goto(base, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(1200); await dismissDialogs(page);
  for (const s of cfg.steps) {
    try { if (s.hash) { await page.evaluate((h) => { location.hash = h; }, s.hash); } if (s.eval) await page.evaluate(s.eval); if (s.click) await page.click(s.click, { timeout: 3000 }); await page.waitForTimeout(900); await dismissDialogs(page);
      await page.screenshot({ path: `web/art/shots/${id}/${s.name}.jpg`, type: 'jpeg', quality: 72 }); console.log('shot', id, s.name); } catch (e) { console.error('skip', id, s.name, e.message.split('\n')[0]); }
  }
  await ctx.close(); server.close();
}
await browser.close();
