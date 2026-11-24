# UI/UX, the in-app user guide, and screenshots from the tests

## 1. UI/UX principles (owner's rules; check them in review pass 3 on every change)
* **Audience first**: everyone from beginners to regulars, often outdoors in sunlight, one hand, on the move. Few things per screen; group the rest; short kind wording; big targets (>= 44 px web / 48 dp native); one clear primary action per screen; the activity screen shows only what is needed mid-activity.
* **Self-explanatory**: clear titles, one-line hints, visible state (never colour alone), empty states with art + one action, errors that say what to do next, every icon button labelled.
* **Controls grouped by topic in ONE unified toolbar on ONE row** with dropdowns - never a pile of buttons, never wrapping onto several rows. Settings and long pages start **collapsed with a one-line summary per section**.
* **Hebrew first / English equal / RTL-safe**: only CSS logical properties (`margin-inline-*`, `inset-inline-*`, `text-align:start`); directional icons flip; numbers/time stay LTR where needed; a space between number and unit (`5 ד׳`, `5 m`); neutral plural forms in Hebrew; both languages for every string (parity test).
* **Looks**: light, dark and a high-contrast "sunlight" look from design tokens; contrast in both themes (ink 4.5:1, glyphs 3:1); `prefers-reduced-motion` + an in-app "calm animations" switch; animations always have a complete still frame.
* **Safe defaults**; destructive actions confirmed with specific wording or undoable; permission asks explained in-app in plain words.
* **Responsive**: 320 px no horizontal scroll; wide layout on desktop/tablet; flex/grid children `min-width:0`.
* **Keyboard/a11y**: focus visible, keyboard path for drag & drop, `role`s that satisfy axe (list rows `role=listitem`), one `h1` per screen, unique ids. axe stays at ZERO.
* Beautiful matters: compare every new screen next to existing ones; art comes from the design kit (design-assets.md).

## 2. The user guide - always current, in three places
1. `docs/USER_GUIDE.md` (plain text for GitHub readers).
2. The **in-app guide** (`js/guide.js` data + `js/ui/guide.js`): an interactive tour, one step per feature/area, each with a title, text, a **screenshot**, and a "take me there" action; en + he; a unit test checks every step's strings exist in both languages and every screenshot file exists.
3. **Search** (actions / your data / the guide) finds the new feature's words; What's New = the CHANGELOG section of the version.
Every user-visible change updates all of them in the same change - new setting/screen/feature => guide text, even one sentence, plus the screenshot.

## 3. Screenshots come from the tests (never hand-made)
* **One source**: the e2e journey (`tests/e2e/journey.mjs <dir>`) walks the real UI in Chromium on mocked services (`tests/e2e/mocks.mjs`: planner/weather stubs, geolocation, fake clock/Android stand-in), saves a PNG per step in **he and en**, and audits every screen.
* **Guide images**: `GUIDE_DIR=web/art/guide node tests/e2e/journey.mjs <dir>` regenerates the compact JPEGs the in-app guide uses (`<lang>-<step>.jpg`). Regenerate after any UI change that touches a guided screen, commit them, and make sure they are in `sw.js` SHELL if the guide shows them offline (or cached on first view - decide and test).
* **Contact sheets**: the journey also writes sheets (several screens side by side) so you can review dozens of screens in a few images; **look at them** (Read the PNG) - looking at the screenshots is part of the review, not optional. `--sheets` rebuilds sheets only.
* **Per-change screenshots**: `npm run e2e -- --shots <dir>` saves the e2e steps' pictures; view every changed screen in he and en, light and dark.
* The tour is also how the README/store screenshots and the shareable images are made - one pipeline, always current.

## 4. The usability audit inside the journey (what it flags)
Touch targets below the minimum, horizontal overflow, text below the minimum size, broken pictures, more than one `h1`, too many choices on one screen, missing labels, axe violations - printed as a table of findings. The target is an **empty findings table**; anything left must be justified in the report.
