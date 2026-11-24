import test from 'node:test';
import assert from 'node:assert/strict';
import { getFavs, toggleFav, getInstalled, setInstalled, getLang, setLang, getTheme, setTheme } from '../../web/js/store.js';

test('preferences work with storage blocked (memory fallback) and are sanitised', () => {
  assert.equal(getLang(), 'he'); setLang('en'); assert.equal(getLang(), 'en'); setLang('xx'); assert.equal(getLang(), 'he');
  assert.equal(getTheme(), 'auto'); setTheme('dark'); assert.equal(getTheme(), 'dark'); setTheme('purple'); assert.equal(getTheme(), 'auto');
  assert.equal(toggleFav('stepup'), true); assert.ok(getFavs().has('stepup')); assert.equal(toggleFav('stepup'), false); assert.equal(getFavs().size, 0);
  setInstalled('stepup', '0.31.3'); assert.deepEqual(getInstalled(), { stepup: '0.31.3' }); setInstalled('stepup', null); assert.deepEqual(getInstalled(), {});
});
