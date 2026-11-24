# The catalog (`web/data/apps.json`)

**Add an app**: append an object (copy an existing one: both languages for name/tagline/description/highlights/shots captions, `source` for the sync), add an icon in `web/art/icons/`, screenshots in `web/art/shots/<id>/` (from the app's own tests or `scripts/capture-shots.mjs`), run `npm test` (the catalog test checks files, links, languages, sync source).
**Update an app's version**: `npm run sync -- --local <dir with the clones> --write` (or in CI: the daily workflow). It rewrites `version`, `updated`, `whatsNew.en`; add the Hebrew `whatsNew.he` lines by hand if you want them. Screenshots: re-capture when the UI changed noticeably.
**APK states**: `direct` = stable file name `releases/latest/download/<file>.apk` (button downloads it); `page` = link to the releases page (file name has a version/hash); `none` = no public APK (explain in `apk.note`). Private repo => `apk.private: true` (download needs a GitHub sign-in).
**Dates**: `released` = first release / first commit; `updated` = date of the latest version.
**Tags/categories**: edit the dictionaries at the top; every tag/category needs he + en.
**Native icons** come from each app's adaptive launcher vectors: `npm run native-icons`.
