// Per-device preferences (language, theme, saved apps, versions the person marked installed). localStorage with a memory fallback;
// everything is sanitised on read. Must not touch the DOM.
const mem = new Map();
const get = (k) => { try { return localStorage.getItem(`os.${k}`); } catch { return mem.get(k) ?? null; } };
const set = (k, v) => { try { localStorage.setItem(`os.${k}`, v); } catch { mem.set(k, v); } };
const readJson = (k, fallback) => { try { const v = JSON.parse(get(k)); return v && typeof v === 'object' ? v : fallback; } catch { return fallback; } };

export const getLang = () => (get('lang') === 'en' ? 'en' : 'he');
export const setLang = (l) => set('lang', l === 'en' ? 'en' : 'he');
export const getTheme = () => { const v = get('theme'); return v === 'light' || v === 'dark' ? v : 'auto'; };
export const setTheme = (v) => set('theme', v === 'light' || v === 'dark' ? v : 'auto');

const idOk = (s) => typeof s === 'string' && /^[a-z0-9-]{1,40}$/.test(s);
export const getFavs = () => { const a = readJson('favs', []); return new Set((Array.isArray(a) ? a : []).filter(idOk)); };
export function toggleFav(id) { const f = getFavs(); if (f.has(id)) f.delete(id); else f.add(id); set('favs', JSON.stringify([...f])); return f.has(id); }

export function getInstalled() {
  const o = readJson('installed', {}), out = {};
  for (const k of Object.keys(o)) if (idOk(k) && typeof o[k] === 'string' && /^[\w.+-]{1,30}$/.test(o[k])) out[k] = o[k];
  return out;
}
export function setInstalled(id, version) { const o = getInstalled(); if (version) o[id] = version; else delete o[id]; set('installed', JSON.stringify(o)); }

/** Forget the per-device favourites and the "I installed" marks (language and theme are kept). */
export function clearUserData() { set('favs', '[]'); set('installed', '{}'); }
