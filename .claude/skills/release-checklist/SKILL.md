---
name: release-checklist
description: Mandatory checklist for every change to OS APPs and Downs (the owner's app-store PWA, repo ohadsam/os_app_store) - standing rules, five reviews, tests with screenshots, docs, the catalog sync that checks EVERY app for a newer version, ship and live verification. Use before calling anything done, after any change to web/, the catalog, scripts or docs, and whenever the owner says "run the release checklist".
---

# Release checklist - OS APPs and Downs

A **PWA-only** store (`web/`, vanilla JS, no build step, no dependencies) on GitHub Pages; `main` is primary. Same pipeline and quality bar as the sister apps (StepUp, SonRise); the generic method is `.claude/skills/app-development/` (ignore its Android parts). Do not skip or reorder steps; if a step finds nothing, say so and move on.
**First:** confirm the previous batch's checklist really finished (task list) - a green `main` and a half-finished checklist look identical.

## 0. The owner's standing rules (check them in the reviews and say how)
1. **Audience first.** The owner and people they send the link to, mostly on an Android phone, often non-technical. Few things per screen, big targets (>= 44 px), short kind wording, one primary action per card/screen, install steps explained with pictures.
2. **UI/UX simple, beautiful, self-explanatory.** Store feel: search, chips, filter sheet, cards, detail pages. Controls grouped (one toolbar row + a filter sheet), long content collapsed behind "show more".
3. **Parity / honesty about platforms.** The store is PWA-only. Android apps are only linked/downloaded - never claim an install was tested on a phone unless it was.
4. **Hebrew first, English equal**, RTL-safe (logical CSS), every string and every catalog text in both languages (parity test), number + space + unit.
5. **Defaults protect people.** No account, no tracking, no outbound requests from the page (CSP `'self'`); only per-device prefs.
6. **Tests are the proof.** Unit tests for logic, an e2e step for every flow, axe ZERO violations (he/en, light/dark), no horizontal scroll at 320 px, no console errors. Look at the screenshots of every changed screen (he and en).
7. **Requirements ledger.** `docs/REQUESTS.md` lists every request and its status; add new ones the moment they are made; walk the whole list before finishing; nothing silently dropped.
8. **Honesty.** Say what CI/tests verified and what needs a person/device (real phone installs, real device screenshots).
9. **Efficiency and quality.** Reuse before writing (`util.js`, `catalog.js`); small modules with a one-line header; no dead code; read only what the change touches; short reports.
10. **Design assets from ChatGPT via exact prompts** (logo, illustrations). Screenshots of apps come from running them (`scripts/capture-shots.mjs`, the apps' own e2e/guide images) - never drawn or edited by hand. Write prompts to `docs/prompts/` and list them in `docs/PENDING_CHATGPT_PROMPTS.md`.
11. **Context docs current.** Behaviour/structure/data/tests change => `docs/CONTEXT.md` (file map), `ARCHITECTURE.md`, `TESTING.md`, `CHANGELOG.md`, `REQUESTS.md` in the same change.
12. **Copyright & AI notice.** Footer + About keep: all rights reserved, all images made with AI tools, contact for problems. Never remove.

## 1. Five reviews - separate passes, in order (re-read changed files fresh each time)
1. **Architecture.** `ui/*` -> `catalog.js`/`store.js`/`i18n.js` -> `util.js`; `catalog.js` stays pure. New JS file => `sw.js` SHELL (static check) + CONTEXT file map. New persisted field => sanitised on read.
2. **QA / functional.** Journeys: browse, search (Hebrew/English/niqqud), filters, favourites, detail, show-more, lightbox, guide, about, language/theme switch, offline (catalog cached), deep link `#/app/<id>`, empty results, unknown app id, storage blocked, first load offline.
3. **UI/UX + RTL.** Targets >= 44 px, labels on icon buttons, focus visible, contrast light + dark, 320 px, logical properties, directional icons flip (`flip-rtl`), reduced motion; axe in the e2e.
4. **Security.** Catalog text only through `h()`; `normalizeCatalog` allow-lists https links, shot paths, colours, strips control/bidi chars; no raw-HTML sinks; CSP `'self'`; service worker same-origin only; external links `rel=noopener`. Run `security-review` on the diff. (Catalog sync: `scripts/sync-catalog.mjs`, workflow `sync-catalog.yml`.)
5. **Performance.** Lists bounded, images lazy, screenshots <= ~60 KB, SW precache small (shots are cached on demand), no new dependency.
Also run `/simplify` and `/code-review`. Fix findings before moving on. Write what each pass found (even "nothing").

## 2. Catalog sync - check EVERY app (owner's rule: the store always shows the latest version)
1. `npm run sync -- --local <dir with fresh clones of the apps> --check` (or without `--local` in CI: reads GitHub raw). It lists each app whose version in its repo differs from `web/data/apps.json`.
2. For each: `--write` (updates `version`, `updated`, English what's-new), then add Hebrew `whatsNew.he`, and re-capture screenshots if the UI changed (`npm run shots`, or copy the app's e2e/guide images).
3. Look for **non-version changes** the script cannot see: new platform (PWA/APK), renamed APK file, new package id, minimum Android, private/public repo, new features worth a `highlights` line, new apps (new repo since the last run), removed apps. Update the entry.
4. New app or tag => both languages; run `npm test` (catalog test checks icon, shots, links, languages, sync source).
5. Remember the other direction: every app's release checklist must trigger this (`docs/APP_RELEASE_STEP.md`). If an app's checklist lacks the step, patch it (`scripts/patch-release-checklists.mjs`) or tell the owner.

## 3. Version + What's New
`npm run bump -- patch|minor|major` (version.json, sw.js, appVersion.js, package.json) then `## x.y.z` in `docs/CHANGELOG.md` (test enforces). Catalog-only changes need no bump.

## 4. User guide and docs
Every user-visible change updates `docs/USER_GUIDE.md` and, when texts change, `README`. New strings in both languages in `js/i18n.js` (parity test).

## 5. Skills
If this run revealed a missing step or a wrong claim here, fix this file now (self-review).

## 6. Tests - must be green locally
```
npm run check   # syntax, banned APIs, CSP/SW consistency
npm test        # unit: catalog, i18n parity, store, sync, version, docs
npm run e2e     # Playwright: flows + axe he/en light/dark + 320 px (ONLY="name" for one step)
```
New logic => unit test; new flow => e2e step; fixed bug => regression test. Gotchas: `addInitScript` applies on the next load; CSP forbids `addScriptTag`; untrusted keys via `Object.hasOwn`; `replaceChildren(null)` prints "null" (use `setChildren`); flex/grid children need `min-width:0`.

## 6b. PWA update path - verify every release
Version identical in version.json / sw.js / appVersion.js / package.json (`bump`); install uses `cache: 'reload'`; `skipWaiting` + `clients.claim`; reload once on `controllerchange`; version.json and the catalog are network-first; every new JS in SHELL. After the push: `pages.yml` succeeded and the live `version.json` shows the new version (the sandbox proxy may block github.io: then say so and rely on the workflow result).

## 6c. End of a big stage - FULL regression with screenshots
check + test + e2e + `npm run journey -- <dir>` (every screen he + en, audit; open the images and LOOK) + sync `--check`; then CI and live verification. Report counts, findings (empty or explained), what needs a person/phone.

## 7. Ship
Commit on the working branch, push; (owner authorised) push `main`; `ci.yml` green; `pages.yml` deploys; verify live. Never claim done before that. Never create a PR unless asked.

## Known limitations (don't re-report as new)
- Install guide uses drawn phone illustrations, not real device screenshots (pending, see PENDING_CHATGPT_PROMPTS).
- Native apps have no screenshots yet; the page says so.
- The store cannot verify APK installs; it links to each app's own release.

## Done means
Five reviews run and fixed · catalog synced (every app checked) · version bumped if code changed · CHANGELOG + guide + context docs + ledger updated · check/test/e2e green · CI green · (main) Pages deployed and verified.
