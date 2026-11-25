// Store front: search, platform chips, filter sheet, "recently updated" strip and the app grid. Filter state lives in the URL-less `state` object.
import { h, setChildren, announce, toast } from '../util.js';
import { t, loc, getLanguage } from '../i18n.js';
import { icon } from '../icons.js';
import { filterApps, sortApps, platformCounts, tagCounts, isRecent } from '../catalog.js';
import { getFavs, toggleFav, getInstalled } from '../store.js';
import { card } from './card.js';
import { art } from './art.js';

export const state = { q: '', platform: 'all', category: '', tags: new Set(), onlyFavs: false, sort: 'updated' };
const activeCount = () => (state.category ? 1 : 0) + state.tags.size + (state.onlyFavs ? 1 : 0) + (state.sort !== 'updated' ? 1 : 0);

export function homePage(catalog, rerender) {
  const root = h('section', { class: 'page home' });
  const results = h('div', { class: 'results' });
  const cats = h('section', { class: 'cats', 'aria-labelledby': 'h-cats' });
  const chips = h('div', { class: 'chips', role: 'group', 'aria-label': t('nav.store') });
  const filterBtn = h('button', { class: 'btn btn-ghost filter-btn', type: 'button', onclick: () => openFilters(catalog, () => { paint(); }) });
  const input = h('input', { class: 'search-input', type: 'search', id: 'q', placeholder: t('search.ph'), 'aria-label': t('search.label'), autocomplete: 'off', value: state.q, oninput: (e) => { state.q = e.target.value; paintResults(); } });
  const clear = h('button', { class: 'icon-btn search-clear', type: 'button', 'aria-label': t('search.clear'), onclick: () => { state.q = ''; input.value = ''; paintResults(); input.focus(); } }, icon('close'));

  function paintCats() {
    setChildren(cats, h('h2', { id: 'h-cats', class: 'sec' }, t('home.byCat')), h('div', { class: 'cat-row' }, Object.entries(catalog.categories).map(([k, v]) => {
      const on = state.category === k;
      return h('button', { class: `cat-btn${on ? ' on' : ''}`, type: 'button', 'aria-pressed': on ? 'true' : 'false', onclick: () => { state.category = on ? '' : k; paint(); } },
        h('img', { src: `art/store/badges/badge-${k}.svg`, alt: '', width: 48, height: 48, loading: 'lazy' }), h('span', null, loc(v)));
    })));
  }
  function paintChips() {
    const c = platformCounts(catalog.apps);
    setChildren(chips, ['all', 'web', 'android'].map((p) => h('button', { class: `chip${state.platform === p ? ' on' : ''}`, type: 'button', 'aria-pressed': state.platform === p ? 'true' : 'false', onclick: () => { state.platform = p; paint(); } }, t(`plat.${p}`), h('span', { class: 'chip-n' }, c[p]))));
    setChildren(filterBtn, icon('filter'), t('filter.open'), activeCount() ? h('span', { class: 'chip-n on' }, activeCount()) : null);
  }
  function paintResults() {
    clear.hidden = !state.q;
    const favs = getFavs(), installed = getInstalled(), lang = getLanguage();
    const list = sortApps(filterApps(catalog.apps, { ...state, favs }, catalog), state.sort, lang);
    const filtering = state.q || state.platform !== 'all' || state.category || state.tags.size || state.onlyFavs;
    const onFav = (id) => { const on = toggleFav(id); toast(t(on ? 'toast.saved' : 'toast.removed')); paintResults(); };
    const grid = (apps) => h('div', { class: 'grid' }, apps.map((a) => card(a, { favs, installed, onFav })));
    const recent = !filtering ? sortApps(catalog.apps, 'updated', lang).filter((a) => isRecent(a, Date.now())).slice(0, 4) : [];
    setChildren(results,
      recent.length ? h('section', { 'aria-labelledby': 'h-recent' }, h('h2', { id: 'h-recent', class: 'sec' }, t('home.recent')), grid(recent)) : null,
      h('section', { 'aria-labelledby': 'h-all' }, h('div', { class: 'sec-row' }, h('h2', { id: 'h-all', class: 'sec' }, t('home.all')), h('span', { class: 'muted' }, list.length === 1 ? t('home.count1') : t('home.count', { n: list.length }))),
        list.length ? grid(list) : h('div', { class: 'empty' }, art('states/no-results', { w: 180, h: 135 }), h('b', null, t('home.none')), h('p', null, t('home.noneHint')), h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => { Object.assign(state, { q: '', platform: 'all', category: '', onlyFavs: false, sort: 'updated' }); state.tags.clear(); rerender(); } }, t('filter.clear')))));
    announce(list.length === 1 ? t('home.count1') : t('home.count', { n: list.length }));
  }
  function paint() { paintCats(); paintChips(); paintResults(); }
  setChildren(root,
    h('div', { class: 'hero' }, h('h1', null, t('home.hero')), h('p', { class: 'lead' }, t('home.heroSub'))),
    h('div', { class: 'toolbar' }, h('div', { class: 'search' }, icon('search', 'search-ic'), input, clear), filterBtn),
    cats, chips, results);
  paint();
  return root;
}

