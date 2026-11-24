// Entry point: shell (top bar, nav, footer), hash router, catalog loading, language and theme. Screens live in ui/*.
import { h, setChildren, $ } from './util.js';
import { t, applyLang, setLanguage, getLanguage } from './i18n.js';
import { getTheme, setTheme } from './store.js';
import { normalizeCatalog } from './catalog.js';
import { icon } from './icons.js';
import { registerWorker } from './update.js';
import { homePage } from './ui/home.js';
import { detailPage } from './ui/detail.js';
import { guidePage } from './ui/guide.js';
import { aboutPage } from './ui/about.js';

let catalog = null, offline = false;
async function loadCatalog() {
  try { const r = await fetch('data/apps.json', { cache: 'no-cache' }); if (!r.ok) throw new Error(String(r.status)); catalog = normalizeCatalog(await r.json()); offline = false; }
  catch { offline = !!catalog; if (!catalog) { try { const r = await caches.match('data/apps.json'); if (r) catalog = normalizeCatalog(await r.json()); } catch { /* no cache */ } } }
}
function applyTheme() { const v = getTheme(); if (v === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = v; }
const THEMES = ['auto', 'light', 'dark'];

function shell() {
  const route = (location.hash.slice(1) || '/').split('/')[1] || '';
  const navLink = (href, key, ic, on) => h('a', { class: `nav-link${on ? ' on' : ''}`, href, 'aria-current': on ? 'page' : null }, icon(ic), h('span', null, t(key)));
  const th = getTheme();
  setChildren($('#topbar'),
    h('a', { class: 'brand', href: '#/', 'aria-label': t('app.name') }, h('img', { src: 'icon.svg', alt: '', width: 36, height: 36 }), h('span', { class: 'brand-text' }, h('b', null, t('app.name')), h('small', null, t('app.tag')))),
    h('div', { class: 'top-actions' },
      h('button', { class: 'icon-btn', type: 'button', 'aria-label': `${t('top.theme')}: ${t(`theme.${th}`)}`, title: t(`theme.${th}`), onclick: () => { setTheme(THEMES[(THEMES.indexOf(th) + 1) % 3]); applyTheme(); shell(); } }, icon(th === 'dark' ? 'moon' : 'sun')),
      h('button', { class: 'btn btn-ghost lang-btn', type: 'button', lang: getLanguage() === 'he' ? 'en' : 'he', 'aria-label': t('top.langLabel'), onclick: () => { setLanguage(getLanguage() === 'he' ? 'en' : 'he'); render(); } }, icon('globe'), t('top.lang'))));
  setChildren($('#bottomnav'), navLink('#/', 'nav.store', 'store', route === '' || route === 'app'), navLink('#/guide', 'nav.guide', 'book', route === 'guide'), navLink('#/about', 'nav.about', 'info', route === 'about'));
  setChildren($('#footer'), h('p', null, t('footer.rights', { year: new Date().getFullYear() })), h('p', null, t('footer.ai'), ' ', h('a', { href: '#/about' }, t('footer.about'))));
}

function render() {
  applyLang(); shell();
  const main = $('#app'), parts = (location.hash.slice(1) || '/').split('/');
  if (!catalog) { setChildren(main, h('section', { class: 'page' }, h('p', { class: 'note' }, t('load.error')), h('button', { class: 'btn btn-primary', type: 'button', onclick: boot }, t('retry')))); return; }
  let view;
  if (parts[1] === 'app' && parts[2]) view = detailPage(catalog, parts[2]);
  else if (parts[1] === 'guide') view = guidePage();
  else if (parts[1] === 'about') view = aboutPage(catalog);
  else view = homePage(catalog, render);
  setChildren(main, offline ? h('p', { class: 'note offline' }, t('offline')) : null, view);
  if (!(parts[1] === 'app' && parts[2])) document.title = t('app.title');
}

async function boot() { await loadCatalog(); render(); }
addEventListener('hashchange', () => { render(); scrollTo(0, 0); $('#app').focus({ preventScroll: true }); });
addEventListener('online', () => { if (offline) boot(); });
applyTheme(); registerWorker(); boot();
