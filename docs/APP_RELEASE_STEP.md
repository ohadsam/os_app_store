# Release-checklist step for EVERY app: update the store "OS APPs and Downs"

Paste this as the last step before "Done means" in each app's `.claude/skills/release-checklist/SKILL.md` (and in `app-development/references/release-checklist.md`):

```
## Store - update "OS APPs and Downs" (every shipped version)
The owner's app store (repo `ohadsam/os_app_store`, https://ohadsam.github.io/os_app_store/) must always show this app's latest version.
1. After the release is live (APK release / Pages deployed), find the app's entry in `web/data/apps.json` (its `source` block says which file here holds the version).
2. Preferred: trigger the store's sync - GitHub Actions -> "Sync catalog" -> Run workflow in `ohadsam/os_app_store` (or `mcp__github__actions_run_trigger` workflow `sync-catalog.yml`). It reads this repo's version + CHANGELOG and updates version, update date and what's-new.
3. If this session can write to the store repo instead: edit the entry (`version`, `updated`, `whatsNew` he + en, `links` if the APK name/URL changed, new `shots`), run `npm test` there, push to `main`.
4. If the change is user-visible, re-capture screenshots (`web/art/shots/<id>/`) from this app's e2e/journey images.
5. A changed APK file name, package id, min Android, platforms or install flow also changes the entry (`links.apk`, `apk.*`, `platforms`). Say in the report that the store was updated (or why not).
```

Apply to a local clone: `node scripts/patch-release-checklists.mjs <dir containing the clones>` inserts it (idempotent); then commit in each repo.
