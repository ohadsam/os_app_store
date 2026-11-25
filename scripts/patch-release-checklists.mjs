// Inserts the "update the store" step (docs/APP_RELEASE_STEP.md) into the release checklists of local clones of the other apps. Idempotent.
// Usage: node scripts/patch-release-checklists.mjs <dir with clones> [--dry]   Then commit + push in each repo yourself.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const dir = process.argv[2], dry = process.argv.includes('--dry');
if (!dir) { console.error('usage: node scripts/patch-release-checklists.mjs <dir> [--dry]'); process.exit(2); }
const block = /```\n([\s\S]*?)```/.exec(readFileSync('docs/APP_RELEASE_STEP.md', 'utf8'))[1].trim();
const MARKS = ['## Store - update "OS APPs & Downs"', '## Store - update "OS APPs and Downs"']; // the store was first named with "and"; a repo that has either is already patched
const targets = (d) => ['.claude/skills/release-checklist/SKILL.md', '.claude/skills/app-development/references/release-checklist.md'].map((p) => join(d, p)).filter(existsSync);
for (const repo of readdirSync(dir)) {
  if (repo === 'os_app_store') continue;
  for (const f of targets(join(dir, repo))) {
    const s = readFileSync(f, 'utf8'); if (MARKS.some((m) => s.includes(m))) { console.log('has it:', f); continue; }
    const i = s.search(/^## (Done means|Known limitations)/m), out = i > -1 ? `${s.slice(0, i)}${block}\n\n${s.slice(i)}` : `${s.trimEnd()}\n\n${block}\n`;
    if (!dry) writeFileSync(f, out); console.log(dry ? 'would patch:' : 'patched:', f);
  }
}
