# Sharing the app (WhatsApp...), version, About, What's New, updates

Every app of this kind ships these four things together, in the same Settings area. Reference implementations: **SonRise** (`ohadsam/morning_organizer`: `web/js/appShare.js`, `ui/shareApp.js`, `changelog.js`, `ui/whatsnew.js`, `ui/settings.js`) and **StepUp** (`web/js/update.js`, `ui/about.js`).

## 1. Share the app - WhatsApp first
* Two things can be shared: the **Android app** (link to `https://github.com/<owner>/<repo>/releases/latest/download/<app>.apk`, always the newest build) and the **web app** (`https://<owner>.github.io/<repo>/`, opens in any browser, installable PWA). Show both, each with a one-line hint.
* Buttons per kind (one row, labelled, >= 44 px): **WhatsApp** = a plain link `https://wa.me/?text=<encodeURIComponent(text)>` (`target=_blank rel=noopener`; works in a browser and in the WebView, which hands external links to the system), **E-mail** = `mailto:?subject=..&body=..`, **More...** = the system share sheet (`NativeBridge.share(subject,text)` on Android -> Android's chooser which lists WhatsApp, Bluetooth, Nearby Share; `navigator.share` in a browser; clipboard fallback), **Copy link** (clipboard + toast; if the clipboard is blocked show the text in a read-only, auto-selecting field).
* The text is short, friendly, in the current language (he/en), names the app, says what it does in one line, gives the link, and for Android one line on how to install (allow "install unknown apps" once). Built by one pure function (`shareLinks(kind, lang)` -> `{url, text, subject, whatsapp, mail}`; everything percent-encoded) with a unit test (links start with the right prefixes, the text contains the URL, he and en differ).
* Search index entry (`share app whatsapp email invite install link apk` + Hebrew words) and a guide step.
* Native: the Android bridge `share(text)` validates and caps the text (`BridgeLimits`), nothing else can be shared from the page; images use `shareImage` (FileProvider). Native-only apps send the APK **file** itself (Smart Alarm Clock `AppSharer`: fresh copy of the installed APK through `FileProvider`, refuses a stale versionCode, `<queries>` for WhatsApp / WhatsApp Business / Gmail) - see `native-kotlin.md`.
* Privacy: the share text contains only the app links - never user data. E2E: the sheet renders the buttons, the WhatsApp href decodes to the text, the share-sheet path is stubbed (fake bridge), axe clean.

## 2. Version number, About, manual download
* The version is shown in Settings (and About) from **one source**: `web/version.json` -> `appVersion.js`; on Android `native.version()` (APK) is used when it differs (so a stale web cache is visible). Never hard-code a version in strings.
* **About block**: version, the manual APK link (always works, also when the in-app update fails), the share button(s), links to the guide and What's New, licences/attributions for online data (OpenStreetMap, Open-Meteo...) as required.

## 3. Updates box (top of Settings)
"Check for updates" (+ version): browser -> refresh the service worker and reload; Android -> verified download and install as an UPDATE. States and texts: checking, latest ("you have the newest version"), newer (shows the release notes cut from `CHANGELOG.md`), downloading with progress, verifying, installing, confirm, done, and each error reason with the manual link; offline shows the offline picture. Details and the fake-bridge test: `android-webview-shell.md` §4, `pwa-pages-actions.md` §2.
* The web app should also check **by itself** (SonRise 1.18.1: on open and hourly, switch to the new version on its own - never while an activity is running, a sheet is open or the person is typing).

## 4. What's New
* **Data**: an in-app `changelog.js` list `{ v, en: [...], he: [...] }`, newest first (user-facing bullets only, short, one or two emoji at most, no implementation detail). `docs/CHANGELOG.md` is the developer/release-notes copy (cut into the GitHub Release); a unit test requires every version to exist in both, with both languages.
* **Sheet** (`ui/whatsnew.js`): title with the version, this version's bullets, buttons that jump to the new screens, "earlier versions" collapsed, the version number at the bottom. **Shown once after an update** (`seen` version in localStorage; compare with the running version; **never on the very first run**, never over a running activity), and always reachable from Settings/Home and the search ("what's new").
* Release checklist ties in: bump version -> add the CHANGELOG section **and** the `changelog.js` entry (he + en) -> guide -> test.

## 5. Gaps to remember
StepUp today: share through the system sheet (`shareApp` in `update.js`), update box with release notes, About block with manual APK link and version. **Not yet in StepUp**: a dedicated WhatsApp/e-mail share sheet and an in-app What's New sheet (SonRise has both) - port them when the owner asks; do not claim StepUp has them.
