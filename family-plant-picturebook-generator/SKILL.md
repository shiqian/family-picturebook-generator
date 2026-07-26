---
name: family-plant-picturebook-generator
description: Turn a plant science dossier or children-facing plant guide into a reusable family picture-book series with imagegen-generated text-and-image pages, visual QA, and 3:4 final pages. Use when the user asks to create, redraw, systematize, or reuse a “七七的植物世界” style plant 绘本, Xiaohongshu-ready picture-book images, parent-child botanical story pages, or a workflow after shanghai-plant-guide-series.
---

# Family Plant Picturebook Generator

Use this skill to produce a family plant picture-book series from source-backed plant content. It is the visual/story production stage after `shanghai-plant-guide-series`; it must not invent plant facts.

If the result drifts away from the bundled sample-book visual language, regenerate the page image.

## Output Contract

Create exactly one book folder under the repository-level `output/` directory:

```text
output/<plant-slug>/
```

The book folder must contain:

- `continuity/` - the two per-book visual character continuity sheets;
- `source/` - the source-backed scientific dossier and child-facing guide used for the book;
- `story_text.md` - read-aloud page copy and dialogue;
- `page_specs.json` - final page text, visual constraints, character continuity references, semantic text-container intent, and prompt records;
- `step_log.md` - the append-only production log for actions, retries, and risks;
- `final_pages/` - finished 3:4 PNG pages in reading order;
- `qa_report.md` - visual and factual QA notes.

For a full `shanghai-plant-guide-series` handoff, `source/` contains:

```text
source/
├── scientific-dossier.md
└── child-guide.md
```

Use the scientific dossier as factual authority and the child guide as narrative source. Preserve both files in the book folder.

Use a stable lowercase plant slug such as `yulan`, `guihua`, or `gou-shu`. Do not create book outputs in `out/`, inside the skill directory, or in ad-hoc folders. Draft or diagnostic files, if needed, belong under `output/<plant-slug>/drafts/` and are not delivery files.

Create the production log `step_log.md` before any workflow action. Write it in English except for plant names, quoted Chinese text, and filenames when required. Append one event for each meaningful step, user decision, retry, or automated check.
Required fields are `Timestamp`, `Action`, `Output`, `Decision`, and `Risk`. Use actors `User`, `Codex`, or `Script`, sequential event numbers, and `Asia/Shanghai` timestamps to seconds. See [`references/step-log.md`](references/step-log.md) for the exact format and lifecycle rules.

Final page contract: exact 3:4 ratio at `1086 × 1448 px` for delivery. Use this pixel size whenever the image-generation tool exposes size control; if generation returns another exact 3:4 size, normalize it to `1086 × 1448 px` only after confirming that no text, characters, plant details, or safe margins are damaged.

## Inputs

| Input | Required handling |
|---|---|
| Plant name only | Requires a `shanghai-plant-guide-series` source handoff before this skill can proceed. |
| Child-facing plant guide | Use as narrative source; obtain the scientific dossier before final delivery. |
| Complete scientific dossier | Use as factual authority; create or obtain the child-facing guide before final delivery. |
| Optional user instructions | Apply when they do not conflict with source facts or workflow gates. |

A single supplied file may support drafting, but the final package requires both source files. Do not invent or silently reconstruct a missing stage. Web research, an uncaptured chat response, or an example file does not replace the upstream workflow.

Optional: series number, reference images, and a plant slug. The output directory remains fixed by the output contract.

Default bundled references:

- `assets/characters/qiqi-and-mom-reference.png` — character identity;
- `assets/examples/erqiao-yulan/final_pages/` — style, typography feel, and composition density.

## Reference Files

Read these before production:

| File | Use |
|---|---|
| `references/page-blueprints.md` | Page roles and `page_specs.json` shape |
| `references/series-style-guide.md` | Style, character, clothing, and art constraints |
| `references/text-rules.md` | Text fidelity and text-container rules |
| `references/assets-guide.md` | Bundled asset usage |
| `references/step-log.md` | Logging specification and production-log rules |

The bundled sample pages are a style reference only. Do not copy their plant facts, names, clothing, or page copy into other books unless the source content supports it.

## Core Rules

- Use only facts from the supplied dossier and guide.
- Do not invent morphology, name origins, folklore, safety claims, or comparisons.
- Use the `imagegen` skill for every continuity sheet, production page, and content repair. Generate required text in the same call as the image.
- Keep every visible sentence in `page_specs.json` and the recorded imagegen prompt. Reject pseudo-text, missing text, and near-matches.

## Workflow

### 0. Initialize the run

Action:

1. Run `npm run init:picturebook -- <plant-slug>` from the repository root.
2. Confirm `step_log.md` exists before any other production action.

Record:

- The initialization script creates the first production-log event; confirm that it exists before continuing.

Gate:

- The controlled output folder and production log must exist.

### 1. Complete the Source Handoff

Action:

1. If the input is a plant name, use `shanghai-plant-guide-series` before research, drafting, or image generation.
2. Save or confirm both source files under `output/<plant-slug>/source/`.
3. Update the log title to `# Production Log — <中文名> (<scientific name>)`.
4. Run `npm run preflight:source -- output/<plant-slug>`.

Record:

- Append one production-log event for the source handoff. The preflight script appends the source-preflight event.

Gate:

- Do not continue until source preflight passes.

### 2. Plan the Story

Action:

1. Read the scientific dossier as factual authority and the child guide as narrative source.
2. Read `references/page-blueprints.md`, `references/series-style-guide.md`, `references/text-rules.md`, and `references/assets-guide.md`.
3. Inspect at least two sample pages from `assets/examples/erqiao-yulan/final_pages/` for style, typography, composition, and visual density.
4. Create `story_text.md`.
5. Plan seven pages by default:

   1. cover;
   2. first encounter;
   3. name origin;
   4. plant secret or growth mechanism;
   5. close-up observation;
   6. look-alike comparison;
   7. warm ending.

