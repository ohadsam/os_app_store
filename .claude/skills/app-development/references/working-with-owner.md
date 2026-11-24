# Working with the owner in chat

* **Language**: the owner writes Hebrew; reply in Hebrew, short and plain. Code, commits, docs in English (user guide + strings in both).
* **Ledger**: every request/suggestion goes into `docs/REQUESTS.md` immediately with a status; before finishing, walk the whole list - nothing silently dropped; if something cannot be done, say why.
* **Decisions the owner already made are not re-litigated** (e.g. defaults ON for map/weather/planner; puppet option shelved; human-designer brief). Record decisions with the date in the docs. When truly blocked on an owner decision, ask once with a recommendation (AskUserQuestion with options), otherwise choose the conventional default and state it.
* **Honest reports**: what was verified how (unit, e2e on a stand-in, CI), what only a phone can prove, what failed and was fixed (e.g. the Kotlin compile error). Never "done" before CI + release + Pages are verified live. State pitfalls found (existing installs flip defaults).
* **ChatGPT hand-offs**: give the prompt file path and the prompt text, list what is blocked; when the owner returns a zip, validate and integrate only if good, otherwise explain precisely what is wrong and offer options (the owner picks).
* **Scheduling**: after pushing, schedule a CI re-check (`send_later`) and end the turn instead of sleeping; tell the owner what will be checked.
* **Skills and checklists are updated in the same change** when a step was missing - and the owner is told.
* **Efficiency**: read only what the change touches, edit rather than rewrite, no repeated re-reads, reports short; agents/sub-sessions only when asked or truly parallel.
* **Context loss**: sessions get summarised; keep `docs/CONTEXT.md` (status, file map, next steps) and the checklist state current so a fresh session continues from docs alone.
* **Privacy**: never put the owner's personal details in external requests; no secrets in the repo (the committed signing key is the one documented exception).
