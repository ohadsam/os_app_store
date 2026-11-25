import test from 'node:test';
import assert from 'node:assert/strict';
import { STRINGS, t } from '../../web/js/i18n.js';
import { FLOWS } from '../../web/js/ui/guide.js';
import { MOCK_KINDS } from '../../web/js/ui/mock.js';

const ph = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
test('Hebrew and English have exactly the same keys and {placeholders}', () => {
  const he = Object.keys(STRINGS.he).sort(), en = Object.keys(STRINGS.en).sort();
  assert.deepEqual(he, en, 'key mismatch');
  for (const k of he) { assert.ok(STRINGS.he[k].length && STRINGS.en[k].length, `${k} empty`); assert.equal(ph(STRINGS.he[k]), ph(STRINGS.en[k]), `placeholders differ in ${k}`); }
});
test('every install-guide step has a title, a description and an existing illustration', () => {
  for (const [flow, list] of Object.entries(FLOWS)) for (const [key, kind] of list) { assert.ok(STRINGS.he[`${key}.t`] && STRINGS.he[`${key}.d`], `${flow}/${key} text`); assert.ok(MOCK_KINDS.includes(kind), `${flow}/${key} unknown mock ${kind}`); }
});
test('t() fills placeholders and falls back to the key', () => {
  assert.equal(t('card.version', { v: '1.2' }), 'גרסה 1.2'); assert.equal(t('no.such.key'), 'no.such.key');
});
test('no hard-coded Latin-only user text in Hebrew strings except brand/technical words', () => {
  for (const [k, v] of Object.entries(STRINGS.he)) if (!/[֐-׿]/.test(v)) assert.match(v, /^(EN|English|PWA|APK|OS APPs & Downs|\{[a-z]+\}|Safari|Chrome)$/, `${k} looks untranslated: ${v}`);
});