Requirements:

- Use natural mother-child dialogue.
- Keep every fact source-backed.
- Do not force a warning ending on every book.

Record:

- Append one production-log event summarizing the story plan, outputs, decisions, and factual risks.

Gate:

- The story has seven page roles unless a documented plant-specific reason requires a change.

### 3. Design Character Outfit References

Action:

1. Use `story_text.md` and page roles to derive season, setting, weather, activities, poses, and accessories.
2. Use `assets/characters/qiqi-and-mom-reference.png` as the shared identity reference.
3. Generate exactly two separate book-specific PNGs with `imagegen`:

```text
output/<plant-slug>/continuity/qiqi-outfit-sheet.png
output/<plant-slug>/continuity/mom-outfit-sheet.png
```

- `qiqi-outfit-sheet.png` — Qiqi, the girl;
- `mom-outfit-sheet.png` — Mom.

4. Write the exact outfit specifications and both PNG paths to `page_specs.json` under `characterContinuity`.
5. Inspect both continuity sheets.

Each sheet must show:

- standing front;
- standing three-quarter;
- crouching or kneeling three-quarter;
- relevant clothing and accessory details.

Requirements:

- Treat buttons as a high-risk detail: if visible, include a close-up and record their exact count and placement; if they are not story-relevant, simplify or hide them.
- Use continuity sheets for exact character and outfit details.
- Use sample or earlier final pages only for style and composition; never infer locked outfit details from them.

Record:

- Append one production-log event summarizing the continuity design, created files, decision, and remaining risk.

Gate:

- Both sheets must be readable and show the required views and locked details.
- Pause only if a design decision remains unresolved.

### 4. Design the Visual System

Action:

- Before drawing final pages, complete `page_specs.json` for every page. Include:

  - exact visible text in `textBlocks`;
  - `characters` present on each page;
  - semantic text containers, placement, alignment, and approximate space needs;
  - sample-page layout-density references for style only;
  - seasonal and ecological background constraints;
  - the applicable identity and continuity PNG references;
  - the complete first-attempt `imagegenPrompt` for every page, including each page's literal text.

Requirements:

- Use semantic placement, not pixel coordinates.
- Freeze the visual plan before drawing.
- Run the visual preflight before final-page generation.
- Run `npm run preflight:visual -- output/<plant-slug>` after `story_text.md`, both continuity PNGs, and `page_specs.json` are complete.

Record:

- Append one production-log event summarizing the frozen visual plan. The preflight script appends the visual-preflight event.

Gate:

- Visual preflight must pass before final-page generation.

### 5. Draw the Final Pages

Action:

For each page:

1. Use the `imagegen` skill's built-in image-generation path.
2. Attach the identity reference and applicable continuity PNGs.
3. Repeat the written outfit lock and exact page text.
4. Generate illustration and Chinese text together on a native 3:4 canvas.
5. If buttons are visible, state: “Preserve the exact button count, spacing, and placement from the continuity sheet. Do not add, remove, or redesign buttons.”
6. Check page role, text, legibility, continuity, anatomy, plant subject, and dimensions.

Requirements:

- Redraw a failed page before continuing.
- Use a complete-page imagegen redraw for content repairs.
- Never create a text-free base image and add text afterward.
- Only safe non-content resizing to `1086 × 1448 px` is allowed after generation.

Record:

- Append one production-log event immediately after each page generation or retry. Include the page file, output, decision, and risk.

Gate:

- Every page must pass its content and dimension checks before the automated gate.

### 6. Run the Automated Gate Check

Action:

- After all pages are in `output/<plant-slug>/final_pages/`, run from the repository root:

```bash
npm install  # first run only, if sharp is not installed
node family-plant-picturebook-generator/scripts/check_picturebook_set.js output/<plant-slug>/final_pages
```

The gate writes `output/<plant-slug>/qa_report.md` and checks:

- required files and production-log structure;
- continuity specifications and PNGs;
- bundled identity reference;
- page and prompt references;
- filename order and PNG format;
- exact `1086 × 1448 px` dimensions.

Record:

- The gate script appends the automated result to the production log.

Gate:

- Repair the reported package or page issue, append an event, and rerun the gate.

### 7. Complete Manual QA

Action:

- Read `qa_report.md` and review:

- exact, legible Chinese text with no pseudo-text or old text;
- Qiqi and Mom identity, outfits, bags, glasses, shoes, anatomy, and typography continuity; when buttons are visible, verify their count and placement;
- plant morphology, comparison details, safety wording, and seasonal plausibility;
- page-role coverage, narrative flow, visual density, and overall sample-book style.

Record:

- Append one final production-log event with the delivery decision and remaining risks.

Gate:

- Deliver only when automated gate and manual review both pass.
- Treat the package as incomplete if the production log is missing, malformed, or not updated through the final stage.

## Bundled Resources

| Group | Files | Purpose |
|---|---|---|
| References | `references/series-style-guide.md`, `page-blueprints.md`, `text-rules.md`, `assets-guide.md`, `step-log.md` | Load before production as specified above. |
| Assets | `assets/characters/qiqi-and-mom-reference.png`, `assets/examples/erqiao-yulan/final_pages/` | Character identity and style references. |
| QA | `scripts/check_picturebook_set.js`, `check_png_ratio.js`, `check_skill_assets.js` | Validate output, dimensions, and bundled assets. |
| Lifecycle | `scripts/init_picturebook_run.js`, `preflight_picturebook_run.js`, `step_log_utils.js` | Initialize runs, check prerequisites, and maintain production-log events. |
