---
name: app-development
description: Domain-independent method for building and shipping ANY new app the owner (ohadsam) asks for, in any field (fitness, family/routines, events, alarms, religious texts, tools...) - a vanilla-JS PWA on GitHub Pages plus a thin Android WebView shell (or a fully native Kotlin app), shipped through GitHub Actions, Hebrew-first/RTL, with in-app permissions, in-app update-over-install, share-the-app/WhatsApp, What's New/About, optional background work and widgets, ChatGPT-generated design assets, tests with screenshots, and a release checklist that gates every change. Use when starting a new app (run the intake in references/domain-adaptation.md), continuing one, setting up CI/Pages/APK release, adding permissions/updates/sharing/widgets/background work, commissioning icons/logo/characters/animations from ChatGPT, or finishing a change ("run the release checklist"). Distilled from StepUp (ohadsam/distance_analyzer), SonRise (morning_organizer), Special Events, Smart Alarm Clock, Kodesh, Tehilim Daily.
---

# App development the owner's way (any domain)

**Domain-independent.** Examples in the references (workout, GPS, steps, routines, alarms...) are illustrations of "the app's core activity"; for a new app in a new field, first run the intake in `references/domain-adaptation.md` (audience, core activity, data, platform, capabilities, online services, owner-confirmed domain rules, design language), then apply everything below unchanged.

One skill, four jobs: **start** an app, **build** features in the established patterns, **commission design assets** from ChatGPT, **ship** through CI (release checklist included - it is part of the work, not an afterthought).
Per-app facts live in that repo's `CLAUDE.md` + `docs/CONTEXT.md`; this skill is the reusable way of working. If an app's own rule conflicts with this file, the app wins; if you learn something that applies to every app, put it here (§7).

## 0. Read first, in this order
1. The app's `CLAUDE.md` -> `docs/CONTEXT.md` (status, file map, rules) -> `docs/REQUESTS.md` (owner's ledger) -> only then the code you need (grep before reading; never scan the tree).
2. `references/release-checklist.md` before calling anything done.
3. The reference that matches the task (table below).

| Task | Read |
|---|---|
| **New app in any field: intake + capability menu** | `references/domain-adaptation.md` |
| New app / bootstrap | `references/bootstrap.md`, then `templates/` |
| Web app, PWA, service worker, GitHub Pages, Actions | `references/pwa-pages-actions.md` |
| Android shell, bridge, permissions, in-app update, background, widgets, signing | `references/android-webview-shell.md` |
| Fully native Kotlin/Compose app | `references/native-kotlin.md` (+ the `android-native-dev` skill in `ohadsam/special_events`) |
| Icons, logo, illustrations, characters, animations, backgrounds | `references/design-assets.md` |
| Share the app (WhatsApp), version, About, What's New, updates box | `references/sharing-about-whatsnew.md` |
| Tests, quality gates, the full regression at the end of a stage, a11y | `references/testing-quality.md` |
| UI/UX rules, the user guide (in-app + docs), screenshots generated from the tests | `references/ui-ux-and-guide.md` |
| Working with the owner in chat, reports, ledger | `references/working-with-owner.md` |
| Past incidents - check before touching the same area | `references/lessons-learned.md` |
| Finishing / shipping | `references/release-checklist.md` |

## 1. The product shape (default for a new app)
* **One vanilla-JS web app** in `web/` (ES modules, no build step, no runtime dependencies, CSP `'self'` only), published as a **PWA** on GitHub Pages, and packaged **unchanged** as assets in a thin **Android WebView app** (`android/`, Kotlin, one `NativeBridge` as the only JS door). Parity: every feature exists in both; background-only things are mirrored in Kotlin with JVM unit tests; native-only extras are hidden in a browser, never broken.
* Fully native Kotlin + Compose only when the app is native by nature (alarm clock, file manager, calendar-style apps) - see `references/native-kotlin.md`.
* **No server, no account**; data stays on the device; anything online is opt-out-able, named in the UI and allow-listed in the CSP.
* **Hebrew first (RTL) and English equal** from the first commit: i18n parity test, logical CSS only, number + space + unit.
* **Audience first**: few things per screen, big targets, short kind wording, grouped toolbars on one row, collapsed settings with one-line summaries, one primary action. Health or legal guidance is general, never advice.
* **Safe defaults**: quiet, private, nothing leaves the device unless the person chooses - unless the owner decides otherwise for that app (e.g. StepUp 0.24: map/weather/planner ON by default, clearly switchable). Record such decisions in `REQUESTS.md`.

