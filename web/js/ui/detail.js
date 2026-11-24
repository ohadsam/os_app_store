// App page: hero + actions, screenshots, about, what's new, info table, install instructions ("show more") and links.
import { h, setChildren, toast } from '../util.js';
import { t, loc, locList, fmtDate, getLanguage } from '../i18n.js';
import { icon } from '../icons.js';
import { getFavs, toggleFav, getInstalled, setInstalled } from '../store.js';
import { needsUpdate } from '../catalog.js';
import { appIcon, platformBadges, actionButton } from './card.js';
import { openLightbox } from './lightbox.js';
import { art, catIcon } from './art.js';
import { flowSection, steps } from './guide.js';
import { waLink, shareText, appUrl } from '../share.js';

const ISSUES = 'https://github.com/ohadsam/os_app_store/issues/new';
const file = (u) => (u ? decodeURIComponent(new URL(u).pathname.split('/').pop()) : 'app.apk');
const host = (u) => (u ? new URL(u).host : 'github.com');
const link = (href, text) => h('a', { class: 'ext', href, target: '_blank', rel: 'noopener' }, text, icon('external'));

export function detailPage(catalog, id) {
  const app = catalog.apps.find((a) => a.id === id);
  if (!app) return h('section', { class: 'page' }, h('h1', null, t('detail.notFound')), h('a', { class: 'btn btn-primary', href: '#/' }, t('nav.back')));
  const root = h('section', { class: 'page detail' });
  const ctx = { name: loc(app.name), file: file(app.links.apk), host: host(app.links.web || app.links.apk), icon: app.icon };

  function paint() {
    const favs = getFavs(), installed = getInstalled(), fav = favs.has(app.id);
    const isInstalled = !!installed[app.id], upd = needsUpdate(app, installed);
    const cat = catalog.categories[app.category];
    const shareBox = h('div', { class: 'row-actions' },
      h('a', { class: 'btn btn-ghost', href: waLink(`${loc(app.name)} - ${loc(app.tagline)}\n${appUrl(app.id)}`), target: '_blank', rel: 'noopener' }, icon('share'), t('detail.shareWa')),
      h('button', { class: 'btn btn-ghost', type: 'button', onclick: async () => { const r = await shareText(`${loc(app.name)} - ${loc(app.tagline)}`, appUrl(app.id)); if (r === 'copied') toast(t('toast.copied')); } }, icon('share'), t('detail.share')),
      h('button', { class: `btn btn-ghost fav-btn${fav ? ' on' : ''}`, type: 'button', 'aria-pressed': fav ? 'true' : 'false', onclick: () => { const on = toggleFav(app.id); toast(t(on ? 'toast.saved' : 'toast.removed')); paint(); } }, icon('heart'), fav ? t('card.unfav') : t('card.fav')));
    const apkBtn = app.links.apk && app.apk.state === 'direct' ? h('a', { class: 'btn btn-primary', href: app.links.apk, rel: 'noopener' }, icon('download'), `${t('card.download')} · v${app.version}`)
      : app.links.releases && app.apk.state === 'page' ? h('a', { class: 'btn btn-primary', href: app.links.releases, target: '_blank', rel: 'noopener' }, icon('download'), `${t('card.releases')} · v${app.version}`) : null;
    const webBtn = app.links.web ? h('a', { class: 'btn btn-primary', href: app.links.web, target: '_blank', rel: 'noopener' }, icon('external'), t('card.open')) : null;

    const infoRows = [
      [t('detail.version'), `v${app.version}`], [t('detail.released'), fmtDate(app.released)], [t('detail.updated'), fmtDate(app.updated)],
      [t('detail.platforms'), [app.platforms.includes('pwa') && t('plat.pwa'), app.platforms.includes('web') && !app.platforms.includes('pwa') && t('plat.webOnly'), app.platforms.includes('android') && `${t('plat.android')} (APK)`].filter(Boolean).join(' · ')],
      app.platforms.includes('android') ? [t('detail.android'), t('detail.androidVal', { v: app.apk.minAndroid })] : null,
      app.apk.pkg ? [t('detail.pkg'), h('code', null, app.apk.pkg)] : null, [t('detail.category'), `${cat.icon} ${loc(cat)}`], [t('detail.rights'), t('detail.rightsVal')],
    ].filter(Boolean);

    const install = h('section', { 'aria-labelledby': 'h-inst' }, h('h2', { class: 'sec', id: 'h-inst' }, t('detail.install')),
      app.platforms.includes('android') && app.apk.state !== 'none' ? installBlock('inst.apkTitle', ['inst.apkShort1', 'inst.apkShort2', 'inst.apkShort3'], () => steps('android', ctx), app.apk.private ? t('detail.private') : null) : app.platforms.includes('android') ? h('p', { class: 'note' }, loc(app.apk.note) || t('detail.noApk')) : null,
      app.platforms.includes('pwa') ? installBlock('inst.pwaTitle', ['inst.pwaShort1', 'inst.pwaShort2'], () => steps('pwa', ctx)) : null,
      !app.platforms.includes('pwa') && app.platforms.includes('web') ? h('div', { class: 'inst' }, h('h3', null, t('inst.webTitle')), h('p', null, t('inst.webShort'))) : null,
      h('a', { class: 'ext', href: '#/guide' }, icon('book'), t('nav.guide')));

    setChildren(root,
      h('a', { class: 'back', href: '#/' }, icon('back', 'flip-rtl'), t('nav.back')),
      h('header', { class: 'hero-app' }, appIcon(app, 96),
        h('div', { class: 'hero-main' }, h('h1', null, loc(app.name)), h('p', { class: 'lead' }, loc(app.tagline)), h('div', { class: 'badges' }, platformBadges(app), h('span', { class: 'badge b-cat' }, catIcon(app.category), loc(cat))),
          h('p', { class: 'card-meta' }, `${t('card.version', { v: app.version })} · ${t('detail.updated')}: ${fmtDate(app.updated)}`))),
      h('div', { class: 'row-actions cta' }, webBtn, apkBtn, !webBtn && !apkBtn ? h('p', { class: 'note' }, loc(app.apk.note) || t('detail.noApk')) : null),
      app.apk.note.he && apkBtn ? h('p', { class: 'note' }, loc(app.apk.note)) : null,
      app.apk.private && apkBtn ? h('p', { class: 'note warn' }, t('detail.private')) : null,
      upd ? h('p', { class: 'note warn', role: 'status' }, t('detail.updateAvail', { v: app.version })) : null,
      shareBox,
      h('section', { 'aria-labelledby': 'h-shots' }, h('h2', { class: 'sec', id: 'h-shots' }, t('detail.screens')),
        app.shots.length ? h('div', { class: 'shots', tabindex: '0', role: 'group', 'aria-label': t('detail.screens') }, app.shots.map((s, i) => h('button', { class: 'shot', type: 'button', onclick: () => openLightbox(app, i), 'aria-label': t('shot.alt', { name: loc(app.name), cap: loc(s.caption) }) }, h('img', { src: s.file, alt: '', loading: 'lazy' })))) : h('div', { class: 'note coming' }, art('states/coming-soon', { w: 100, h: 133 }), t('detail.noShots'))),
      h('section', { 'aria-labelledby': 'h-about' }, h('h2', { class: 'sec', id: 'h-about' }, t('detail.about')), h('p', { class: 'prose' }, loc(app.description)),
        h('h3', null, t('detail.highlights')), h('ul', { class: 'bullets' }, locList(app.highlights).map((x) => h('li', null, x))), h('div', { class: 'badges' }, app.tags.map((k) => h('span', { class: 'tag' }, `#${loc(catalog.tags[k])}`)))),
      locList(app.whatsNew).length ? h('section', { 'aria-labelledby': 'h-new' }, h('h2', { class: 'sec', id: 'h-new' }, t('detail.whatsNew', { v: app.version })), h('ul', { class: 'bullets' }, locList(app.whatsNew).map((x) => h('li', null, x)))) : null,
      install,
      h('section', { 'aria-labelledby': 'h-info' }, h('h2', { class: 'sec', id: 'h-info' }, t('detail.info')), h('dl', { class: 'info' }, infoRows.map(([k, v]) => [h('dt', null, k), h('dd', null, v)])),
        h('div', { class: 'row-actions' }, isInstalled
          ? [h('span', { class: 'note' }, t('detail.installedV', { v: installed[app.id] })), h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => { setInstalled(app.id, null); paint(); } }, t('detail.unmark'))]
          : h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => { setInstalled(app.id, app.version); paint(); } }, icon('check'), t('detail.markInstalled')))),
      h('section', { 'aria-labelledby': 'h-links' }, h('h2', { class: 'sec', id: 'h-links' }, t('detail.links')),
        h('ul', { class: 'links' }, [app.links.repo && link(app.links.repo, t('detail.repo')), app.links.changelog && link(app.links.changelog, t('detail.changelog')), app.links.releases && link(app.links.releases, t('detail.releases')),
          app.links.sha && link(app.links.sha, t('detail.sha')), link(`${ISSUES}?title=${encodeURIComponent(loc(app.name))}`, t('detail.report'))].filter(Boolean).map((l) => h('li', null, l)))));
    document.title = `${loc(app.name)} - ${t('app.name')}`;
  }
  paint();
  return root;
}

// Short 2-3 line version + a "show more" toggle that reveals the full illustrated guide.
function installBlock(titleKey, shortKeys, fullBuilder, warn) {
  const full = h('div', { class: 'full', hidden: true });
  const btn = h('button', { class: 'btn btn-ghost more', type: 'button', 'aria-expanded': 'false', onclick: () => {
    const open = full.hidden; full.hidden = !open; btn.setAttribute('aria-expanded', String(open));
    if (open && !full.firstChild) full.append(fullBuilder());
    setChildren(btn, icon('chev', open ? 'up' : ''), t(open ? 'inst.hide' : 'inst.show'));
  } }, icon('chev'), t('inst.show'));
  return h('div', { class: 'inst' }, h('h3', null, t(titleKey)), h('ol', { class: 'short' }, shortKeys.map((k) => h('li', null, t(k)))), warn && h('p', { class: 'note warn' }, warn), btn, full);
}
