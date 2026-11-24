# Adapting the skill to ANY domain (new apps, not only fitness)

This skill was distilled from StepUp (walking/running), SonRise (family routines), Special Events (birthdays/occasions), Smart Alarm Clock, Kodesh (prayer/Torah texts), Tehilim Daily, ExtendedFileManager. The **method, pipeline, quality gates and UX rules are domain-independent**; domain facts are not. Names such as "workout", "GPS", "steps" in the references are *examples of an activity the user starts* - read them as "the app's core activity".

## 1. Intake (ask/decide before the first line of code; write the answers into `docs/CONTEXT.md` + `CLAUDE.md`)
1. **Who and where**: audience (age, ability, language), context of use (one hand outdoors / at a desk / in the kitchen / at prayer), languages (Hebrew-first RTL + English by default), how often, offline needs.
2. **Core activity**: the one thing the person does (record a run, run a routine, keep a list of occasions, ring an alarm, read a text). It gets the distraction-free screen; everything else is grouped/collapsed. Define its states, what must survive a reload/kill, and what must keep working in the background.
3. **Data**: what is stored, where (device only by default), sensitivity (health, family, religious, financial -> encryption, no logs, export opt-in), backup/restore format, import of untrusted data.
4. **Platform choice**: PWA + thin Android shell (default) vs native Kotlin (when the product is native by nature: alarms, file access, calendar/contacts integration, heavy background). See `native-kotlin.md`.
5. **Native capabilities needed** (pick from the menu in §2; each adds permissions, bridge methods, Kotlin tests, review items).
6. **Online services** (APIs, tiles, weather, text sources): each one named, allow-listed in CSP, opt-out-able, cached, with a graceful offline fallback and a probe-verified endpoint (never assumed from docs).
7. **Domain rules that must come from the owner**, not be inferred (halacha/legal/medical/financial/scheduling rules, content sources): list them, confirm each, mark the source in code.
8. **Design language**: personality in 3 words, palette, packs, character/mascot yes/no, motion rules -> `docs/DESIGN_LANGUAGE.md` and the first ChatGPT prompt (`design-assets.md`).
9. **Success + safety**: the core task in <= 2-3 taps for a first-time user; defaults that protect people; wording that is guidance, not professional advice.

## 2. Capability menu (include only what the product needs)
| Capability | Where described | Adds |
|---|---|---|
| Permissions screen + start-up sheet | android-webview-shell §3 | state model, bridge, event, tests (ANY app that asks for a permission) |
| In-app update that installs as an update | android-webview-shell §4 | `REQUEST_INSTALL_PACKAGES`, Updater, checksum asset |
| Share the app / What's New / About | sharing-about-whatsnew | links, sheet, changelog data |
| Background work (service/alarms/boot re-arm/sensors) | android-webview-shell §5 | foreground service, receivers, battery rules |
| Notifications and reminders | same | channels, `POST_NOTIFICATIONS`, schedule math (pure) |
| Widgets | android-webview-shell §6 | providers, snapshot JSON, RemoteViews |
| Location / maps / routing | StepUp (`weatherApi.ensureLocation`, `ui/maptiles.js`) | permission, tiles CSP, rounding, backoff |
| Camera / photos / files / share targets | StepUp `PhotoMath`, `shareImage`; Smart Alarm `AppSharer`; ExtendedFileManager (SAF) | FileProvider, SAF/MediaStore, narrow permissions |
| NFC / Bluetooth / peer links | SonRise (WebRTC, NFC tags, HCE) | hardware caveats, never verified without devices |
| Voice / audio / TTS | StepUp `Voice.kt`, SonRise voices | TTS engine availability, Hebrew voices |
| Calendar-like data (Hebrew dates, holidays, schedules) | SonRise `holidays.js`, Kodesh `calendar.js`, Special Events | pure date logic via `Intl`, owner-confirmed rules, tests |
| Text/content sources (APIs) | Kodesh (Sefaria/Hebcal), Tehilim | probe workflow, date-stamped refs, offline fallback, source whitelist |
| Backup/restore, import/export, sync codes | StepUp `backup.js`, SonRise | versioned, sanitised, size-bounded |
| Characters/mascots, animations | design-assets.md | sprite or SVG rig, calm switch |
| Accounts / servers | none by default | would need a threat model first - ask the owner |

## 3. Examples of the same method in different domains
* **Fitness (StepUp)**: core activity = recording a walk/run; background = GPS service + step sensor; widgets; map/weather online; characters.
* **Family routines (SonRise)**: core = running a routine with timers/avatars; alarms in the background; family links over WebRTC/Bluetooth/NFC; Hebrew calendar quiet days.
* **Occasions/birthdays (Special Events)**: native Kotlin; contacts + calendar, scheduled reminders, optional SMS (opt-in, capped, shows cost), import files untrusted.
* **Alarm clock (Smart Alarm)**: native; exact alarms, boot re-arm, snooze state persisted, share-the-APK.
* **Texts/prayer (Kodesh, Tehilim)**: content from verified sources, nusach rules from the owner, large type, offline cache, `AGENT.md` memory.
* **Files/tools (ExtendedFileManager)**: SAF/MediaStore, narrow permissions, never destructive without undo.
Any new domain: run the intake, take the pipeline and gates unchanged, pick capabilities from the menu, and write the domain's owner-confirmed rules into the docs first.

## 4. What stays fixed in every domain
Pipeline (branch -> CI -> main -> release + Pages -> live verification), release checklist with the five reviews, tests + axe + screenshots from the journey + full regression at the end of each stage, docs kept current, requirements ledger, Hebrew/English/RTL, ChatGPT-made design assets by exact prompts, honest reports about what only a device can prove, the in-place update guarantee.
