# Lessons learned (check before touching the same area)

## Feature checklist for a new app of this kind (any domain; drop what does not apply)
Welcome/empty states with art · Settings (collapsed sections, one-line summaries) · Permissions section + start-up sheet · Update button · Backup/restore (versioned, sanitised, SKIP list for volatile keys like location timestamps) · Share picture/card · In-app guide with screenshots + global search (actions, data, guide) · What's New from CHANGELOG · Calm-animations switch · Light/dark/sunlight (high-contrast) look · Hebrew/English + RTL · Reminders/notifications (Android native, browser while open) · Widgets · Records/celebrations · Weekly challenge/summary.

## Incidents
| Area | What happened | Rule |
|---|---|---|
| PWA update | Installed PWA stayed on old version: new worker cached files from the 10-min HTTP cache; open page kept old JS | install with `cache:'reload'`; reload once on `controllerchange` (0.24.1) |
| Kotlin | `/simplify` deleted `notificationPermission()` still used by `trackStart`; only CI caught it | grep every deleted helper; CI is the compiler |
| i18n | Hebrew strings with nested quotes broke a Python edit script | use ״ or script files, not inline shell quoting |
| DOM | duplicate id, `replaceChildren(null)` | unique ids; `setChildren()`/`h()` |
| axe | `aria-required-children`, contrast on chips | `role=listitem` rows, tinted chip background |
| e2e | init script re-seeded prefs each navigation | seed only when null |
| Geolocation | retry storm when position fails | failure backoff (30 min), freshness 6 h, rounded coordinates |
| Async UI | sheet appeared over the core activity after an async read; listener leaks | re-check state after awaits; remove listeners |
| Native events | `ask()` never answered when already granted | always emit `permissions-changed` |
| Update UI | progress lost leaving Settings | native `updateRunning` + re-attach |
| Images | halos/skin-colour mask from ChatGPT PNGs | key colour background; restrict detection area |
| ChatGPT packages | V4/V6/puppet/revision zips not good | review + report defects; do not integrate by default |
| Docs | file missing from CONTEXT file map fails docs test | add every new file to the map in the same change |
| SW | file missing from SHELL / listed but absent | static check covers `.webp` too |
| Defaults | flipping defaults affects existing installs | say so in CHANGELOG + report |
| Actions | payments/spending limit stops runs | not a code failure; stop and tell owner |
| Release | Pages only redeploys when `web/**` changes | Android-only commit not redeployed: expected |
| Native apps | see `native-kotlin.md` (Room REPLACE cascade, UTC date picker, recurrence, signing mismatch) | |
| Android sensors | The step counter was read by an alarm / widget update; since Android 9 a background app gets NO sensor events, so the count only moved when the app was opened (0.25.1) | keep one listener in a foreground service of type `health` (batched in hardware); never rely on a background read (0.25.2) |
| CSP | `setAttribute('style', ...)` (an SVG attribute for an animation delay) is blocked by `style-src 'self'` and fails e2e with a console error | set custom properties through `el.style.setProperty` (CSSOM) |
| e2e init scripts | a new parameter added to `newPage` but not to the `addInitScript(({...}) => ...)` destructuring: the script threw inside its try and silently did nothing | destructure every field you pass; assert the effect once |
| Journey | a screen that leaves a running workout in `da.active` breaks the next screen (the page re-persists on pagehide) | leave the screen by route change, then clear storage; do not reload |
| Motion in screenshots | animated charts caught half-grown in the tour | run the journey with `reducedMotion: 'reduce'` |
| Auto start | a movement detector must tell travel from GPS wander | require distance, speed AND straightness over a short window, ignore inaccurate fixes, back-date to the first qualifying fix, always offer "start now" and fall back when there is no GPS |

