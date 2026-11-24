// Settings page: language (Hebrew by default, English), appearance (system / light / dark) and a reset of the per-device data.
// Changes apply at once and are saved on the device. Must not fetch anything.
import { h, toast } from '../util.js';
import { t, getLanguage, setLanguage } from '../i18n.js';
import { getTheme, setTheme, clearUserData } from '../store.js';

function radios(name, legend, hint, options, current, onPick) {
  return h('fieldset', { class: 'card-block fs' }, h('legend', null, legend), hint ? h('p', { class: 'muted' }, hint) : null,
    options.map(([value, label]) => h('label', { class: 'radio' }, h('input', { type: 'radio', name, value, checked: value === current, onchange: () => onPick(value) }), h('span', { lang: name === 'lang' ? value : null }, label))));
}
export function settingsPage(rerender) {
  return h('section', { class: 'page settings' }, h('h1', null, t('set.title')),
    radios('lang', t('set.lang'), t('set.langHint'), [['he', t('set.he')], ['en', t('set.en')]], getLanguage(), (v) => { setLanguage(v); rerender(); }),
    radios('theme', t('set.theme'), null, [['auto', t('theme.auto')], ['light', t('theme.light')], ['dark', t('theme.dark')]], getTheme(), (v) => { setTheme(v); rerender(); }),
    h('section', { class: 'card-block' }, h('h2', null, t('set.data')), h('p', null, t('set.dataText')),
      h('div', { class: 'row-actions' }, h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => { if (confirm(t('set.confirm'))) { clearUserData(); toast(t('set.cleared')); } } }, t('set.clear')))));
}
