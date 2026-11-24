# <App> - project context (START HERE)

Read this first in a new session. Keep it current: the release checklist requires it and `tests/unit/docs.test.js` fails when a source file is missing from the file map.

## What it is
<one paragraph: product, audience, platforms (PWA + Android WebView shell), languages, data stays on device>. Branch `main` is primary. Owner's rules: `.claude/skills/release-checklist/SKILL.md` §0. Requests: `docs/REQUESTS.md`. Plan: `docs/ROADMAP.md`. Generic method: `.claude/skills/app-development/`.

## Status (x.y.z)
Done: ... Not done / needs a phone: ...

## How to run and verify
`npm run serve` · `npm run check && npm test && npm run e2e` · CI = only Kotlin gate.

## Architecture in one picture
ui/* -> store/engine/stats -> util; web -> native.js -> NativeBridge.kt -> pure *Math.kt.

## Data model (sanitised on read)
...

## File map (every source file and its job)
- `web/js/app.js` - ...

## Working rules (short)
Follow the release checklist for every change; docs current in the same change.

## Next steps
...
