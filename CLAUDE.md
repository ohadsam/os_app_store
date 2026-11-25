# OS APPs & Downs - instructions for Claude

Start with `docs/CONTEXT.md` (product, status, file map, rules). Then follow `.claude/skills/release-checklist/SKILL.md` for every change (owner's standing rules, five reviews, tests, docs, **catalog sync**, ship to `main`).
The reusable method is `.claude/skills/app-development/SKILL.md` (copied from the owner's apps). This store is **PWA only**: ignore its Android shell / native Kotlin / APK-signing parts. Updating the catalog: `.claude/skills/store-catalog/SKILL.md` and `docs/CATALOG.md`.
Keep `docs/CONTEXT.md`, `docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/CHANGELOG.md`, `docs/USER_GUIDE.md`, `docs/REQUESTS.md` and the in-code file map current in the same change that alters them.

## App specifics
- Audience and context of use: the owner and people they send the link to (family, friends), mostly on an Android phone, often non-technical: big targets, short kind wording, install steps explained with pictures.
- Core activity: browse -> open a web app or download an APK -> follow the install guide. Nothing must be lost on reload (filters may reset; favourites and installed marks persist).
- Languages: Hebrew first (RTL), English equal. App names and descriptions exist in both.
- Data and privacy: no server, no account, no analytics. Only per-device preferences are stored. All outbound navigation is a plain link the person taps.
- Online services allowed (CSP): none (`connect-src 'self'`). The sync script/workflow (CI only) reads raw.githubusercontent.com.
- Owner-confirmed rules: name "OS APPs & Downs"; footer/About must say all rights reserved, all images are AI-generated, contact for problems; screenshots come from running the apps' own tests/code, never hand-edited; the catalog always points to the latest version; other apps' release checklists must update this store.
- Native capabilities used: none (PWA only).
