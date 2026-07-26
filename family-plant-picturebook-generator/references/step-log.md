# Production Step Log

Use `output/<plant-slug>/step_log.md` as an append-only production record.

## Required format

Create the log before production begins. Use English except for plant names, quoted Chinese text, and filenames when needed.

```markdown
# Production Log — <中文名> (<scientific name>)

## Event 0001 — 2026-07-25 17:32:14 +08:00 — Script — Initialization
- Timestamp: 2026-07-25 17:32:14 +08:00
- Action: Created the controlled output folders and initialized the production log.
- Output: `source/`, `continuity/`, and `final_pages/` created.
- Decision: Await source handoff.
- Risk: Plant taxon is not locked.
```

Use one concise line per field:

- `Timestamp` — the same timestamp as the event header;
- `Action` — what happened;
- `Output` — what was created or changed;
- `Decision` — what was decided or happens next;
- `Risk` — the main unresolved risk, or `None`.

## Event rules

- Actors are `User`, `Codex`, or `Script`.
- Use `Asia/Shanghai` timestamps to seconds with the `+08:00` offset.
- Event numbers increase sequentially from `0001`.
- Append retries, user requests, and automated checks as new events; never rewrite history.
- Record a final-page change as separate user-request, Codex-action, and QA events.
- Keep the log current after each meaningful workflow action.

## Lifecycle events

The bundled scripts append their own events:

- `init_picturebook_run.js` — initialization;
- `preflight_picturebook_run.js` — source or visual preflight;
- `check_picturebook_set.js` — automated gate.

Codex records the source handoff, story plan, continuity design, visual plan, page generation or retry, and manual QA decision.

The validation utility in `scripts/step_log_utils.js` checks event numbering, timestamps, actor names, required fields, and chronological order.
