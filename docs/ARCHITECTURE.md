# Architecture

Vanilla ES modules in `web/`, no build step, no runtime dependencies, published as a PWA on GitHub Pages (all paths relative: served from `/os_app_store/`).
Dependency direction: `ui/*` -> `catalog.js` / `store.js` / `i18n.js` -> `util.js`. `catalog.js` is pure (no DOM, no storage; time and language are passed in). `store.js` is the only module that touches localStorage (memory fallback when blocked, sanitised on read).
Rendering is rebuild-per-view with `h()` (text nodes only; the static check bans raw-HTML sinks). Lists are tiny (tens of apps) so every state change re-renders the results area.
Routing: hash router in `app.js`; `#/app/<id>` is deep-linkable and shareable (WhatsApp link from the app page).
Catalog: one JSON, validated/sanitised by `normalizeCatalog` (https links only, shot paths restricted to `art/shots/<id>/*`, control + bidi characters stripped, unknown tags dropped). Service worker serves it network-first so a catalog update is visible immediately; offline falls back to the cached copy (and a banner says so).
Service worker: exact contract of `app-development/references/pwa-pages-actions.md` §2 (`VERSION` = version.json, `cache: 'reload'` install, `skipWaiting` + `clients.claim`, same-origin GET only, reload once on `controllerchange`).
No `INTERNET`/native concerns: PWA only. CSP: `default-src 'self'`; no outbound requests at all from the page. Links to GitHub/WhatsApp are user-tapped navigations.
Sync (build time only): `scripts/sync-catalog.mjs` reads each app's version file via raw.githubusercontent.com (or a local clone) and rewrites `apps.json`; run by the daily `sync-catalog.yml` and by the release checklists.
