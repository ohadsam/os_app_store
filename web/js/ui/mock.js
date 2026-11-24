// Phone-screen illustrations for the install guide (DOM + CSS, localised, RTL-safe). Original drawings of generic Android/iOS dialogs;
// they are replaceable by real device screenshots (docs/CATALOG.md). Must not touch storage.
import { h } from '../util.js';
import { t } from '../i18n.js';

const btn = (label, primary) => h('span', { class: `m-btn${primary ? ' m-primary' : ''}` }, label);
const dialog = (title, body, ...btns) => h('div', { class: 'm-dialog' }, h('b', { class: 'm-dt' }, title), body && h('p', { class: 'm-dp' }, body), h('div', { class: 'm-btns' }, btns));
const status = () => h('div', { class: 'm-status' }, h('span', null, '9:41'), h('span', { class: 'm-dots' }, '●●●'));
const page = (...kids) => h('div', { class: 'm-page' }, kids);

const SCREENS = {
  download: (c) => page(h('div', { class: 'm-url' }, c.host), h('div', { class: 'm-skel' }), h('div', { class: 'm-sheet' }, dialog(t('mock.dl.title'), t('mock.dl.body', { file: c.file }), btn(t('mock.cancel')), btn(t('mock.dlAnyway'), true)))),
  opened: (c) => page(h('div', { class: 'm-shade' }, h('div', { class: 'm-notif' }, h('b', null, c.file), h('span', null, t('mock.done.title')), btn(t('mock.open'), true)))),
  blocked: () => page(h('div', { class: 'm-shade' }, h('div', { class: 'm-center' }, dialog(t('mock.unk.title'), t('mock.unk.body'), btn(t('mock.cancel')), btn(t('mock.settings'), true))))),
  blockedMore: () => page(h('div', { class: 'm-shade' }, h('div', { class: 'm-center' }, h('div', { class: 'm-dialog' }, h('b', { class: 'm-dt' }, t('mock.pb.title')), h('p', { class: 'm-dp' }, t('mock.pb.body')), h('span', { class: 'm-hl m-more' }, `${t('mock.pb.more')} ⌄`), h('div', { class: 'm-btns' }, btn(t('mock.pb.anyway'), true), btn(t('mock.pb.ok'))))))),
  permission: (c) => page(h('div', { class: 'm-shade' }, h('div', { class: 'm-center' }, dialog(t('mock.perm.title', { app: c.name }), null, btn(t('mock.perm.deny')), btn(t('mock.perm.allow'), true))))),
  allow: () => page(h('div', { class: 'm-appbar' }, t('mock.allow.title')), h('div', { class: 'm-row' }, h('span', { class: 'm-ico' }, 'C'), h('div', { class: 'm-grow' }, h('b', null, 'Chrome'), h('small', null, t('mock.allow.row'))), h('span', { class: 'm-toggle m-on' }, h('i', null)))),
  install: (c) => page(h('div', { class: 'm-center' }, h('div', { class: 'm-dialog m-wide' }, h('div', { class: 'm-appid' }, appIcon(c), h('b', null, c.name)), h('p', { class: 'm-dp' }, t('mock.install.body')), h('b', { class: 'm-dt' }, t('mock.install.title')), h('div', { class: 'm-btns' }, btn(t('mock.cancel')), btn(t('mock.installBtn'), true))))),
  protect: () => page(h('div', { class: 'm-shade' }, h('div', { class: 'm-center' }, dialog(t('mock.pp.title'), t('mock.pp.body'), btn(t('mock.pp.skip')), btn(t('mock.pp.scan'), true)), h('p', { class: 'm-hint' }, t('mock.pp.more'))))),
  done: (c) => page(h('div', { class: 'm-center' }, h('div', { class: 'm-dialog m-wide' }, h('div', { class: 'm-appid' }, appIcon(c), h('b', null, t('mock.ok.title'))), h('div', { class: 'm-btns' }, btn(t('mock.ok.done')), btn(t('mock.open'), true))))),
  browser: (c) => page(h('div', { class: 'm-url' }, c.host), h('div', { class: 'm-skel' }), h('div', { class: 'm-skel m-short' })),
  chromeMenu: () => page(h('div', { class: 'm-url' }, '⋮  ···'), h('div', { class: 'm-menu' }, h('span', null, t('mock.menu.new')), h('span', { class: 'm-hl' }, t('mock.menu.install')), h('span', { class: 'm-hl' }, t('mock.menu.add')), h('span', null, t('mock.menu.share')))),
  pwaPrompt: (c) => page(h('div', { class: 'm-center' }, h('div', { class: 'm-dialog m-wide' }, h('div', { class: 'm-appid' }, appIcon(c), h('b', null, c.name)), h('p', { class: 'm-dp' }, t('mock.pwa.body')), h('b', { class: 'm-dt' }, t('mock.pwa.title')), h('div', { class: 'm-btns' }, btn(t('mock.cancel')), btn(t('mock.installBtn'), true))))),
  homeScreen: (c) => page(h('div', { class: 'm-grid' }, ['', '', '', '', '', ''].map(() => h('span', { class: 'm-ph' })), h('span', { class: 'm-tile' }, appIcon(c), h('small', null, c.name))), h('small', { class: 'm-cap' }, t('mock.home'))),
  safariShare: () => page(h('div', { class: 'm-url' }, 'Safari'), h('div', { class: 'm-sheet m-ios' }, h('span', null, t('mock.ios.copy')), h('span', { class: 'm-hl' }, `＋ ${t('mock.ios.add')}`))),
  iosAdd: (c) => page(h('div', { class: 'm-appbar m-spread' }, h('span', null, t('mock.cancel')), h('b', null, t('mock.ios.add')), h('span', { class: 'm-link' }, t('mock.ios.addBtn'))), h('div', { class: 'm-row' }, appIcon(c), h('div', { class: 'm-grow' }, h('b', null, c.name)))),
};
function appIcon(c) { return c.icon ? h('img', { class: 'm-appicon', src: c.icon, alt: '', width: 28, height: 28 }) : h('span', { class: 'm-appicon m-ico' }, 'A'); }

/** kind: key of SCREENS; ctx: { name, file, host, icon }. Decorative (the step text carries the meaning). */
export function phone(kind, ctx) {
  return h('div', { class: 'phone', 'aria-hidden': 'true' }, h('div', { class: 'phone-screen' }, status(), (SCREENS[kind] || SCREENS.done)(ctx)));
}
export const MOCK_KINDS = Object.keys(SCREENS);
