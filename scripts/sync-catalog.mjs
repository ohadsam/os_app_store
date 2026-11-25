// Keeps web/data/apps.json equal to the real apps: reads each app's version from its repo (GitHub raw, or a local clone), and when it changed
// updates version + updated date + "what's new" (English bullets cut from the app's CHANGELOG; Hebrew is added by hand later).
// Usage: node scripts/sync-catalog.mjs [--local DIR] [--write] [--check] [--id a,b] [--date YYYY-MM-DD]
//   (no flags)  report only;  --write  apply;  --check  exit 1 when anything is out of date (used by the release checklist).
// Private repos need GITHUB_TOKEN / CATALOG_TOKEN with read access; otherwise they are reported as "skipped".
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const FILE = 'web/data/apps.json';
export function extractVersion(text, regex) { const m = new RegExp(regex).exec(text); return m ? m[1] : null; }
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** The bullets of the CHANGELOG section for `version` (heading template like "## v{v}"), cleaned of markdown, max 5 x 200 chars. */
export function extractNotes(changelog, headingTpl, version) {
  if (!changelog || !headingTpl) return [];
  const head = new RegExp(`^${esc(headingTpl).replace('\\{v\\}', esc(version))}(?![\\w])(?!\\.\\d)`);
  const lines = changelog.split(/\r?\n/), out = []; let on = false, cur = null;
  for (const l of lines) {
    if (!on) { on = head.test(l); continue; }
    if (/^## /.test(l)) break;
    const b = /^\s{0,1}[-*] (.*)$/.exec(l);
    if (b) { cur = b[1]; out.push(cur); } else if (cur !== null && /^\s{2,}\S/.test(l)) out[out.length - 1] += ` ${l.trim()}`; else if (!l.trim()) cur = null;
  }
  return out.map((s) => s.replace(/\*\*|`/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean).slice(0, 5).map((s) => (s.length > 200 ? `${s.slice(0, 197)}...` : s));
}
/** Pure: returns { catalog, changes[] } - never touches the disk or the network. `read(app, file)` returns file text or null. */
export function syncCatalog(catalog, read, today) {
  const changes = [], skipped = [];
  for (const app of catalog.apps) {
    const src = app.source; if (!src) continue;
    const text = read(src.repo, src.file);
    if (text == null) { skipped.push(app.id); continue; }
    const v = extractVersion(text, src.regex);
    if (!v) { skipped.push(`${app.id} (version not found)`); continue; }
    if (v === app.version) continue;
    const notes = src.changelog ? extractNotes(read(src.repo, src.changelog), src.heading, v) : [];
    changes.push({ id: app.id, from: app.version, to: v });
    app.version = v; app.updated = today; app.whatsNew = { he: [], en: notes };
  }
  if (changes.length) catalog.generated = today;
  return { catalog, changes, skipped };
}
const arg = (n) => { const i = process.argv.indexOf(n); return i > -1 ? process.argv[i + 1] : null; };
async function main() {
  const local = arg('--local'), write = process.argv.includes('--write'), check = process.argv.includes('--check'), only = (arg('--id') || '').split(',').filter(Boolean);
  const token = process.env.CATALOG_TOKEN || process.env.GITHUB_TOKEN;
  const catalog = JSON.parse(readFileSync(FILE, 'utf8'));
  if (only.length) catalog.apps = catalog.apps.filter((a) => only.includes(a.id));
  const cache = new Map(), dates = new Map();
  // Local mode: `updated` = date of the last commit that touched the version file (docs-only commits must not count as an update).
  async function load(repo, file) {
    const key = `${repo}/${file}`; if (cache.has(key)) return cache.get(key);
    let text = null;
    if (local) { for (const d of [repo, repo.toLowerCase(), `../${repo.toLowerCase()}`]) { const p = join(local, d, file); if (existsSync(p)) { text = readFileSync(p, 'utf8'); if (!dates.has(key)) { try { dates.set(key, execFileSync('git', ['-C', join(local, d), 'log', '-1', '--format=%cs', '--', file], { encoding: 'utf8' }).trim()); } catch { /* no git */ } } break; } } }
    else { try { const r = await fetch(`https://raw.githubusercontent.com/ohadsam/${repo}/main/${file}`, { headers: token ? { authorization: `Bearer ${token}` } : {} }); text = r.ok ? await r.text() : null; } catch { text = null; } }
    cache.set(key, text); return text;
  }
  for (const a of catalog.apps) if (a.source) { await load(a.source.repo, a.source.file); if (a.source.changelog) await load(a.source.repo, a.source.changelog); }
  const today = arg('--date') || new Date().toISOString().slice(0, 10);
  const { changes, skipped } = syncCatalog(catalog, (r, f) => cache.get(`${r}/${f}`) ?? null, today);
  if (local) for (const c of changes) { const app = catalog.apps.find((a) => a.id === c.id), d = dates.get(`${app.source.repo}/${app.source.file}`); if (d) app.updated = d; }
  for (const c of changes) console.log(`${check || !write ? 'OUT OF DATE' : 'updated'}: ${c.id} ${c.from} -> ${c.to}`);
  for (const s of skipped) console.log(`skipped: ${s} (private, offline or moved)`);
  if (!changes.length) console.log('catalog is up to date');
  if (write && changes.length) {
    const full = JSON.parse(readFileSync(FILE, 'utf8'));
    for (const c of changes) { const src = catalog.apps.find((a) => a.id === c.id), dst = full.apps.find((a) => a.id === c.id); Object.assign(dst, { version: src.version, updated: src.updated, whatsNew: src.whatsNew }); }
    full.generated = today; writeFileSync(FILE, `${JSON.stringify(full, null, 1)}\n`); console.log(`wrote ${FILE}`);
  }
  if (check && changes.length) process.exit(1);
}
if (import.meta.url === `file://${process.argv[1]}`) await main();
