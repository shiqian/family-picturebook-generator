---
name: family-plant-picturebook-generator
description: Turn a plant science dossier or children-facing plant guide into a reusable family picture-book series with imagegen-generated text-and-image pages, visual QA, and 3:4 final pages. Use when the user asks to create, redraw, systematize, or reuse a “七七的植物世界” style plant 绘本, Xiaohongshu-ready picture-book images, parent-child botanical story pages, or a workflow after shanghai-plant-guide-series.
---

# Family Plant Picturebook Generator

Use this skill to produce a family plant picture-book series from source-backed plant content. It is the visual/story production stage after `shanghai-plant-guide-series`; it must not invent plant facts.

If the result drifts away from the bundled sample-book visual language, regenerate the page image.

## What This Skill Produces

Create exactly one book folder under the repository-level `output/` directory:

```text
output/<plant-slug>/
```

The book folder must contain:

1. `continuity/` - the two per-book visual character continuity sheets;
2. `source/` - the source-backed scientific dossier and child-facing guide used for the book;
3. `story_text.md` - read-aloud page copy and dialogue;
4. `page_specs.json` - final page text, visual constraints, character continuity references, semantic text-container intent, and prompt records;
5. `step_log.md` - production actions, retries, and risks;
6. `final_pages/` - finished 3:4 PNG pages in reading order;
7. `qa_report.md` - visual and factual QA notes.

For the full `shanghai-plant-guide-series` handoff, `source/` must contain:

```text
source/
├── scientific-dossier.md
└── child-guide.md
```

Use the scientific dossier as the factual authority and the child guide as the narrative source. Do not generate picturebook copy from an uncaptured chat response when these source files can be preserved in the book folder.

Use a stable lowercase plant slug such as `yulan`, `guihua`, or `gou-shu`. Do not create book outputs in `out/`, inside the skill directory, or in ad-hoc folders. Draft or diagnostic files, if needed, belong under `output/<plant-slug>/drafts/` and are not delivery files.

Write `step_log.md` in English, except for plant names, quoted Chinese text, and filenames when required. Create it before any workflow action and append one event for each meaningful step, user decision, retry, or automated check. Use this fixed format:

```markdown
## Event 0001 — 2026-07-25 17:32:14 +08:00 — Script — Initialization
- Timestamp: 2026-07-25 17:32:14 +08:00
- Action: Created the controlled output folders and initialized the production log.
- Output: `source/`, `continuity/`, and `final_pages/` created.
- Decision: Await source handoff.
- Risk: Plant taxon is not locked.
```

Use one concise line for each field. Actors are `User`, `Codex`, or `Script`. Use timestamps to seconds in `Asia/Shanghai` time. Event numbers must increase sequentially. Record retries as new events; never rewrite history. Lifecycle scripts append their own events. When the user requests a final-page change, record the user request, Codex action, and resulting QA as separate events.

Final page contract: exact 3:4 ratio at `1086 × 1448 px` for delivery. Use this pixel size whenever the image-generation tool exposes size control; if generation returns another exact 3:4 size, normalize it to `1086 × 1448 px` only after confirming that no text, characters, plant details, or safe margins are damaged.

## Inputs

Accept any of these:

1. a plant name; in this case, **must invoke `shanghai-plant-guide-series` before any picture-book research, drafting, or image generation**;
2. an existing children-facing plant guide;
3. a complete scientific dossier plus user instructions.

Preferred input is both the scientific dossier and the child-facing guide. A single supplied file may be used for drafting, but it cannot pass the final package gate until both source files are present; do not invent or silently reconstruct the missing stage.

When the input is only a plant name, do not proceed to picture-book production until the upstream workflow has produced both required source files. Web research, an uncaptured chat response, or an existing example file does not substitute for running the upstream workflow.

Optional inputs:

1. series number, such as `No.30`;
2. reference character image or previous pages;
3. optional plant slug; the default output directory is fixed by the output contract above.

If no external reference images are supplied, use the bundled assets:

1. `assets/characters/qiqi-and-mom-reference.png` for Qiqi and Mom identity;
2. `assets/examples/erqiao-yulan/final_pages/` for sample-book page style, typography feel, and composition density.

## Reference Files

Read these before production:

1. `references/page-blueprints.md`;
2. `references/series-style-guide.md`;
3. `references/text-rules.md`;
4. `references/assets-guide.md`.

The bundled sample pages are a style reference only. Do not copy their plant facts, names, clothing, or page copy into other books unless the source content supports it.

## Core Rules

1. Use only facts from the supplied dossier/guide.
2. Do not invent morphology, name origins, folklore, safety claims, or comparisons.
3. Use the `imagegen` skill for every continuity sheet, production page, and content repair; generate each visual asset with its required text integrated in the same imagegen call.
4. Keep every visible sentence in `page_specs.json` and the recorded imagegen prompt; never accept pseudo-text, missing text, or a near-match.

## Workflow

### 0. Initialize and preflight before production

Always initialize the book and create `step_log.md` before any other workflow action. If the input is only a plant name, invoke `shanghai-plant-guide-series` immediately after initialization.

1. Run `npm run init:picturebook -- <plant-slug>` from the generator repository root. This creates the controlled output folders and Event 0001.
2. Save the source files, update the log title to `# Production Log — <中文名> (<scientific name>)`, append a source-handoff event, then run `npm run preflight:source -- output/<plant-slug>`.
3. After `story_text.md`, both continuity PNGs, and `page_specs.json` are complete, run `npm run preflight:visual -- output/<plant-slug>` before generating final pages.
4. After each stage, append a concise event to `step_log.md`; after each page, record its generation or retry immediately.

`step_log.md` is a required state ledger, not end-of-run documentation. Do not generate continuity sheets before the source preflight passes or final pages before the visual preflight passes.

