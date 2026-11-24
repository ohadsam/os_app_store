// Tiny DOM helpers. h() builds nodes from text nodes only - user/catalog text never reaches an HTML sink. Must not touch storage or i18n.
export function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'text') el.append(String(v));
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, String(v));
  }
  append(el, kids);
  return el;
}
function append(el, kids) { for (const k of kids.flat(Infinity)) { if (k == null || k === false) continue; el.append(k instanceof Node ? k : document.createTextNode(String(k))); } }
/** Replace all children (null/false are skipped - never use replaceChildren(null), it prints "null"). */
export function setChildren(el, ...kids) { el.textContent = ''; append(el, kids); return el; }
export const $ = (sel, root = document) => root.querySelector(sel);
/** Announce text to screen readers via the polite live region. */
export function announce(msg) { const r = document.getElementById('sr'); if (r) { r.textContent = ''; setTimeout(() => { r.textContent = msg; }, 30); } }
export function toast(msg) {
  const box = document.getElementById('toasts'); if (!box) return;
  const n = h('div', { class: 'toast', role: 'status' }, msg); box.append(n); setTimeout(() => n.remove(), 3200);
}
/** Only http(s) links from the catalog are ever rendered as hrefs. */
export const safeUrl = (u) => (typeof u === 'string' && /^https:\/\/[^\s]+$/.test(u) ? u : null);
