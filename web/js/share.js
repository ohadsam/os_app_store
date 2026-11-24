// Share links for the store and for single apps (WhatsApp, system share sheet, clipboard). Pure link building + one share helper.
export const waLink = (text) => `https://wa.me/?text=${encodeURIComponent(text)}`;
export async function shareText(text, url) {
  try { if (navigator.share) { await navigator.share({ text, url }); return 'shared'; } } catch (e) { if (e?.name === 'AbortError') return 'cancelled'; }
  try { await navigator.clipboard.writeText(url); return 'copied'; } catch { return 'failed'; }
}
export const storeUrl = () => new URL('./', location.href).href;
export const appUrl = (id) => `${storeUrl()}#/app/${id}`;
