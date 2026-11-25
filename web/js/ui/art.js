// Store illustrations (AI-made SVG, light + dark pair). Both images are in the DOM and CSS shows the one matching the theme
// (so the manual theme switch works too). Decorative: alt is empty, the text next to them carries the meaning. Must not touch storage.
import { h } from '../util.js';

export const ART = ['states/no-results', 'states/offline', 'states/load-error', 'states/coming-soon', 'install/download', 'install/allow-once', 'install/done', 'about/about-illustration'];
export function art(name, { w = 160, h: hh = 120, cls = '' } = {}) {
  const img = (v) => h('img', { class: `art-${v}`, src: `art/store/${name}-${v}.svg`, alt: '', width: w, height: hh, loading: 'lazy' });
  return h('span', { class: `art ${cls}`.trim(), 'aria-hidden': 'true' }, img('light'), img('dark'));
}
export const catIcon = (id) => h('span', { class: 'cat-ic', 'data-cat': id, 'aria-hidden': 'true' });
