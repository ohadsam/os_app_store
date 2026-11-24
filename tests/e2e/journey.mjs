// Visual tour: screenshots of every store screen in he + en (and every app page), plus a usability audit. Usage: node tests/e2e/journey.mjs <outDir>
// Open the contact sheets (sheet-*.jpg) and LOOK at them - this is the owner's "full regression with screenshots".
import { chromium } from 'playwright';
import { mkdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { serve } from '../../scripts/serve.mjs';

const out = process.argv[2] || '.tmp/journey'; mkdirSync(out, { recursive: true });
const APPS = JSON.parse(readFileSync('web/data/apps.json', 'utf8')).apps;
const server = await serve('web', 0), base = `http://localhost:${server.address().port}/`, browser = await chromium.launch();
const findings = []; let shots = 0;
for (const lang of ['he', 'en']) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: lang === 'he' ? 'he-IL' : 'en-US', serviceWorkers: 'block', reducedMotion: 'reduce' });
  await ctx.addInitScript((l) => { try { if (localStorage.getItem('os.lang') === null) localStorage.setItem('os.lang', l); } catch { /* */ } }, lang);
  const page = await ctx.newPage(); page.on('pageerror', (e) => findings.push(`${lang}: page error ${e.message}`)); page.on('console', (m) => m.type() === 'error' && findings.push(`${lang}: console ${m.text()}`));
  const shot = async (name, full = false) => { await page.screenshot({ path: `${out}/${lang}-${name}.png`, fullPage: full }); shots++; await audit(name); };
  const go = async (hash) => { await page.goto(base + hash); await page.reload(); await page.waitForSelector('#app h1, .card'); await page.waitForTimeout(250); };
  async function audit(name) {
    const r = await page.evaluate(() => {
      const bad = [...document.querySelectorAll('img')].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src'));
      const small = [...document.querySelectorAll('a[href],button,select,input')].filter((e) => { const b = e.getBoundingClientRect(); return b.width && b.height && (b.height < 40 || b.width < 40) && !e.closest('.shots') && getComputedStyle(e).visibility !== 'hidden' && !e.classList.contains('skip') && !e.classList.contains('card-link') && !(e.tagName === 'INPUT' && e.closest('label')) && !(e.tagName === 'A' && e.closest('p,li,.footer,.links')); }).map((e) => `${e.tagName}.${e.className}`);
      return { bad, small: [...new Set(small)], overflow: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    if (r.bad.length) findings.push(`${lang}/${name}: broken images ${r.bad.join(',')}`); if (r.small.length) findings.push(`${lang}/${name}: small targets ${r.small.join(',')}`); if (r.overflow) findings.push(`${lang}/${name}: horizontal overflow`);
  }
  await go('#/'); await shot('01-home'); await page.fill('#q', lang === 'he' ? 'תהילים' : 'alarm'); await page.waitForTimeout(150); await shot('02-search'); await page.fill('#q', '');
  await page.click('.filter-btn'); await page.waitForSelector('dialog[open]'); await shot('03-filters'); await page.keyboard.press('Escape');
  await go('#/app/stepup'); await shot('04-detail-top'); await shot('05-detail-full', true); await page.click('.inst .more >> nth=0'); await shot('06-detail-install', true);
  await page.click('.shot >> nth=0'); await page.waitForSelector('dialog.lightbox[open]'); await shot('07-lightbox'); await page.keyboard.press('Escape');
  await go('#/guide'); await shot('08-guide', true); await go('#/about'); await shot('09-about', true);
  for (const a of APPS) { await go(`#/app/${a.id}`); await shot(`app-${a.id}`); }
  await ctx.close();
}
await browser.close(); server.close();
try { for (const lang of ['he', 'en']) execFileSync('montage', [...APPS.map((a) => `${out}/${lang}-app-${a.id}.png`), '-tile', '6x', '-geometry', '260x+6+6', '-background', '#888', `${out}/sheet-${lang}-apps.jpg`]); } catch { console.log('(montage not available: open the PNGs directly)'); }
console.log(`${shots} screenshots in ${out}`); console.log(findings.length ? `findings:\n - ${findings.join('\n - ')}` : 'findings: none');