### 1. Get the Source Text Files

If the input is only a plant name, invoke `shanghai-plant-guide-series` before any picture-book research, drafting, or image generation. Do not proceed until the required source handoff exists.

Use the scientific dossier as the factual authority and the child guide as the narrative source. Confirm the target plant, read the four reference files, inspect at least two bundled sample pages, update the initialized log title with the locked plant name and taxon, and record this source lock before moving on.

### 2. Plan the Story

Create `story_text.md` and plan seven pages by default:

1. cover;
2. first encounter;
3. name origin;
4. plant secret or growth mechanism;
5. close-up observation;
6. look-alike comparison;
7. warm ending.

Use natural mother-child dialogue, keep every fact source-backed, and do not force a warning ending on every book. Record the story plan and any factual risks in one `step_log.md` event.

### 3. Design Character Outfit References

Use `story_text.md` and the page roles to derive the outfits from the story's season, setting, weather, and activities. Decide which poses and accessories the story requires before generating the continuity sheets. Then use the bundled `assets/characters/qiqi-and-mom-reference.png` as the shared identity reference. It is one combined Qiqi-and-Mom image; create two book-specific visual PNGs:

```text
output/<plant-slug>/continuity/qiqi-outfit-sheet.png
output/<plant-slug>/continuity/mom-outfit-sheet.png
```

Use the `imagegen` skill to generate each sheet. Each sheet must show standing front, standing three-quarter, crouching or kneeling three-quarter, and relevant clothing/accessory details. Record the exact written outfit specifications and both image paths in `page_specs.json` under `characterContinuity`. Inspect the sheets internally and continue when they satisfy the story-derived season, setting, weather, activity, and written specifications; pause only when a design decision is required. Record the result in one `step_log.md` event.

Treat buttons as a high-risk detail: if visible, include a close-up and record their exact count and placement; if they are not story-relevant, simplify or hide them.

Use continuity sheets for exact character and outfit details. Use sample or earlier final pages only for style and composition; never infer locked outfit details from them.

### 4. Design the Visual System

Before drawing any final page, complete `page_specs.json` for all pages. Include:

1. exact visible text in `textBlocks`;
2. `characters` present on each page;
3. semantic text containers, placement, alignment, and approximate space needs;
4. sample-page layout-density references for style only;
5. seasonal and ecological background constraints;
6. the applicable identity and continuity PNG references;
7. the complete first-attempt `imagegenPrompt` for every page, including each page's literal text.

Do not prescribe pixel coordinates for normal imagegen production. Freeze this visual plan before drawing, run the visual preflight, and record the result in one `step_log.md` event.

### 5. Draw the Final Pages

For every page, use the `imagegen` skill's built-in image-generation path. Attach the bundled identity reference and the applicable continuity PNG(s), repeat the written outfit lock, include the exact page text, and generate the illustration and final Chinese text together on a native 3:4 canvas. When buttons are visible, state: “Preserve the exact button count, spacing, and placement from the continuity sheet. Do not add, remove, or redesign buttons.”

After each generation, check the page role, text, legibility, visible continuity details, anatomy, plant subject, and dimensions. Redraw a failed page before continuing. All content repairs use targeted complete-page imagegen redraws; never create a text-free base image and add text afterward. Only safe non-content resizing to `1086 × 1448 px` is allowed after generation. Record every generation and retry in one `step_log.md` event immediately after saving it.

### 6. Run the Automated Gate Check

After all pages are in `output/<plant-slug>/final_pages/`, run from the generator repository root:

```bash
npm install  # first run only, if sharp is not installed
node family-plant-picturebook-generator/scripts/check_picturebook_set.js output/<plant-slug>/final_pages
```

The gate writes `output/<plant-slug>/qa_report.md` and checks required files, continuity specifications and PNGs, bundled identity reference, page/prompt references, filename order, PNG format, and exact `1086 × 1448 px` dimensions. If it fails, fix or redraw the affected page, update `step_log.md`, and rerun the gate.

### 7. Complete Manual QA

Read `qa_report.md` and review the whole book for:

1. exact, legible Chinese text with no pseudo-text or old text;
2. Qiqi and Mom identity, outfits, bags, glasses, shoes, anatomy, and typography continuity; when buttons are visible, verify their count and placement;
3. plant morphology, comparison details, safety wording, and seasonal plausibility;
4. page-role coverage, narrative flow, visual density, and overall sample-book style.

Only deliver when both the automated gate and this visual/factual review pass. Record the final decision and any remaining risks in one `step_log.md` event. The final package is incomplete if `step_log.md` is missing, malformed, or not updated through the final stage.

## Bundled Resources

Use these files as needed:

1. `references/series-style-guide.md` - visual style, characters, clothing adaptation, page art constraints;
2. `references/page-blueprints.md` - 7-page structure and page spec shape;
3. `references/text-rules.md` - imagegen text fidelity, native text-container, and common-character rules;
4. `references/assets-guide.md` - bundled character and sample-book usage;
5. `assets/characters/qiqi-and-mom-reference.png` - default character identity reference;
6. `assets/examples/erqiao-yulan/final_pages/` - canonical sample pages for the current series look;
7. `scripts/check_picturebook_set.js` - final output QA report;
8. `scripts/check_png_ratio.js` - PNG ratio gate for final pages;
9. `scripts/check_skill_assets.js` - verify bundled character and sample-book assets are present and 3:4;
10. `scripts/init_picturebook_run.js` - initialize a controlled book output folder and step log;
11. `scripts/preflight_picturebook_run.js` - validate source or visual prerequisites before production;
12. `scripts/step_log_utils.js` - format, append, and validate production-log events.
