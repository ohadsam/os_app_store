// The install guide: step lists + phone illustrations, shared by the guide page and the per-app "show more" section.
import { h } from '../util.js';
import { t } from '../i18n.js';
import { phone } from './mock.js';

export const FLOWS = {
  android: [['a1', 'download'], ['a2', 'opened'], ['a3', 'blocked'], ['a4', 'allow'], ['a5', 'install'], ['a6', 'protect'], ['a7', 'done']],
  pwa: [['p1', 'download'], ['p2', 'chromeMenu'], ['p3', 'pwaPrompt']],
  ios: [['i1', 'download'], ['i2', 'safariShare'], ['i3', 'iosAdd']],
};
// The first PWA/iOS step shows the app opening in a browser, not a file download.
const KIND_OVERRIDE = { p1: 'browser', i1: 'browser' };

export function steps(flow, ctx) {
  return h('ol', { class: 'steps' }, FLOWS[flow].map(([key, kind], i) => h('li', { class: 'step' },
    h('div', { class: 'step-text' }, h('span', { class: 'step-n' }, t('guide.step', { n: i + 1 })), h('p', { class: 'step-title' }, t(`${key}.t`)), h('p', null, t(`${key}.d`))),
    phone(KIND_OVERRIDE[key] || kind, ctx))));
}
export function flowSection(flow, ctx, open = false) {
  const title = { android: 'guide.android', pwa: 'guide.pwa', ios: 'guide.ios' }[flow];
  const d = h('details', { class: 'flow', open }, h('summary', null, t(title)), steps(flow, ctx));
  return d;
}
export function guidePage() {
  const ctx = { name: 'App', file: 'app.apk', host: 'github.com', icon: 'icon.svg' };
  return h('section', { class: 'page guide' },
    h('h1', null, t('guide.title')), h('p', { class: 'lead' }, t('guide.sub')),
    h('div', { class: 'callout' }, h('b', null, t('guide.why')), h('p', null, t('guide.whyText'))),
    h('p', { class: 'muted' }, t('guide.mockNote')),
    flowSection('android', ctx, true), flowSection('pwa', ctx), flowSection('ios', ctx),
    h('div', { class: 'callout' }, h('b', null, t('guide.update')), h('p', null, t('guide.updateText'))));
}
