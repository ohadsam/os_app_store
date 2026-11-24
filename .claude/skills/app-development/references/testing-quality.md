# Testing and quality gates

## Commands
`npm run check` (syntax, banned APIs, CSP/SW consistency) · `npm test` (node:test unit tests: logic, i18n parity, version sync, changelog, docs file map, guide titles he/en) · `npm run e2e` (Playwright smoke: boot, RTL, flows, axe-core over every screen/dialog in he+light and en+dark, 320 px no horizontal scroll; `ONLY="step name"` runs one step) · `tests/e2e/journey.mjs` (screenshots of ~90 screens + audit; `GUIDE_DIR=...` regenerates guide images) · Kotlin: JVM unit tests only in CI.
Run long jobs in the background, wait with `until grep ... log`; never edit served web files during a run; Playwright is preinstalled (do not `playwright install`).

## Rules (domain-independent; the step names below are examples)
* New logic => unit test written with it; new flow => e2e step; every fixed bug => regression test; axe stays at ZERO; look at screenshots of every changed screen in he **and** en.
* Native features cannot be exercised in the sandbox: use a **fake bridge stand-in** (`fakeAndroid` in e2e: stubs `NativeBridge` methods + dispatches `permissions-changed`/update events) to test the web side of native flows; say clearly what remains phone-only.
* Layout sweep / text-fit (from SonRise: `tests/e2e/layout.mjs`, `textfit.mjs`, 320-1366 px, big text) once the UI grows.
* Docs test enforces that every web/script/test/Android file is listed in `docs/CONTEXT.md`.

## Gotchas (real)
* `page.addInitScript` applies on the next load - seed once with `localStorage` null checks (re-seeding on every navigation broke a toggle-and-reload step); `reload()` first.
* Install the Playwright fake clock BEFORE init scripts that use timers; CSP forbids `addScriptTag` (use `evaluate`); wait for async redraws; continuously animated elements are never "stable" - use `reducedMotion: 'reduce'`.
* axe: `role="listitem"` rows inside `role=list`; tinted chip backgrounds for contrast; unique DOM ids.
* Flex/grid children need `min-width:0` (time inputs/long words widen sheets); `el.replaceChildren(null)` prints "null" - use `setChildren()`/`h()`.
* A bad import in a new module fails e2e at boot: `node -e "import('./web/js/x.js')"`.
* Squashed text in narrow flex columns (blocked-permission note) - put notes under the row text.

## Full regression at the end of every big stage (owner's rule)
After a large change set, a new version's feature batch, a design/asset integration, or before handing the owner a build for real-device testing, run the **whole** battery, not only the touched steps:
1. `npm run check && npm test` (all unit tests).
2. `npm run e2e` - every step, axe over every screen in he/en light/dark, 320 px.
3. `node tests/e2e/journey.mjs <dir>` - the full guided tour with screenshots of **every** screen (he + en), usability audit, contact sheets; **open the contact sheets and look**.
4. Regenerate the guide JPEGs (`GUIDE_DIR=web/art/guide`) when the UI changed; commit them.
5. Push and read CI (web + android) - Kotlin only compiles there; then verify release + Pages live.
Report: counts (unit/e2e steps/screens), findings table (empty or explained), what only a phone can prove. Never skip this because "only a small thing changed" at the end of a stage - integrations and refactors break distant screens (a removed bridge method broke the Kotlin build; a defaults flip changed existing installs).
Where to look at images: the journey writes PNGs/sheets to the directory you pass; use the Read tool on them; send the owner the important ones with SendUserFile.
