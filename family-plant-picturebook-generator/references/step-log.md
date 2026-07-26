# Production Log

Use `output/<plant-slug>/step_log.md` as the append-only production log.

## Event format

```markdown
# Production Log — <中文名> (<scientific name>)

## 2026-07-26 14:20:10 +08:00 | Script | initialize | completed
- Output: `source/`, `continuity/`, and `final_pages/` created.
- Risk: Taxon is not locked yet.
```

The header contains:

- timestamp in `Asia/Shanghai` with seconds and `+08:00`;
- actor: `User`, `Codex`, or `Script`;
- concise action;
- outcome such as `completed`, `blocked`, `repaired`, or `failed`.

Each event has only two body fields:

- `Output` — what was created, changed, or checked;
- `Risk` — the main unresolved risk, or `None`.

## Event rules

- Create the file before any production action.
- Append events; never rewrite or delete earlier events.
- Record meaningful stage completions, user decisions, generated or repaired assets, automated QA, and final delivery.
- Do not record every small internal action.
- Scripts append events when they perform a meaningful lifecycle action.
- Codex appends events when a meaningful production action or user intervention occurs.
- Validate header format, actor, timestamp order, and required body fields.
