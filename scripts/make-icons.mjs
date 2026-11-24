// Renders web/icon.svg to the PNG icons the manifest needs (192, 512, maskable 512 with safe-zone padding). Run after changing icon.svg.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
const svg = readFileSync('web/icon.svg', 'utf8').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const browser = await chromium.launch(), page = await browser.newPage();
async function render(size, file, { maskable = false } = {}) {
  const inner = maskable ? `<rect width="512" height="512" fill="#4f46e5"/><g transform="translate(51 51) scale(.8)">${svg}</g>` : svg; // maskable: full-bleed background, art inside the 80% safe zone
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<body style="margin:0;background:transparent"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">${inner}</svg></body>`);
  writeFileSync(file, await page.screenshot({ type: 'png', omitBackground: true })); console.log(file);
}
await render(192, 'web/icons/icon-192.png'); await render(512, 'web/icons/icon-512.png'); await render(512, 'web/icons/icon-maskable-512.png', { maskable: true });
await browser.close();
