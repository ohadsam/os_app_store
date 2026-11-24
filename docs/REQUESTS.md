# Requests ledger (nothing is silently dropped)

Owner's brief, 2026-11-24 (Hebrew, voice dictated). Status: done / partial / open.
1. PWA that is the owner's app store; web-only apps (System Designer, seating planner) are links. **done**
2. PWA/native apps downloadable with all links and info. **done** (APK direct links; ClockWise/Tehilim link to the releases page; Extended File Manager has no public APK yet - stated in the app)
3. Install explanation for APK outside Play Store, with Android-style screens (unknown source, harmful-file warning, scan), generic, behind a "show more" in every app. **partial**: drawn phone illustrations of each real Android dialog (localised, RTL), not real screenshots - see PENDING_CHATGPT_PROMPTS.md
4. Looks like a real store: links, search, filtering, tags, what each app is. **done**
5. Always points to the latest version and shows it. **done** (catalog + `sync-catalog` + daily workflow)
6. The store's release checklist checks every app for needed updates and updates the store. **done** (release-checklist step + sync script)
7. Other apps' release checklists must update the store the same way. **done** (2026-11-24, owner approved): step added to the release-checklist of StepUp, SonRise, FindMyCar, Special Events, SmartRing, ClockWise, Extended File Manager, System Designer, Tehilim Daily (also in the two copies of the generic checklist), and to `AGENT.md` (Itim) / `CLAUDE.md` (Seating Planner), which have no checklist file. Pushed to `main` of each repo with `[skip ci]` (docs only)
8. A release-checklist file; use the app-creation skill (PWA only); same standards, tests, Playwright display tests. **done**
9. Screenshots from the apps (run their tests) inside each description. **partial**: 6 web apps done; 5 native apps need a device
10. Release dates, update dates, copyright, "all images from various AI tools; contact if a problem". **done**
11. Name: OS APPs and Downs ("Ups" written APPs). **done**
12. Token-efficient, beautiful, comfortable, high quality. **ongoing**
13. Include every app built since the seating planner: StepUp, SonRise, FindMyCar, Itim, System Designer, Special Events, SmartRing, ClockWise, Extended File Manager, Tehilim Daily (+ seating planner). **done** (AITracker is private and not an app for others: left out; jira-addin-host and the small tools are not apps)
14. (2026-11-24) Detailed per-app install explanation: all steps, what to expand in the pop-ups, permissions needed. **done (1.2.0)**: permissions from the real manifests + per-app setup notes + guide steps + troubleshooting. Still drawn illustrations, not real screenshots (pending).
15. Hebrew and English, Hebrew default, changeable in settings. **done (1.2.0)**: Settings page + top-bar switch.
16. The store logo shows the store name. **open**: the delivered logo is a symbol only (the name is shown as text next to it in the header); prompt for a logo lockup with the name is in `docs/prompts/LOGO_LOCKUP_PROMPT.md`.
17. Tehilim Daily: available, in-app update check + update, release checklist, build. **partial**: the in-app updater already existed (0.18.0) and is now merged to `main`; stable APK assets added; build run from CI. Blocked on the owner: the repo is private (see its AGENT.md: make it public after rotating the signing key, or publish releases to a public repo).
