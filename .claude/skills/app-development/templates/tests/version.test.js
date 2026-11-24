import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ver = JSON.parse(readFileSync('web/version.json', 'utf8'));
test('version.json, package.json and the service worker agree', () => {
  assert.match(ver.version, /^\d+\.\d+\.\d+$/); assert.ok(Number.isInteger(ver.versionCode) && ver.versionCode >= 1);
  assert.equal(JSON.parse(readFileSync('package.json', 'utf8')).version, ver.version);
  assert.match(readFileSync('web/js/appVersion.js', 'utf8'), new RegExp(`APP_VERSION = '${ver.version.replaceAll('.', '\\.')}'`));
  assert.match(readFileSync('web/sw.js', 'utf8'), new RegExp(`const VERSION = '${ver.version.replaceAll('.', '\\.')}'`));
});
test('CHANGELOG has an entry for the running version (the release notes are cut from it)', () => {
  assert.ok(readFileSync('docs/CHANGELOG.md', 'utf8').includes(`## ${ver.version}\n`), `docs/CHANGELOG.md needs "## ${ver.version}"`);
});
test('the user guide exists', () => { assert.ok(readFileSync('docs/USER_GUIDE.md', 'utf8').length > 0); });
