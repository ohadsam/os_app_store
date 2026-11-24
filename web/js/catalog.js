// Pure catalog logic: normalise the JSON, search, filter, sort, facets. No DOM, no storage - time and language are passed in.
export const PLATFORMS = ['web', 'pwa', 'android'];
const str = (v, max = 600) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f‎‏‪-‮⁦-⁩]/g, '').slice(0, max) : '');
const loc = (o, max) => ({ he: str(o?.he, max), en: str(o?.en, max) });
const locList = (o) => ({ he: (o?.he || []).slice(0, 12).map((s) => str(s, 240)), en: (o?.en || []).slice(0, 12).map((s) => str(s, 240)) });
const httpsOrNull = (u) => (typeof u === 'string' && /^https:\/\/[^\s]+$/.test(u) ? u : null);
const date = (d) => (/^\d{4}-\d{2}-\d{2}$/.test(d) ? d : '');

export function normalizeCatalog(raw) {
  const tags = {}, cats = {};
  for (const [k, v] of Object.entries(raw?.tags || {})) tags[k] = loc(v, 40);
  for (const [k, v] of Object.entries(raw?.categories || {})) cats[k] = { ...loc(v, 40), icon: str(v?.icon, 4) };
  const apps = (raw?.apps || []).filter((a) => /^[a-z0-9-]{1,40}$/.test(a?.id || '')).map((a) => ({
    id: a.id, name: loc(a.name, 60), tagline: loc(a.tagline, 140), description: loc(a.description, 900),
    highlights: locList(a.highlights), whatsNew: locList(a.whatsNew),
    platforms: (a.platforms || []).filter((p) => PLATFORMS.includes(p)),
    category: Object.hasOwn(cats, a.category) ? a.category : 'tools',
    tags: (a.tags || []).filter((t) => Object.hasOwn(tags, t)).slice(0, 8),
    version: str(a.version, 30), released: date(a.released), updated: date(a.updated), status: ['stable', 'beta'].includes(a.status) ? a.status : 'stable',
    icon: str(a.icon, 80), color: /^#[0-9a-fA-F]{6}$/.test(a.color || '') ? a.color : '#4f46e5',
    links: { web: httpsOrNull(a.links?.web), apk: httpsOrNull(a.links?.apk), sha: httpsOrNull(a.links?.sha), releases: httpsOrNull(a.links?.releases), repo: httpsOrNull(a.links?.repo), changelog: httpsOrNull(a.links?.changelog), guide: httpsOrNull(a.links?.guide) },
    apk: { state: ['direct', 'page', 'none'].includes(a.apk?.state) ? a.apk.state : 'none', pkg: str(a.apk?.pkg, 80), minAndroid: Number.isInteger(a.apk?.minAndroid) ? a.apk.minAndroid : 8, private: a.apk?.private === true, note: loc(a.apk?.note, 300) },
    shots: (a.shots || []).slice(0, 8).map((s) => ({ file: str(s.file, 80), caption: loc(s.caption, 80) })).filter((s) => /^art\/shots\/[a-z0-9-]+\/[\w.-]+\.(jpg|png|webp)$/.test(s.file)),
  }));
  return { generated: date(raw?.generated), tags, categories: cats, apps };
}

const strip = (s) => s.toLowerCase().replace(/[֑-ׇ]/g, '').replace(/["'׳״`]/g, '');
export const norm = strip;
export function haystack(app, cat, tagDict) {
  return strip([app.id, app.name.he, app.name.en, app.tagline.he, app.tagline.en, app.description.he, app.description.en, cat?.[app.category]?.he, cat?.[app.category]?.en, ...app.platforms,
    ...app.tags.flatMap((t) => [tagDict[t]?.he, tagDict[t]?.en])].join(' '));
}
/** filters: { q, platform: 'all'|'web'|'android', category: ''|id, tags: Set, onlyFavs, favs: Set } */
export function filterApps(apps, filters, catalog) {
  const words = strip(filters.q || '').split(/\s+/).filter(Boolean);
  return apps.filter((a) => {
    if (filters.platform === 'web' && !a.platforms.some((p) => p === 'web' || p === 'pwa')) return false;
    if (filters.platform === 'android' && !a.platforms.includes('android')) return false;
    if (filters.category && a.category !== filters.category) return false;
    if (filters.tags?.size && ![...filters.tags].every((t) => a.tags.includes(t))) return false;
    if (filters.onlyFavs && !filters.favs?.has(a.id)) return false;
    if (words.length) { const hs = haystack(a, catalog.categories, catalog.tags); if (!words.every((w) => hs.includes(w))) return false; }
    return true;
  });
}
export function sortApps(apps, mode, lang) {
  const byName = (a, b) => a.name[lang].localeCompare(b.name[lang], lang);
  const list = [...apps];
  if (mode === 'name') return list.sort(byName);
  if (mode === 'new') return list.sort((a, b) => b.released.localeCompare(a.released) || byName(a, b));
  return list.sort((a, b) => b.updated.localeCompare(a.updated) || byName(a, b)); // 'updated' (default)
}
export const daysSince = (ymd, now = Date.now()) => (ymd ? Math.floor((now - Date.parse(`${ymd}T12:00:00Z`)) / 86400000) : Infinity);
export const isRecent = (app, now) => daysSince(app.updated, now) <= 14;
export function tagCounts(apps) { const m = new Map(); for (const a of apps) for (const t of a.tags) m.set(t, (m.get(t) || 0) + 1); return m; }
export function platformCounts(apps) {
  return { all: apps.length, web: apps.filter((a) => a.platforms.some((p) => p === 'web' || p === 'pwa')).length, android: apps.filter((a) => a.platforms.includes('android')).length };
}
/** What the main button does for an app: open the web app, or download/get the APK. */
export function primaryAction(app) {
  if (app.links.web) return 'open';
  if (app.apk.state === 'direct') return 'download';
  if (app.apk.state === 'page') return 'releases';
  return 'details';
}
export const needsUpdate = (app, installed) => !!installed[app.id] && installed[app.id] !== app.version;
