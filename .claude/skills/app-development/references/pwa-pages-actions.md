# PWA, service worker, GitHub Pages and GitHub Actions

## 1. Web app rules
Vanilla ES modules, no bundler, no runtime dependencies. CSP: `default-src 'self'`; `connect-src` lists exactly the allowed API hosts (e.g. StepUp: open-meteo, api.github.com, nominatim, routing.openstreetmap.de, overpass-api.de, tile.openstreetmap.org as `img-src`); no inline script/style, no CDN. DOM only through `h()` (text nodes) - raw-HTML sinks are banned by `scripts/static-checks.mjs`. Everything persisted is sanitised on read (old data must keep loading). Imported/shared/restored data is untrusted: clamp, strip control + bidi chars, regenerate ids, bounded decompression; check keys with `Object.hasOwn`.
Generated data (icons, sprites) is produced by a script in `scripts/` (committed output + the script), never by hand.

## 2. Service worker (offline-first) - exact contract
* `const VERSION` equals `web/version.json` (bump script + unit test); `CACHE = app-${VERSION}`.
* `SHELL` lists **every** JS/CSS/art file the app needs; the static check fails if a file is missing from SHELL or SHELL names a missing file (also for `.webp`).
* **install**: `caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))` then `skipWaiting()`. The `cache: 'reload'` is essential: GitHub Pages serves files with `max-age=600`, so a plain `addAll` can store OLD files inside the NEW cache (0.24.1 incident: the PWA kept showing 0.23.1).
* **activate**: delete other caches, `clients.claim()`.
* **fetch**: same-origin GET only (never touch cross-origin); `version.json` network-first; everything else cache-first with background refresh; fall back to `index.html`.
* **Page side** (`app.js`): register `sw.js`; on `controllerchange`, if there was already a controller and no activity of the core flow (a recording, a timer run, an editor session) is in progress and `sessionStorage` guard not set, `location.reload()` once, so the open page really runs the new files.
* **"Check for updates" button** (browser): `reg.update()` -> wait for `controllerchange` (<= 10 s) -> reload.
* After every deploy: curl-equivalent check of the live `version.json` and `sw.js` (the sandbox proxy may block github.io - then use the Pages workflow result + the release, and say so).

## 3. GitHub Pages
`pages.yml`: on push to `main` touching `web/**` (and the workflow) + `workflow_dispatch`; permissions `contents: read, pages: write, id-token: write`; concurrency group `pages` (no cancel); steps checkout -> `configure-pages@v5` -> `upload-pages-artifact@v3` with `path: web` -> `deploy-pages@v4`. One-time: Settings -> Pages -> Source = GitHub Actions. URL: `https://<owner>.github.io/<repo>/` - all paths in the app must be **relative** (the site is served from a sub-path). An Android-only commit does not redeploy Pages; that is expected.

## 4. GitHub Actions (`templates/workflows/ci.yml`)
Triggers: push to `main`, `claude/**`, `ccr-*`; pull_request; workflow_dispatch. Concurrency per ref with cancel-in-progress.
* **web** job (Node 22, `npm ci`): `npm run check` -> `npm test` -> `npx playwright install --with-deps chromium` -> `npm run e2e` -> `npm audit --audit-level=high` (dev tooling only).
* **android** job (Temurin 17, `gradle/actions/setup-gradle` with gradle 8.7): optional private keystore from `KEYSTORE_*` secrets (else the committed key) -> `testDebugUnitTest` -> `lintDebug` (print `lint-results-debug.txt` on failure) -> `assembleRelease` -> copy to `dist/app.apk` + `sha256sum > app.apk.sha256` -> upload artifact.
* **release** job (needs web + android; only `main` push/dispatch; `contents: write`): `VERSION` from `web/version.json`, tag `build-$GITHUB_RUN_NUMBER`, notes = the `## VERSION` section of `docs/CHANGELOG.md` (awk), `gh release create ... --latest`, delete releases beyond the newest 10. The `.sha256` asset is what the in-app updater verifies against.
* Reading results (GitHub MCP): `actions_list list_workflow_runs resource_id=ci.yml branch=main`; failures: `get_job_logs` for the failed job with `tail_lines` ~260, grep for `e:` (Kotlin), lint, `FAILED`. Never read whole logs.
* "Actions refuse to start" (payments / spending limit) is not a code failure: stop, do not merge unverified, tell the owner.
* Native-only apps (Special Events, Smart Alarm) use `android-ci.yml` + `latest-apk.yml` (the `latest` release with a guard that compares applicationId, signing cert and versionCode with the published APK) - see `native-kotlin.md`.

## 5. Branch and ship protocol
Develop on the designated branch; the owner authorised pushing to `main` for StepUp (`git push origin <branch>:main` and push the branch too). If a push is rejected because the remote has commits you lack: fetch + merge, do not force-push. Commit messages end with the session attribution lines. Never create a PR unless asked.