## 2. Pipeline in one picture
`feature branch (claude/* or ccr-*)` -> push -> **CI** (`ci.yml`: web static+security checks, unit tests, Playwright e2e + axe; android: JVM unit tests, lint, signed release APK + sha256) -> merge/push to **`main`** -> **release job** (GitHub Release `build-N` with `app.apk` + `.sha256`, notes cut from `docs/CHANGELOG.md`, newest 10 kept) and **`pages.yml`** (deploys `web/` when it changed) -> verify the **live** result (release asset, Pages `version.json`). Templates: `templates/workflows/`. Details: `references/pwa-pages-actions.md`.
Kotlin cannot be compiled in the sandbox (no Android SDK): CI is the only gate - push and read the log (`get_job_logs`), never claim success from eyeballing.

## 3. Building blocks (pick what the app needs - menu in `references/domain-adaptation.md` §2; reference implementations in StepUp and SonRise)
* **Permissions UX** - one Settings section listing every permission with state + Allow / Open-settings, a start-up sheet for missing required ones (once per session, never over an activity in progress, "don't ask again"), state model `granted | ask | blocked | unsupported`. -> `references/android-webview-shell.md` §3.
* **Update button** - browser: refresh the service worker + reload; Android: verified download + `PackageInstaller` UPDATE (same applicationId/key, data stays). -> §4 and `references/pwa-pages-actions.md` §3 (a new version must really reach the phone).
* **Background work** (foreground service, alarms, boot re-arm, step sensor), **widgets**, **notifications**. -> §5-§7.
* **Share the app (WhatsApp / e-mail / share sheet / copy), version + About, What's New after an update, the updates box** -> `references/sharing-about-whatsnew.md`.
* **Backup/restore, share cards, guide + search** -> `references/lessons-learned.md` "feature checklist".
* **Design assets** (icons, logo, characters, animations) come from ChatGPT through exact, versioned prompts, then are validated and integrated. -> `references/design-assets.md`.

## 4. Non-negotiables (the owner's standing rules, condensed - the full list is in `references/release-checklist.md` §0)
Audience first · simple, beautiful, self-explanatory UI · PWA = Android parity · Hebrew first/English equal/RTL-safe · defaults protect people · tests are the proof (unit + e2e + axe zero + 320 px) · requirements ledger never loses an item · honesty about what only a phone can prove · reuse before writing, token-efficient work · design assets from ChatGPT by prompt, never improvised · context docs current in the same change.

## 5. How a change flows (always)
read docs -> small change -> unit test with the logic -> e2e step for the flow -> `npm run check && npm test && npm run e2e` -> look at screenshots (he + en; they come from the e2e journey, never by hand) -> the five reviews + `/simplify` + `/code-review` -> bump version + CHANGELOG + guide + docs -> commit, push branch and `main` (owner authorised) -> wait for CI + release + Pages -> verify live -> report honestly in Hebrew (short: what changed, what was verified how, what needs a phone).

**End of every big stage** (feature batch, asset integration, refactor, before a phone test): run the FULL regression - all unit tests, all e2e steps, the full journey with screenshots of every screen + usability audit + axe, regenerate guide images, look at the contact sheets, then CI + live verification (`references/testing-quality.md`). The user guide (docs + in-app guide + search + What's New) is updated in every change that users can see (`references/ui-ux-and-guide.md`).

## 6. Working in the cloud sandbox
Outbound network is proxied; only the session's repo is writable (others are read-only clones); GitHub via MCP tools (`mcp__github__*`, load with ToolSearch; `gh` only for search); no Android SDK; Playwright + Chromium preinstalled (`npm i` for deps; never `playwright install`). Run long jobs in the background and wait with Monitor (`until grep ... log`); never `pkill`; never edit served web files while e2e runs. A Stop hook may force commit+push when the tree is dirty. Schedule CI re-checks with `send_later` instead of polling.

## 6b. The store
Every app of the owner is listed in the store "OS APPs & Downs" (`ohadsam/os_app_store`, https://ohadsam.github.io/os_app_store/). Shipping a version or creating a new app includes updating its catalog entry (release-checklist step "Store - update ..."; how-to in the store repo's `docs/CATALOG.md`).

## 7. Skill hygiene
This skill and the app's release-checklist are living documents: when a step was missing or a claim wrong, fix the file in the same change (release-checklist §5). Keep this file short; details belong in `references/`.