function openFilters(catalog, done) {
  const dlg = h('dialog', { class: 'sheet', 'aria-label': t('filter.title') });
  const body = h('div', { class: 'sheet-body' });
  const counts = tagCounts(catalog.apps);
  function paintSheet(live = true) {
    const favs = getFavs(), n = filterApps(catalog.apps, { ...state, favs }, catalog).length;
    const cat = h('select', { id: 'f-cat', onchange: (e) => { state.category = e.target.value; paintSheet(); } },
      h('option', { value: '' }, t('filter.anyCategory')), Object.entries(catalog.categories).map(([k, v]) => h('option', { value: k, selected: state.category === k }, `${v.icon} ${loc(v)}`)));
    const sort = h('select', { id: 'f-sort', onchange: (e) => { state.sort = e.target.value; paintSheet(); } }, ['updated', 'new', 'name'].map((k) => h('option', { value: k, selected: state.sort === k }, t(`sort.${k}`))));
    setChildren(body,
      h('div', { class: 'sheet-head' }, h('h2', null, t('filter.title')), h('button', { class: 'icon-btn', type: 'button', 'aria-label': t('lightbox.close'), onclick: () => dlg.close() }, icon('close'))),
      h('label', { class: 'field', for: 'f-cat' }, t('filter.category')), cat,
      h('label', { class: 'field', for: 'f-sort' }, t('filter.sort')), sort,
      h('div', { class: 'field', id: 'f-tags-l' }, t('filter.tags')),
      h('div', { class: 'tag-list', role: 'group', 'aria-labelledby': 'f-tags-l' }, [...counts.keys()].sort((a, b) => loc(catalog.tags[a]).localeCompare(loc(catalog.tags[b]), getLanguage())).map((k) =>
        h('button', { class: `chip${state.tags.has(k) ? ' on' : ''}`, type: 'button', 'aria-pressed': state.tags.has(k) ? 'true' : 'false', onclick: () => { if (state.tags.has(k)) state.tags.delete(k); else state.tags.add(k); paintSheet(); } }, loc(catalog.tags[k]), h('span', { class: 'chip-n' }, counts.get(k))))),
      h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: state.onlyFavs, onchange: (e) => { state.onlyFavs = e.target.checked; paintSheet(); } }), t('filter.favs')),
      h('div', { class: 'sheet-actions' },
        h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => { Object.assign(state, { category: '', onlyFavs: false, sort: 'updated' }); state.tags.clear(); paintSheet(); } }, t('filter.clear')),
        h('button', { class: 'btn btn-primary', type: 'button', onclick: () => dlg.close() }, t('filter.apply', { n }))));
    if (live) done(); // results behind the sheet follow every change
  }
  paintSheet(false); dlg.append(body); document.body.append(dlg);
  dlg.addEventListener('close', () => { dlg.remove(); done(); });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.showModal();
}
