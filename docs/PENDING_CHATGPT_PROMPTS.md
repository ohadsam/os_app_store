# Pending design / asset requests
| Item | Status | Blocks |
|---|---|---|
| Real Android screenshots for the install guide (unknown-source dialog, harmful-file warning, Play Protect scan, install screen) | open - needs a real phone (Pixel/Samsung): take the screens, drop PNGs in `web/art/install/`, then swap `ui/mock.js` for `<img>` | nothing (illustrations work meanwhile) |
| Device screenshots of Special Events, SmartRing, ClockWise, Extended File Manager, Tehilim Daily | open - run each app on a phone / emulator, save to `web/art/shots/<id>/`, add to `apps.json` `shots` | screenshots section shows a "coming soon" note |
| Store logo, hero banner, backgrounds, empty-state art, category icons, install-guide art | **delivered and integrated in 1.1.0** (validated: allowed elements only, <= 5 KB each) | - |
| Logo lockup that contains the name "OS APPs & Downs" + share card, splash, hero refresh, about illustration, category badges | prompt ready in `docs/prompts/LOGO_LOCKUP_PROMPT.md` (owner runs it in ChatGPT) | the header shows the name as plain text next to the symbol until then |
| Logo lockups, wordmark, share card, splash with "&" | round 2 delivered them with "and" - NOT integrated; ask ChatGPT to regenerate files a, b, c, f, g with "&" (same design) | header logo, link preview image, splash |
