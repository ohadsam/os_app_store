// Store self-update: refresh the service worker, then reload once when the new one takes over. Browser only (no native shell).
import { APP_VERSION } from './appVersion.js';
export async function fetchLatestVersion() {
  try { const r = await fetch('version.json', { cache: 'no-store' }); if (!r.ok) return null; const v = await r.json(); return typeof v.version === 'string' ? v.version : null; } catch { return null; }
}
export const isNewer = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
/** Returns 'latest' | 'updating' | 'failed'. On 'updating' the page reloads itself when the new worker is active. */
export async function checkForUpdate() {
  const latest = await fetchLatestVersion(); if (!latest) return { state: 'failed' };
  if (!isNewer(latest, APP_VERSION)) return { state: 'latest', version: latest };
  try { const reg = await navigator.serviceWorker?.getRegistration(); await reg?.update(); } catch { /* offline */ }
  setTimeout(() => location.reload(), 10000); // safety net if controllerchange never fires
  return { state: 'updating', version: latest };
}
export function registerWorker() {
  if (!('serviceWorker' in navigator)) return;
  const had = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js').catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    try { if (!had || sessionStorage.getItem('os.swReload')) return; sessionStorage.setItem('os.swReload', '1'); } catch { return; }
    location.reload();
  });
}
