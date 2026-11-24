import test from 'node:test';
import assert from 'node:assert/strict';
import { extractVersion, extractNotes, syncCatalog } from '../../scripts/sync-catalog.mjs';
import { isNewer } from '../../web/js/update.js';
import { waLink } from '../../web/js/share.js';

test('extractVersion reads the version from each kind of source file', () => {
  assert.equal(extractVersion('{"version":"0.31.3","versionCode":43}', '"version"\\s*:\\s*"([^"]+)"'), '0.31.3');
  assert.equal(extractVersion('versionName = "0.33.0"', 'versionName\\s*=\\s*"([^"]+)"'), '0.33.0');
  assert.equal(extractVersion("const APP_VERSION = '5.146';", "APP_VERSION\\s*=\\s*'([^']+)'"), '5.146'); assert.equal(extractVersion('nothing', 'x(\\d)'), null);
});
const LOG = '# Changelog\n\n## v1.15.0 (2026-11-23)\n\n### Title\n\n- **Check** for `updates`\n  continues here\n- Second bullet\n\n## v1.1.0 (2026-01-01)\n- old\n';
test('extractNotes cuts the right section, cleans markdown, ignores look-alike versions', () => {
  assert.deepEqual(extractNotes(LOG, '## v{v}', '1.15.0'), ['Check for updates continues here', 'Second bullet']);
  assert.deepEqual(extractNotes(LOG, '## v{v}', '1.1.0'), ['old']); assert.deepEqual(extractNotes(LOG, '## v{v}', '1.15'), []); assert.deepEqual(extractNotes(LOG, '## v{v}', '9.9.9'), []);
  assert.deepEqual(extractNotes('## [1.2.0] — d\n- a\n', '## [{v}]', '1.2.0'), ['a']);
});
test('syncCatalog updates only changed apps, sets date + notes, and reports skipped sources', () => {
  const mk = () => ({ generated: '2026-01-01', apps: [{ id: 'a', version: '1.0.0', updated: '2026-01-01', whatsNew: { he: ['x'], en: ['x'] }, source: { repo: 'ra', file: 'v', regex: 'v=(\\S+)', changelog: 'c', heading: '## {v}' } }, { id: 'b', version: '2.0.0', source: { repo: 'rb', file: 'v', regex: 'v=(\\S+)' } }, { id: 'c', version: '1', source: { repo: 'rc', file: 'v', regex: 'v=(\\S+)' } }] });
  const files = { 'ra/v': 'v=1.1.0', 'ra/c': '## 1.1.0\n- new thing\n', 'rb/v': 'v=2.0.0' };
  const r = syncCatalog(mk(), (repo, f) => files[`${repo}/${f}`] ?? null, '2026-11-24');
  assert.deepEqual(r.changes, [{ id: 'a', from: '1.0.0', to: '1.1.0' }]); assert.deepEqual(r.skipped, ['c']);
  const a = r.catalog.apps[0]; assert.equal(a.version, '1.1.0'); assert.equal(a.updated, '2026-11-24'); assert.deepEqual(a.whatsNew, { he: [], en: ['new thing'] }); assert.equal(r.catalog.apps[1].updated, undefined); assert.equal(r.catalog.generated, '2026-11-24');
  assert.deepEqual(syncCatalog(r.catalog, (repo, f) => files[`${repo}/${f}`] ?? null, '2026-11-25').changes, []);
});
test('store self-update compares versions numerically; share links are encoded', () => {
  assert.equal(isNewer('1.10.0', '1.9.0'), true); assert.equal(isNewer('1.0.0', '1.0.0'), false); assert.equal(isNewer('0.9.9', '1.0.0'), false);
  assert.ok(waLink('a b&c').startsWith('https://wa.me/?text=a%20b%26c'));
});
