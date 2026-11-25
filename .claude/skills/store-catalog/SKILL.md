---
name: store-catalog
description: How to add, update or remove an app in the owner's store "OS APPs & Downs" (web/data/apps.json in ohadsam/os_app_store) and how other apps' sessions keep it current. Use when an app ships a new version, a new app is created, an APK/PWA link or package changes, screenshots need refreshing, or when asked to "update the store".
---

# Updating the store catalog

Read `docs/CATALOG.md` (schema, APK states, dates) first. Short version:
- **New version of an app** -> run (or trigger) the sync: `npm run sync -- --local <clones> --write`, or the GitHub workflow `sync-catalog.yml` (works from any session: `mcp__github__actions_run_trigger`). It updates version, updated date and English what's-new from the app's CHANGELOG. Then add `whatsNew.he`.
- **New app** -> copy an existing entry; fill he + en for name/tagline/description/highlights; pick category + tags (existing dictionary, he + en for new ones); icon in `web/art/icons/` (web apps: their `icons/icon-192.png`; native: `npm run native-icons`); `source` (repo, version file, regex with the version in group 1, changelog file + heading like `## v{v}`); screenshots from running the app (`scripts/capture-shots.mjs` or its guide images); `npm test`.
- **Changed links/APK name/package/min Android/private** -> edit the entry by hand (the sync cannot see it).
- Never edit screenshots by hand; never invent versions or dates; keep descriptions factual (from the app's README/CONTEXT).
- From another app's repo: the step is in that repo's release checklist (`docs/APP_RELEASE_STEP.md` in the store repo has the text). Ship = push to `main` of `ohadsam/os_app_store`; Pages deploys; verify the live catalog.
