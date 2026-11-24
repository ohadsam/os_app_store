# OS APPs and Downs

The private app store of OS (a PWA): every app I built, in one place. Websites and PWAs open in one tap; Android apps download as APK files with an illustrated install guide. Search, filters, tags, screenshots, versions, release dates. Hebrew first (RTL), English equal. No server, no account, no tracking.

**Live:** https://ohadsam.github.io/os_app_store/ (GitHub Pages; Settings -> Pages -> Source = GitHub Actions)

## Develop
```bash
npm install
npm run serve                        # http://localhost:8080
npm run check && npm test && npm run e2e
npm run journey -- .tmp/journey      # screenshots of every screen, he + en
npm run sync -- --local /path/to/clones   # compare the catalog with the real apps (add --write to update)
```
Start at [`docs/CONTEXT.md`](docs/CONTEXT.md). Catalog how-to: [`docs/CATALOG.md`](docs/CATALOG.md). Release process: [`.claude/skills/release-checklist/SKILL.md`](.claude/skills/release-checklist/SKILL.md). The step every other app's release checklist needs: [`docs/APP_RELEASE_STEP.md`](docs/APP_RELEASE_STEP.md).

All rights reserved © OS. All images were created with various AI tools or generated from the apps themselves; contact via GitHub Issues about any problem.
