// About page: what the store is, copyright + AI-image notice, contact, store version/update and PWA install button.
import { h, setChildren } from '../util.js';
import { t, fmtDate } from '../i18n.js';
import { APP_VERSION } from '../appVersion.js';
import { checkForUpdate } from '../update.js';
import { waLink, storeUrl } from '../share.js';
import { icon } from '../icons.js';
import { art } from './art.js';

let deferredPrompt = null;
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });

const block = (title, text, ...extra) => h('section', { class: 'card-block' }, h('h2', null, title), h('p', null, text), extra);
export function aboutPage(catalog) {
  const status = h('p', { class: 'note', role: 'status' });
  const year = new Date().getFullYear();
  const installBtn = h('button', { class: 'btn btn-ghost', type: 'button', onclick: async () => { if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; } else setChildren(status, t('about.installed')); } }, icon('download'), t('about.installStore'));
  return h('section', { class: 'page about' }, h('h1', null, t('about.title')), h('div', { class: 'about-art' }, art('brand/logo-stacked', { w: 200, h: 175 })), h('div', { class: 'about-art' }, art('about/about-illustration', { w: 300, h: 200 })),
    block(t('about.what'), t('about.whatText')), block(t('about.name'), t('about.nameText')),
    block(t('about.rights'), t('about.rightsText', { year })), block(t('about.ai'), t('about.aiText')),
    block(t('about.contact'), t('about.contactText'), h('a', { class: 'btn btn-ghost', href: 'https://github.com/ohadsam/os_app_store/issues/new', target: '_blank', rel: 'noopener' }, icon('external'), t('about.contactBtn'))),
    block(t('about.privacy'), t('about.privacyText')),
    h('section', { class: 'card-block' }, h('h2', null, t('about.version')), h('p', null, `v${APP_VERSION}`), catalog.generated && h('p', { class: 'muted' }, `${t('about.catalog')}: ${fmtDate(catalog.generated)}`),
      h('div', { class: 'row-actions' },
        h('button', { class: 'btn btn-primary', type: 'button', onclick: async (e) => { e.currentTarget.disabled = true; setChildren(status, t('about.checking')); const r = await checkForUpdate(); setChildren(status, r.state === 'latest' ? t('about.latest') : r.state === 'updating' ? t('about.updating', { v: r.version }) : t('about.failed')); e.currentTarget.disabled = false; } }, t('about.check')),
        installBtn, h('a', { class: 'btn btn-ghost', href: waLink(t('about.shareText', { url: storeUrl() })), target: '_blank', rel: 'noopener' }, icon('share'), t('about.share'))), status));
}
