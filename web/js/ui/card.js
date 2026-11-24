// One app card + small shared pieces (badges, icon, primary button). Must not fetch or store anything itself.
import { h } from '../util.js';
import { t, loc, fmtRelative } from '../i18n.js';
import { icon } from '../icons.js';
import { isRecent, primaryAction, needsUpdate } from '../catalog.js';

export function appIcon(app, size = 56) {
  return h('img', { class: 'app-icon', src: app.icon, alt: '', width: size, height: size, loading: 'lazy', 'data-id': app.id });
}
export function platformBadges(app) {
  const out = [];
  if (app.platforms.includes('pwa')) out.push(h('span', { class: 'badge b-pwa' }, t('plat.pwa')));
  if (app.platforms.includes('web') && !app.platforms.includes('pwa')) out.push(h('span', { class: 'badge b-web' }, t('plat.webOnly')));
  if (app.platforms.includes('android')) out.push(h('span', { class: 'badge b-apk' }, t('plat.apk')));
  if (app.status === 'beta') out.push(h('span', { class: 'badge b-beta' }, t('card.beta')));
  return out;
}
export function actionButton(app, extraClass = '') {
  const a = primaryAction(app), cls = `btn btn-primary ${extraClass}`.trim();
  if (a === 'open') return h('a', { class: cls, href: app.links.web, target: '_blank', rel: 'noopener', 'aria-label': `${t('card.open')}: ${loc(app.name)}` }, icon('external'), t('card.open'));
  if (a === 'download') return h('a', { class: cls, href: app.links.apk, rel: 'noopener', 'aria-label': `${t('card.download')}: ${loc(app.name)}` }, icon('download'), t('card.download'));
  if (a === 'releases') return h('a', { class: cls, href: app.links.releases, target: '_blank', rel: 'noopener', 'aria-label': `${t('card.releases')}: ${loc(app.name)}` }, icon('download'), t('card.releases'));
  return h('a', { class: cls, href: `#/app/${app.id}` }, t('card.details'));
}
export function card(app, { favs, installed, onFav }) {
  const fav = favs.has(app.id);
  const meta = [t('card.version', { v: app.version }), t('card.updated', { when: fmtRelative(app.updated) })].join(' · ');
  return h('article', { class: 'card', 'data-app': app.id },
    h('div', { class: 'card-top' }, appIcon(app),
      h('div', { class: 'card-main' },
        h('h3', { class: 'card-title' }, h('a', { class: 'card-link', href: `#/app/${app.id}` }, loc(app.name))),
        h('p', { class: 'card-tag' }, loc(app.tagline)))),
    h('div', { class: 'badges' }, platformBadges(app), isRecent(app, Date.now()) && h('span', { class: 'badge b-new' }, t('card.recent')), needsUpdate(app, installed) && h('span', { class: 'badge b-upd' }, t('card.updateAvail'))),
    h('p', { class: 'card-meta' }, meta),
    h('div', { class: 'card-actions' }, actionButton(app),
      h('button', { class: `icon-btn fav${fav ? ' on' : ''}`, type: 'button', 'aria-pressed': fav ? 'true' : 'false', 'aria-label': fav ? t('card.unfav') : t('card.fav'), onclick: () => onFav(app.id) }, icon('heart'))));
}
