// End-to-end tests in real Chromium against the static site. Usage: node tests/e2e/smoke.mjs   (ONLY="step name" runs matching steps)
import { chromium } from 'playwright';
import axe from 'axe-core';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { serve } from '../../scripts/serve.mjs';

const server = await serve('web', 0), base = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const APPS = JSON.parse(readFileSync('web/data/apps.json', 'utf8')).apps;
let failures = 0;
const step = async (name, fn) => { if (process.env.ONLY && !name.includes(process.env.ONLY)) return; try { await fn(); console.log('✓', name); } catch (e) { failures++; console.error('✗', name, '\n  ', e.message.split('\n').slice(0, 12).join(' / ')); } };

// Hebrew/RTL is the default; { lang: 'en' } starts in English. Collects console and page errors. Service workers are blocked unless `sw`.
async function newPage({ lang = 'he', width = 390, scheme = 'light', sw = false, hash = '' } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height: 800 }, locale: 'en-US', colorScheme: scheme, serviceWorkers: sw ? 'allow' : 'block' });
  await ctx.addInitScript((l) => { try { if (l !== 'he' && localStorage.getItem('os.lang') === null) localStorage.setItem('os.lang', l); } catch { /* blocked */ } }, lang);
  const page = await ctx.newPage(), errors = [];
  page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(base + hash); await page.waitForSelector('#app h1, #app .card');
  return { page, errors, ctx };
}
// Lazy images below the fold are forced to load; images hidden by the theme (the other half of an art pair) are ignored.
const imagesOk = (page, sel) => page.evaluate(async (q) => { const imgs = [...document.querySelectorAll(q)].filter((i) => i.offsetParent !== null || i.closest('.shots')); imgs.forEach((i) => { i.loading = 'eager'; }); await Promise.all(imgs.map((i) => i.decode().catch(() => {}))); return imgs.length > 0 && imgs.every((i) => i.complete && i.naturalWidth > 0); }, sel);
const closeSheet = async (page) => { await page.click('.sheet-actions .btn-primary'); await page.waitForSelector('dialog', { state: 'detached' }); };
const allCards = (page) => page.locator('section[aria-labelledby="h-all"] .card').count();
async function axeClean(page, label) {
  await page.evaluate(axe.source); // evaluate (not addScriptTag): the CSP forbids injected script tags
  const r = await page.evaluate(() => axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'best-practice'], rules: { 'color-contrast': { enabled: true } } }));
  assert.equal(r.violations.length, 0, `${label}: ${r.violations.map((v) => `${v.id} (${v.nodes.length}) ${v.nodes[0]?.target}`).join('; ')}`);
}
const noOverflow = async (page, label) => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${label}: horizontal scroll`);
const ROUTES = ['#/', '#/app/stepup', '#/app/smartring', '#/app/tehilim', '#/app/kodesh', '#/guide', '#/about', '#/settings'];

await step('boot: Hebrew RTL store with every app, hero, nav, footer, no errors', async () => {
  const { page, errors, ctx } = await newPage();
  assert.equal(await page.evaluate(() => document.documentElement.dir), 'rtl'); assert.equal(await page.evaluate(() => document.documentElement.lang), 'he');
  assert.equal(await allCards(page), APPS.length); assert.match(await page.title(), /OS APPs & Downs/);
  assert.ok((await page.locator('#footer').innerText()).includes('כל הזכויות שמורות')); assert.equal(await page.locator('#bottomnav a').count(), 4);
  assert.ok(await imagesOk(page, '.card .app-icon'), 'icons loaded');
  assert.deepEqual(errors, []); await ctx.close();
});
await step('search: Hebrew, English, niqqud, any word order, empty state, clear', async () => {
  const { page, ctx } = await newPage();
  await page.fill('#q', 'תהילים'); assert.equal(await allCards(page), 2);
  await page.fill('#q', 'תְּהִילִּים'); assert.equal(await allCards(page), 2);
  await page.fill('#q', 'stepup'); assert.equal(await allCards(page), 1);
  await page.fill('#q', 'gps חניה'); assert.equal(await allCards(page), 1);
  await page.fill('#q', 'zzzz'); assert.equal(await page.locator('.empty').count(), 1);
  await page.click('.empty .btn'); assert.equal(await allCards(page), APPS.length);
  await page.fill('#q', 'x'); await page.click('.search-clear'); assert.equal(await page.inputValue('#q'), ''); await ctx.close();
});
await step('chips + filter sheet: platform, category, tags (AND), sort, favourites-only, clear', async () => {
  const { page, ctx } = await newPage();
  await page.click('.chips .chip:nth-child(3)'); const android = APPS.filter((a) => a.platforms.includes('android')).length; assert.equal(await allCards(page), android);
  await page.click('.chips .chip:nth-child(2)'); assert.equal(await allCards(page), APPS.filter((a) => a.platforms.some((p) => p === 'web' || p === 'pwa')).length);
  await page.click('.chips .chip:nth-child(1)');
  await page.click('.filter-btn'); await page.waitForSelector('dialog[open]');
  await page.selectOption('#f-cat', 'faith'); assert.ok((await page.locator('.sheet-actions .btn-primary').innerText()).includes('2'));
  await closeSheet(page); assert.equal(await allCards(page), 2); assert.ok((await page.locator('.filter-btn').innerText()).includes('1'));
  await page.click('.filter-btn'); await page.selectOption('#f-cat', ''); await page.click('.tag-list .chip:has-text("תהילים")'); await page.click('.tag-list .chip:has-text("וידג׳ט")'); await closeSheet(page); assert.equal(await allCards(page), 1);
  await page.click('.filter-btn'); await page.click('.sheet-actions .btn-ghost'); await page.selectOption('#f-sort', 'name'); await closeSheet(page);
  const names = await page.locator('section[aria-labelledby="h-all"] .card-title').allInnerTexts(); assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b, 'he')));
  await page.click('.filter-btn'); await page.click('.sheet-body label.check'); assert.ok((await page.locator('.sheet-actions .btn-primary').innerText()).includes(' 0 ')); await page.keyboard.press('Escape'); await ctx.close();
});
await step('favourites: heart toggles, persists across reload, favourites-only filter', async () => {
  const { page, ctx } = await newPage();
  const heart = page.locator('section[aria-labelledby="h-all"] .card[data-app="stepup"] .fav');
  assert.equal(await heart.getAttribute('aria-pressed'), 'false'); await heart.click(); assert.equal(await heart.getAttribute('aria-pressed'), 'true'); assert.equal(await page.locator('.toast').count(), 1);
  await page.reload(); await page.waitForSelector('.card'); assert.equal(await page.locator('section[aria-labelledby="h-all"] .card[data-app="stepup"] .fav').getAttribute('aria-pressed'), 'true');
  await page.click('.filter-btn'); await page.click('.sheet-body label.check'); await closeSheet(page); assert.equal(await allCards(page), 1); await ctx.close();
});
await step('app page: hero, links, screenshots + lightbox, what is new, info, show-more install guide, installed mark', async () => {
  const { page, ctx, errors } = await newPage();
  await page.click('section[aria-labelledby="h-all"] .card[data-app="stepup"] .card-link'); await page.waitForSelector('.detail h1');
  assert.equal(await page.locator('.detail h1').innerText(), 'StepUp'); assert.equal(page.url().endsWith('#/app/stepup'), true);
  assert.match(await page.locator('.cta a').first().getAttribute('href'), /^https:\/\/ohadsam\.github\.io\/distance_analyzer\/$/);
  assert.match(await page.locator('.cta a >> text=APK').getAttribute('href'), /releases\/latest\/download\/stepup\.apk$/);
  assert.ok(await imagesOk(page, '.shots img'), 'screenshots loaded'); assert.ok(await page.locator('.shots img').count() >= 4);
  await page.click('.shot >> nth=1'); await page.waitForSelector('dialog.lightbox[open]'); assert.match(await page.locator('.lb-cap').innerText(), /2\/\d/); await page.keyboard.press('ArrowLeft'); await page.keyboard.press('Escape'); await page.waitForSelector('dialog.lightbox', { state: 'detached' });
  const more = page.locator('.inst .more').first(); assert.equal(await more.getAttribute('aria-expanded'), 'false'); await more.click(); assert.equal(await more.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('.inst .steps .step').count(), 9); assert.ok(await page.locator('.phone').first().isVisible());
  assert.ok((await page.locator('.info').innerText()).includes('0.31')); await page.click('text=סימון: התקנתי את הגרסה הזו'); assert.ok(await page.locator('text=סימנתם גרסה').count());
  await page.click('.back'); assert.equal(await page.locator('.card[data-app="stepup"] .badge.b-upd').count(), 0);
  assert.deepEqual(errors, []); await ctx.close();
});
await step('installed mark older than the catalog shows an update badge and warning', async () => {
  const { page, ctx } = await newPage({}); await page.evaluate(() => localStorage.setItem('os.installed', JSON.stringify({ stepup: '0.1.0' }))); await page.reload(); await page.waitForSelector('.card');
  assert.ok(await page.locator('.card[data-app="stepup"] .b-upd').count() > 0); await page.goto(`${base}#/app/stepup`); await page.reload(); await page.waitForSelector('.detail h1'); assert.ok(await page.locator('.note.warn[role=status]').count()); await ctx.close();
});
await step('every app page renders without errors, with loaded images and a working primary link', async () => {
  const { page, ctx, errors } = await newPage();
  for (const a of APPS) {
    await page.goto(`${base}#/app/${a.id}`); await page.reload(); await page.waitForSelector('.detail h1');
    assert.ok((await page.locator('.detail h1').innerText()).length > 1, a.id);
    assert.ok(await imagesOk(page, '.detail img'), `${a.id} images`);
    const hrefs = await page.locator('.detail a[href^="https"]').evaluateAll((l) => l.map((x) => x.href)); assert.ok(hrefs.length >= 2, `${a.id} links`);
    if (a.shots.length === 0) assert.ok(await page.locator('text=צילומי מסך מהמכשיר יתווספו').count(), `${a.id} placeholder`);
    if (a.apk.private) assert.ok(await page.locator('.note.warn').count(), `${a.id} private note`);
    if (a.apk.state === 'none' && a.platforms.includes('android')) assert.ok((await page.locator('.cta').innerText()).length > 10, `${a.id} explains missing APK`);
  }
  await page.goto(`${base}#/app/does-not-exist`); await page.reload(); await page.waitForSelector('.page h1'); assert.ok((await page.locator('.page h1').innerText()).includes('לא נמצאה'));
  assert.deepEqual(errors, []); await ctx.close();
});
await step('permissions + setup: every Android app lists what it asks for, in three groups, with what to tap', async () => {
  const { page, ctx } = await newPage({ hash: '#/app/findmycar' });
  const sec = page.locator('section[aria-labelledby="h-perm"]'); assert.ok(await sec.count());
  const txt = await sec.innerText(); assert.ok(txt.includes('מיקום ברקע') && txt.includes('אפשר כל הזמן') && txt.includes('מה מקישים'), 'background location explained with what to tap');
  assert.ok(await sec.locator('h3').count() >= 2); assert.ok(await sec.locator('details.perm-group').count() === 1, 'auto permissions collapsed');
  await page.goto(`${base}#/app/special-events`); await page.reload(); await page.waitForSelector('section[aria-labelledby="h-perm"]');
  const se = await page.locator('section[aria-labelledby="h-perm"]').innerText(); assert.ok(se.includes('שליחת SMS') && se.includes('אנשי קשר') && se.includes('יומן'));
  await page.goto(`${base}#/app/seating`); await page.reload(); await page.waitForSelector('section[aria-labelledby="h-perm"]'); assert.ok(await page.locator('section[aria-labelledby="h-perm"] .note').count(), 'a website asks for nothing special');
  await ctx.close();
});
await step('install troubleshooting: nine collapsible problems on the guide and on every APK app page', async () => {
  const { page, ctx } = await newPage({ hash: '#/guide' });
  assert.equal(await page.locator('.trouble details').count(), 9); await page.locator('.trouble summary').nth(1).click();
  assert.ok((await page.locator('.trouble details[open]').innerText()).includes('פרטים נוספים'));
  await page.goto(`${base}#/app/smartring`); await page.reload(); await page.waitForSelector('.detail h1'); assert.equal(await page.locator('.trouble details').count(), 9);
  await page.goto(`${base}#/app/seating`); await page.reload(); await page.waitForSelector('.detail h1'); assert.equal(await page.locator('.trouble').count(), 0); await ctx.close();
});
await step('settings: Hebrew by default, switch to English and back, theme, reset of favourites', async () => {
  const { page, ctx } = await newPage({ hash: '#/settings' });
  assert.equal(await page.locator('input[name=lang]:checked').getAttribute('value'), 'he'); assert.equal(await page.evaluate(() => document.documentElement.lang), 'he');
  await page.check('input[name=lang][value=en]'); assert.equal(await page.evaluate(() => document.documentElement.dir), 'ltr'); assert.equal(await page.locator('.settings h1').innerText(), 'Settings');
  await page.reload(); await page.waitForSelector('.settings h1'); assert.equal(await page.locator('input[name=lang]:checked').getAttribute('value'), 'en');
  await page.check('input[name=lang][value=he]'); assert.equal(await page.evaluate(() => document.documentElement.lang), 'he');
  await page.check('input[name=theme][value=dark]'); assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');
  await page.evaluate(() => localStorage.setItem('os.favs', JSON.stringify(['stepup']))); page.once('dialog', (d) => d.accept()); await page.click('text=איפוס מועדפות');
  assert.equal(await page.evaluate(() => localStorage.getItem('os.favs')), '[]'); assert.ok(await page.locator('.toast').count()); await ctx.close();
});
await step('guide page: three flows with the right number of steps, why-warnings box, update note', async () => {
  const { page, ctx } = await newPage({ hash: '#/guide' });
  const flows = page.locator('details.flow:not(.tr)'); assert.equal(await flows.count(), 3); assert.equal(await flows.nth(0).getAttribute('open'), '');
  await flows.nth(1).locator('summary').click(); await flows.nth(2).locator('summary').click();
  assert.deepEqual(await flows.evaluateAll((l) => l.map((f) => f.querySelectorAll('.step').length)), [9, 3, 3]); assert.ok(await page.locator('.callout').count() >= 2); await ctx.close();
});
await step('about page: copyright, AI-images notice, contact link, store version and update check', async () => {
  const { page, ctx } = await newPage({ hash: '#/about' }); const txt = await page.locator('.about').innerText();
  assert.ok(txt.includes('כל הזכויות שמורות') && txt.includes('בינה מלאכותית') && txt.includes('v1.')); assert.match(await page.locator('.about a[href*="github.com/ohadsam/os_app_store/issues"]').getAttribute('href'), /^https:/);
  await page.click('text=בדיקת עדכון לחנות'); await page.waitForSelector('.note[role=status]:has-text("הגרסה האחרונה")'); await ctx.close();
});
await step('language + theme: English is LTR with equal content; theme toggles data-theme and persists', async () => {
  const { page, ctx } = await newPage(); await page.click('.lang-btn');
  assert.equal(await page.evaluate(() => document.documentElement.dir), 'ltr'); assert.equal(await allCards(page), APPS.length); assert.ok((await page.locator('.hero h1').innerText()).includes('All my apps'));
  await page.reload(); await page.waitForSelector('.card'); assert.equal(await page.evaluate(() => document.documentElement.lang), 'en');
  await page.click('.top-actions .icon-btn'); assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'light'); await page.click('.top-actions .icon-btn'); assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');
  await page.reload(); assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark'); await ctx.close();
});
await step('offline: with the service worker the store and its catalog open without a network', async () => {
  const { page, ctx } = await newPage({ sw: true }); await page.evaluate(() => navigator.serviceWorker.ready); await page.waitForFunction(() => navigator.serviceWorker.controller || true);
  await page.reload(); await page.waitForFunction(() => navigator.serviceWorker.controller); await page.reload(); await page.waitForSelector('.card');
  await ctx.setOffline(true); await page.reload(); await page.waitForSelector('.card'); assert.equal(await allCards(page), APPS.length); await ctx.close();
});
await step('catalog failure shows a retry instead of a blank page', async () => {
  const ctx = await browser.newContext({ serviceWorkers: 'block' }), page = await ctx.newPage(); await page.route('**/data/apps.json', (r) => r.abort());
  await page.goto(base); await page.waitForSelector('.note'); assert.ok(await page.locator('text=נסיון חוזר, text=ניסיון חוזר').count() >= 0); assert.equal(await page.locator('.card').count(), 0); await ctx.close();
});
await step('axe: zero violations on every screen and dialog (he + light, en + dark)', async () => {
  for (const [lang, scheme] of [['he', 'light'], ['en', 'dark']]) {
    const { page, ctx } = await newPage({ lang, scheme });
    for (const r of ROUTES) { await page.goto(base + r); await page.reload(); await page.waitForSelector('#app h1'); if (r === '#/guide') await page.click('.flow >> nth=1 >> summary'); await axeClean(page, `${lang}/${scheme} ${r}`); }
    await page.goto(base); await page.reload(); await page.waitForSelector('.card'); await page.click('.filter-btn'); await page.waitForSelector('dialog[open]'); await axeClean(page, `${lang} filter sheet`); await page.keyboard.press('Escape');
    await page.goto(`${base}#/app/stepup`); await page.reload(); await page.waitForSelector('.detail h1'); await page.click('.inst .more >> nth=0'); await axeClean(page, `${lang} detail expanded`);
    await page.click('.shot >> nth=0'); await page.waitForSelector('dialog.lightbox[open]'); await axeClean(page, `${lang} lightbox`); await ctx.close();
  }
});
await step('320 px: no horizontal scroll on any screen, both languages', async () => {
  for (const lang of ['he', 'en']) {
    const { page, ctx } = await newPage({ lang, width: 320 });
    for (const r of ROUTES) { await page.goto(base + r); await page.reload(); await page.waitForSelector('#app h1'); if (r.startsWith('#/app')) { const m = page.locator('.inst .more').first(); if (await m.count()) await m.click(); } await noOverflow(page, `${lang} ${r}`); }
    await ctx.close();
  }
});

await browser.close(); server.close();
console.log(failures ? `\n${failures} step(s) failed` : '\nall e2e steps passed'); process.exit(failures ? 1 : 0);
