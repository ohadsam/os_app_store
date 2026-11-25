import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const ctx = readFileSync('docs/CONTEXT.md', 'utf8');

test('docs/CONTEXT.md lists every web, script and test source file (keep the file map current)', () => {
  const files = [...walk('web/js'), ...walk('scripts'), ...walk('tests').filter((f) => /\.(m?js)$/.test(f))];
  const missing = files.map((f) => basename(f)).filter((n) => !ctx.includes(n));
  assert.deepEqual(missing, [], 'add these to the file map in docs/CONTEXT.md');
});
test('CLAUDE.md points to the context file and the release checklist', () => {
  const c = readFileSync('CLAUDE.md', 'utf8'); assert.match(c, /docs\/CONTEXT\.md/); assert.match(c, /release-checklist/);
});
test('the release checklist covers the catalog sync step and the other apps know how to update the store', () => {
  assert.match(readFileSync('.claude/skills/release-checklist/SKILL.md', 'utf8'), /sync-catalog/);
  assert.match(readFileSync('docs/APP_RELEASE_STEP.md', 'utf8'), /OS APPs & Downs/);
});
