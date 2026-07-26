# Production Log — 构树 (Broussonetia papyrifera)

## Event 0001 — 2026-07-25 09:00:00 +08:00 — Script — Initialization
- Timestamp: 2026-07-25 09:00:00 +08:00
- Action: Created the controlled output folders and initialized the production log.
- Output: `source/`, `continuity/`, and `final_pages/` created.
- Decision: Await source handoff.
- Risk: Plant taxon is not locked yet.

## Event 0002 — 2026-07-25 09:05:00 +08:00 — User — Source handoff
- Timestamp: 2026-07-25 09:05:00 +08:00
- Action: Supplied 构树; the upstream source workflow was requested.
- Output: Scientific dossier and child guide saved under `source/`.
- Decision: Use the scientific dossier as the factual authority and the child guide as the narrative source.
- Risk: The origin of “构” is uncertain; do not present it as established fact.

## Event 0003 — 2026-07-25 09:20:00 +08:00 — Script — Source preflight
- Timestamp: 2026-07-25 09:20:00 +08:00
- Action: Checked the source files and production-log structure.
- Output: Required source files and log structure are valid.
- Decision: Continue to story planning.
- Risk: None recorded.

## Event 0004 — 2026-07-25 09:45:00 +08:00 — Codex — Story plan
- Timestamp: 2026-07-25 09:45:00 +08:00
- Action: Read the reference files, character reference, and sample pages; planned the seven-page story.
- Output: Cover, first encounter, name origin, dioecy, leaf/fruit close-up, mulberry comparison, and observation-diary ending.
- Decision: Keep the story source-backed and avoid forcing a warning ending.
- Risk: Do not encourage eating the fruit.

## Event 0005 — 2026-07-25 10:10:00 +08:00 — Codex — Character continuity
- Timestamp: 2026-07-25 10:10:00 +08:00
- Action: Generated and inspected Qiqi and Mom continuity sheets with `imagegen`.
- Output: Locked late-spring/early-summer observation outfits, notebook, and woven bag.
- Decision: Use continuity sheets for exact outfits and accessories; use sample pages only for style and composition.
- Risk: Monitor button count and placement across pages.

## Event 0006 — 2026-07-25 10:30:00 +08:00 — Codex — Visual plan
- Timestamp: 2026-07-25 10:30:00 +08:00
- Action: Froze `page_specs.json` before page generation.
- Output: Recorded page text, semantic containers, botanical constraints, continuity references, and prompts for all seven pages.
- Decision: Generate text and illustration together through `imagegen`.
- Risk: Watch for text errors, anatomy problems, drifting plant morphology, and inconsistent buttons.

## Event 0007 — 2026-07-25 10:35:00 +08:00 — Script — Visual preflight
- Timestamp: 2026-07-25 10:35:00 +08:00
- Action: Checked the source files, story plan, continuity sheets, page specifications, and production log.
- Output: Required visual-generation inputs are valid.
- Decision: Continue to final-page generation.
- Risk: None recorded.

## Event 0008 — 2026-07-25 12:00:00 +08:00 — Codex — Page generation
- Timestamp: 2026-07-25 12:00:00 +08:00
- Action: Generated all pages with integrated Chinese text and illustration through `imagegen`.
- Output: Seven final pages passed thumbnail review for plant morphology, mulberry comparison, and character continuity.
- Decision: Safely normalized 01-cover, 02-meet, and 07-ending to `1086 × 1448 px` after visual inspection.
- Risk: Page 5 required three redraws to match the continuity sheet; Mom's own viewpoint defines left/right button placement.

## Event 0009 — 2026-07-25 12:30:00 +08:00 — Script — Automated gate
- Timestamp: 2026-07-25 12:30:00 +08:00
- Action: Ran `check_picturebook_set.js`.
- Output: Seven PNG pages, exact dimensions, continuity references, prompt records, source files, and file order passed.
- Decision: Continue to manual QA.
- Risk: None recorded.

## Event 0010 — 2026-07-25 13:00:00 +08:00 — Codex — Manual QA
- Timestamp: 2026-07-25 13:00:00 +08:00
- Action: Reviewed text, native bubbles/cards, character continuity, anatomy, plant morphology, comparison details, and seasonal plausibility.
- Output: No post-production text overlay or text patch used.
- Decision: Manual QA passed; retain conservative wording around fruit bristles and pollen sensitivity.
- Risk: None recorded.

## Event 0011 — 2026-07-26 13:00:08 +08:00 — Script — Automated gate
- Timestamp: 2026-07-26 13:00:08 +08:00
- Action: Automated gate
- Output: Picturebook package failed automated QA; see qa_report.md.
- Decision: Repair the package and rerun the gate.
- Risk: The package is not ready for delivery.

## Event 0012 — 2026-07-26 13:00:43 +08:00 — Script — Automated gate
- Timestamp: 2026-07-26 13:00:43 +08:00
- Action: Automated gate
- Output: Picturebook package passed automated QA.
- Decision: Continue to manual QA or deliver.
- Risk: None recorded.
## Event 0013 — 2026-07-26 13:01:06 +08:00 — Script — Automated gate
- Timestamp: 2026-07-26 13:01:06 +08:00
- Action: Automated gate
- Output: Picturebook package passed automated QA.
- Decision: Continue to manual QA or deliver.
- Risk: None recorded.
## Event 0014 — 2026-07-26 13:06:23 +08:00 — Script — Automated gate
- Timestamp: 2026-07-26 13:06:23 +08:00
- Action: Automated gate
- Output: Picturebook package passed automated QA.
- Decision: Continue to manual QA or deliver.
- Risk: None recorded.
## Event 0015 — 2026-07-26 13:21:08 +08:00 — Script — Automated gate
- Timestamp: 2026-07-26 13:21:08 +08:00
- Action: Automated gate
- Output: Picturebook package passed automated QA.
- Decision: Continue to manual QA or deliver.
- Risk: None recorded.
