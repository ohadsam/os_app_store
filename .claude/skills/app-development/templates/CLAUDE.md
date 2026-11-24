# <App name> - instructions for Claude

Start with `docs/CONTEXT.md` (product, status, file map, rules). Then follow `.claude/skills/release-checklist/SKILL.md` for every change (owner's standing rules, five reviews, tests, docs, ship to `main`).
The reusable, domain-independent method (pipeline, permissions, updates, sharing, design assets, Pages/Actions, tests with screenshots) is the skill `.claude/skills/app-development/SKILL.md` - copy that folder into this repo first.
Keep `docs/CONTEXT.md`, `docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/CHANGELOG.md`, `docs/USER_GUIDE.md`, `docs/REQUESTS.md` and the in-code file map current in the same change that alters them.

## App specifics (fill in from the intake - references/domain-adaptation.md §1)
- Audience and context of use:
- Core activity and what must survive a reload/kill:
- Languages: Hebrew first (RTL), English equal.
- Data and privacy rules (what is stored, what may leave the device):
- Online services allowed (CSP list) and fallbacks:
- Owner-confirmed domain rules (source, date):
- Native capabilities used (permissions list):
