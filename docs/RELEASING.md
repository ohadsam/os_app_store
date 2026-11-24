# Releasing and setup

One-time (owner): GitHub repo `ohadsam/os_app_store`, Settings -> Pages -> Source = **GitHub Actions**; Actions -> General -> Workflow permissions = Read and write (the sync workflow commits). Optional secret `CATALOG_TOKEN` (fine-grained PAT, read-only Contents on the private app repos, e.g. Tehilim_Daily) so the sync can read them.
Ship: work on the designated branch, `npm run check && npm test && npm run e2e`, bump (`npm run bump -- patch|minor|major`), CHANGELOG, push the branch and (owner authorised) `main`; `ci.yml` runs on every push; `pages.yml` deploys `web/` when it changed. Verify the live `version.json` shows the new version.
Catalog-only changes (new version of an app) need no store version bump: the catalog is served network-first. They deploy through Pages like any `web/**` change.
Automatic: `sync-catalog.yml` runs daily (and on demand, also callable from the other apps' release step) and commits catalog updates to `main`, then triggers `pages.yml`.
Live URL: `https://ohadsam.github.io/os_app_store/`.
