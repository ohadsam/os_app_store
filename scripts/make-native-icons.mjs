// Renders the adaptive launcher icons of the native Android apps (vector drawables) to standalone SVGs for the store.
// Usage: APPS_DIR=/path/to/clones node scripts/make-native-icons.mjs   (each app: where its res/ lives + its background colour source)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const DIR = process.env.APPS_DIR || '/home/user/ohadsam';
const APPS = { // id -> [repo dir, res dir, background colour (hex) | 'drawable' to render ic_launcher_background.xml]
  'special-events': ['special_events', 'app/src/main/res', 'drawable'],
  clockwise: ['clock_weather_widget', 'app/src/main/res', '#0B2A3C'],
  smartring: ['smart_alarm_clock', 'app/src/main/res', '#0A0C10'],
  'file-manager': ['ExtendedFileManager', 'app/src/main/res', 'drawable'],
  tehilim: ['../tehilim_daily', 'app/src/main/res', '#14213D'],
};
const color = (c) => { const m = /^#([0-9a-f]{8})$/i.exec(c); return m ? { fill: `#${m[1].slice(2)}`, op: parseInt(m[1].slice(0, 2), 16) / 255 } : { fill: c, op: 1 }; };
function pathsOf(xml, gradId) {
  const out = []; let defs = '';
  const gm = /<gradient[^>]*android:endX="([\d.]+)"[^>]*android:endY="([\d.]+)"[\s\S]*?<item android:color="(#[0-9a-fA-F]+)"[^>]*\/>\s*<item android:color="(#[0-9a-fA-F]+)"/.exec(xml);
  if (gm) defs = `<linearGradient id="${gradId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${gm[1]}" y2="${gm[2]}"><stop offset="0" stop-color="${color(gm[3]).fill}"/><stop offset="1" stop-color="${color(gm[4]).fill}"/></linearGradient>`;
  for (const m of xml.matchAll(/<path\b([^>]*?)\/?>/g)) {
    const d = /android:pathData="([^"]+)"/.exec(m[1])?.[1]; if (!d) continue;
    const c = /android:fillColor="([^"]+)"/.exec(m[1])?.[1];
    if (c) { const k = color(c); out.push(`<path d="${d}" fill="${k.fill}"${k.op < 1 ? ` fill-opacity="${k.op.toFixed(2)}"` : ''}/>`); } else if (gm) out.push(`<path d="${d}" fill="url(#${gradId})"/>`);
  }
  return { body: out.join(''), defs };
}
for (const [id, [repo, res, bg]] of Object.entries(APPS)) {
  const base = join(DIR, repo, res, 'drawable');
  const fg = pathsOf(readFileSync(join(base, 'ic_launcher_foreground.xml'), 'utf8'), `g-${id}`);
  let back = { body: '', defs: '' };
  if (bg === 'drawable' && existsSync(join(base, 'ic_launcher_background.xml'))) back = pathsOf(readFileSync(join(base, 'ic_launcher_background.xml'), 'utf8'), `b-${id}`);
  else back.body = `<rect width="108" height="108" fill="${bg}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="9 9 90 90"><defs>${back.defs}${fg.defs}<clipPath id="c-${id}"><rect x="9" y="9" width="90" height="90" rx="20"/></clipPath></defs><g clip-path="url(#c-${id})">${back.body}${fg.body}</g></svg>\n`;
  writeFileSync(`web/art/icons/${id}.svg`, svg); console.log('icon', id);
}
