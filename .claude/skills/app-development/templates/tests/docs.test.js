import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const ctx = readFileSync('docs/CONTEXT.md', 'utf8');

test('docs/CONTEXT.md lists every web, script, test and Android source file (keep the file map current)', () => {
  const files = [...walk('web/js'), ...walk('scripts').filter((f) => f.endsWith('.mjs')), ...walk('tests').filter((f) => /\.(m?js)$/.test(f)), ...walk('android/app/src').filter((f) => f.endsWith('.kt'))];
  const missing = files.map((f) => basename(f)).filter((n) => !ctx.includes(n));
  assert.deepEqual(missing, [], 'add these to the file map in docs/CONTEXT.md');
});
test('CLAUDE.md points to the context file', () => { assert.match(readFileSync('CLAUDE.md', 'utf8'), /docs\/CONTEXT\.md/); });
