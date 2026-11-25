import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { normalizeCatalog, filterApps, sortApps, primaryAction, needsUpdate, platformCounts, tagCounts, daysSince, isRecent, norm } from '../../web/js/catalog.js';

const raw = JSON.parse(readFileSync('web/data/apps.json', 'utf8'));
const cat = normalizeCatalog(raw);

test('apps.json: every app is complete in Hebrew and English with real files behind it', () => {
  assert.ok(raw.apps.length >= 11);
  const ids = new Set();
  for (const a of raw.apps) {
    assert.match(a.id, /^[a-z0-9-]+$/); assert.ok(!ids.has(a.id), `duplicate id ${a.id}`); ids.add(a.id);
    for (const k of ['name', 'tagline', 'description']) { assert.ok(a[k].he?.length > 1 && a[k].en?.length > 1, `${a.id}.${k} needs he + en`); }
    assert.equal(a.highlights.he.length > 0, a.highlights.en.length > 0, `${a.id} highlights in both languages`);
    assert.match(a.version, /^\d+(\.\d+)+$/, `${a.id} version`); assert.match(a.released, /^\d{4}-\d\d-\d\d$/); assert.match(a.updated, /^\d{4}-\d\d-\d\d$/); assert.ok(a.updated >= a.released, `${a.id}: updated before released`);
    assert.ok(existsSync(`web/${a.icon}`), `${a.id} icon missing: ${a.icon}`);
    for (const s of a.shots) { assert.ok(existsSync(`web/${s.file}`), `${a.id} shot missing: ${s.file}`); assert.ok(s.caption.he && s.caption.en, `${a.id} shot caption he+en`); }
    for (const t of a.tags) assert.ok(Object.hasOwn(raw.tags, t), `${a.id} unknown tag ${t}`);
    assert.ok(Object.hasOwn(raw.categories, a.category), `${a.id} unknown category`);
    assert.ok(a.platforms.length && a.platforms.every((p) => ['web', 'pwa', 'android'].includes(p)));
    for (const [k, u] of Object.entries(a.links)) assert.match(u, /^https:\/\/\S+$/, `${a.id}.links.${k}`);
    if (a.platforms.includes('pwa') || a.platforms.includes('web')) assert.ok(a.links.web, `${a.id} needs a web link`);
    if (a.platforms.includes('android')) { assert.ok(a.apk.pkg, `${a.id} needs the package id`); if (a.apk.state === 'direct') assert.match(a.links.apk, /\.apk$/); if (a.apk.state === 'page') assert.ok(a.links.releases); if (a.apk.state === 'none') assert.ok(a.apk.note.he && a.apk.note.en, `${a.id} explain why there is no APK`); }
    else assert.equal(a.apk.state, 'none');
    assert.ok(a.source?.repo && a.source.file && new RegExp(a.source.regex), `${a.id} needs a sync source`);
    if (a.source.changelog) assert.match(a.source.heading, /\{v\}/);
  }
  for (const [k, v] of Object.entries({ ...raw.tags, ...raw.categories })) assert.ok(v.he && v.en, `${k} he+en`);
});
test('normalizeCatalog keeps every valid app and drops unsafe data', () => {
  assert.equal(cat.apps.length, raw.apps.length);
  const bad = normalizeCatalog({ tags: {}, categories: { tools: { he: 'a', en: 'b', icon: 'x' } }, apps: [{ id: 'Bad ID' }, { id: 'ok', name: { he: 'א‮', en: 'a' }, links: { web: 'javascript:alert(1)', apk: 'http://x.y/a.apk' }, shots: [{ file: '../../etc/passwd' }], tags: ['nope'], color: 'red' }] });
  assert.equal(bad.apps.length, 1); const a = bad.apps[0];
  assert.equal(a.links.web, null); assert.equal(a.links.apk, null); assert.equal(a.shots.length, 0); assert.deepEqual(a.tags, []); assert.equal(a.color, '#4f46e5'); assert.ok(!a.name.he.includes('‮'));
});
test('search is case-, niqqud- and quote-insensitive across names, taglines, tags and categories, in both languages', () => {
  const find = (q, extra = {}) => filterApps(cat.apps, { q, ...extra }, cat).map((a) => a.id);
  assert.ok(find('stepup').includes('stepup')); assert.ok(find('STEPUP').includes('stepup'));
  assert.ok(find('תהילים').includes('tehilim')); assert.ok(find('תְּהִילִּים').includes('tehilim'));
  assert.ok(find('seating').includes('seating')); assert.ok(find('הושבה').includes('seating'));
  assert.ok(find('חניה gps').includes('findmycar')); assert.deepEqual(find('zzzz-nothing'), []);
  assert.ok(find('יומי תורה').length >= 1, 'all words must match, any order');
});
test('filters: platform, category, tags (AND), favourites', () => {
  const ids = (f) => filterApps(cat.apps, f, cat).map((a) => a.id);
  assert.ok(ids({ platform: 'android' }).every((id) => cat.apps.find((a) => a.id === id).platforms.includes('android')));
  assert.ok(ids({ platform: 'web' }).includes('seating') && !ids({ platform: 'web' }).includes('smartring'));
  assert.deepEqual(ids({ category: 'faith' }).sort(), ['kodesh', 'tehilim']);
  assert.ok(ids({ tags: new Set(['hebrew-calendar', 'widget']) }).every((id) => { const a = cat.apps.find((x) => x.id === id); return a.tags.includes('widget') && a.tags.includes('hebrew-calendar'); }));
  assert.deepEqual(ids({ onlyFavs: true, favs: new Set(['stepup']) }), ['stepup']); assert.deepEqual(ids({ onlyFavs: true, favs: new Set() }), []);
  const c = platformCounts(cat.apps); assert.equal(c.all, cat.apps.length); assert.ok(c.web > 0 && c.android > 0);
  assert.ok(tagCounts(cat.apps).get('offline') >= 2);
});
test('sorting: recently updated (default), newest, by name; stable and language aware', () => {
  const up = sortApps(cat.apps, 'updated', 'en'); for (let i = 1; i < up.length; i++) assert.ok(up[i - 1].updated >= up[i].updated);
  const nw = sortApps(cat.apps, 'new', 'en'); for (let i = 1; i < nw.length; i++) assert.ok(nw[i - 1].released >= nw[i].released);
  const nm = sortApps(cat.apps, 'name', 'en').map((a) => a.name.en); assert.deepEqual(nm, [...nm].sort((a, b) => a.localeCompare(b, 'en')));
  assert.notEqual(up, cat.apps, 'does not mutate the input');
});
test('primary action, update badge and recency', () => {
  const by = (id) => cat.apps.find((a) => a.id === id);
  assert.equal(primaryAction(by('stepup')), 'open'); assert.equal(primaryAction(by('special-events')), 'download'); assert.equal(primaryAction(by('clockwise')), 'download'); assert.equal(primaryAction({ links: { web: null }, apk: { state: 'page' } }), 'releases'); assert.equal(primaryAction(by('file-manager')), 'details');
  assert.equal(needsUpdate(by('stepup'), { stepup: '0.1.0' }), true); assert.equal(needsUpdate(by('stepup'), { stepup: by('stepup').version }), false); assert.equal(needsUpdate(by('stepup'), {}), false);
  const day = Date.parse('2026-11-24T12:00:00Z'); assert.equal(daysSince('2026-11-22', day), 2); assert.equal(isRecent({ updated: '2026-11-20' }, day), true); assert.equal(isRecent({ updated: '2026-09-01' }, day), false);
  assert.equal(norm('שָׁלוֹם "א"'), 'שלום א');
});
test('the AI-made store art is complete: every art pair, category icon and hero exists and is clean SVG', () => {
  const files = [...['states/no-results', 'states/offline', 'states/load-error', 'states/coming-soon', 'install/download', 'install/allow-once', 'install/done'].flatMap((n) => [`${n}-light`, `${n}-dark`]), 'home/hero-light', 'home/hero-dark', 'bg/bg-light', 'bg/bg-dark', ...Object.keys(raw.categories).map((c) => `categories/cat-${c}`)];
  for (const f of files) { const p = `web/art/store/${f}.svg`; assert.ok(existsSync(p), p); const s = readFileSync(p, 'utf8'); assert.ok(s.length < 12000, `${p} too big`); assert.ok(!/<(text|image|filter|style|script|foreignObject)\b/i.test(s), `${p} has a forbidden element`); assert.ok(!/(href|url)\(?=?["']?https?:/i.test(s), `${p} references the network`); }
});

test('permissions: a documented dictionary, valid ids per app, and a reason for every prompt', () => {
  for (const [id, v] of Object.entries(raw.permissions)) { assert.ok(['ask', 'special', 'auto'].includes(v.level), `${id} level`); for (const k of ['name', 'what', 'how']) assert.ok(v[k].he?.length > 2 && v[k].en?.length > 2, `permission ${id}.${k} he+en`); }
  for (const a of raw.apps) {
    assert.ok(Array.isArray(a.permissions), `${a.id} permissions list`);
    for (const p of a.permissions) {
      assert.ok(Object.hasOwn(raw.permissions, p.id), `${a.id} unknown permission ${p.id}`); const level = raw.permissions[p.id].level;
      if (level !== 'auto') assert.ok((p.why?.he || '').length > 5 && (p.why?.en || '').length > 5, `${a.id}/${p.id} needs a reason in both languages`);
    }
    assert.equal(new Set(a.permissions.map((p) => p.id)).size, a.permissions.length, `${a.id} duplicate permission`);
    assert.equal(a.setup.he.length, a.setup.en.length, `${a.id} setup notes in both languages`);
  }
  const by = (id) => cat.apps.find((a) => a.id === id);
  assert.ok(by('findmycar').permissions.some((p) => p.id === 'background_location')); assert.ok(by('special-events').permissions.some((p) => p.id === 'sms'));
  assert.equal(cat.apps.length, raw.apps.length); assert.ok(Object.keys(cat.permissions).length >= 15);
  const bad = normalizeCatalog({ categories: { tools: { he: 'a', en: 'b', icon: 'x' } }, permissions: { ok: { level: 'weird', name: { he: 'א', en: 'a' } } }, apps: [{ id: 'x', permissions: [{ id: 'nope' }, { id: 'ok', why: { he: 'ש', en: 's' } }] }] });
  assert.deepEqual(bad.apps[0].permissions.map((p) => p.id), ['ok']); assert.equal(bad.permissions.ok.level, 'ask');
});
