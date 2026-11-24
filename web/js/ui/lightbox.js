// Full-screen screenshot viewer (native <dialog>, keyboard: Esc closes, arrows move). Must not touch storage.
import { h } from '../util.js';
import { t, loc } from '../i18n.js';
import { icon } from '../icons.js';

export function openLightbox(app, index) {
  let i = index;
  const img = h('img', { class: 'lb-img', alt: '' }), cap = h('p', { class: 'lb-cap' });
  const dlg = h('dialog', { class: 'lightbox', 'aria-label': loc(app.name) });
  const show = (n) => { i = (n + app.shots.length) % app.shots.length; const s = app.shots[i]; img.src = s.file; img.alt = t('shot.alt', { name: loc(app.name), cap: loc(s.caption) }); cap.textContent = `${i + 1}/${app.shots.length} · ${loc(s.caption)}`; };
  dlg.append(h('button', { class: 'icon-btn lb-close', type: 'button', 'aria-label': t('lightbox.close'), onclick: () => dlg.close() }, icon('close')),
    h('div', { class: 'lb-row' }, h('button', { class: 'icon-btn', type: 'button', 'aria-label': t('lightbox.prev'), onclick: () => show(i - 1) }, icon('fwd', 'flip-rtl')), img, h('button', { class: 'icon-btn', type: 'button', 'aria-label': t('lightbox.next'), onclick: () => show(i + 1) }, icon('back', 'flip-rtl'))), cap);
  dlg.addEventListener('keydown', (e) => { const dir = document.documentElement.dir === 'rtl' ? -1 : 1; if (e.key === 'ArrowRight') show(i + dir); if (e.key === 'ArrowLeft') show(i - dir); });
  dlg.addEventListener('close', () => dlg.remove()); dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  document.body.append(dlg); show(i); dlg.showModal();
}
