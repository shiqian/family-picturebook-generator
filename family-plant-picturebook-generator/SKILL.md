---
name: family-plant-picturebook-generator
description: Turn a source-backed plant dossier and child guide into a reusable family picture-book series with imagegen-generated text-and-image pages, character continuity references, visual QA, and exact 3:4 final pages. Use when the user asks to create, redraw, or systematize a “七七的植物世界” style plant picture book, or requests this workflow after shanghai-plant-guide-series.
---

# Family Plant Picturebook Generator

Create a source-backed family plant picture book. Use only facts from the supplied scientific dossier and child guide. Use `imagegen` for every generated image, including continuity sheets, final pages, and repairs.

## Output contract

At the repository root—the directory containing `package.json` and `README.md`—create exactly one book under:

```text
output/<plant-slug>/
```

Keep this layout:

```text
output/<plant-slug>/
├── continuity/
│   ├── qiqi-outfit-sheet.png
│   └── mom-outfit-sheet.png
├── source/
│   ├── scientific-dossier.md
│   └── child-guide.md
├── story_text.md
├── page_specs.json
├── step_log.md
├── final_pages/
└── qa_report.md
```

Use a stable lowercase slug. Do not write delivery files to `out/`, ad-hoc folders, or the skill directory. Drafts belong under `output/<plant-slug>/drafts/`.

Final pages must be PNG files at exactly `1086 × 1448 px` (`3:4`).

## Inputs

- Plant name only: run or request `shanghai-plant-guide-series` first.
- Child guide only: obtain the scientific dossier before delivery.
- Scientific dossier only: obtain the child guide before delivery.
- Both source files: continue with the workflow.

Do not invent or silently reconstruct a missing upstream source stage.

## Reference loading

Load references only at the stage where they are needed. Do not preload all references.

| Stage | Read | Purpose |
|---|---|---|
| 1. Initialize | `references/step-log.md` | Create and validate the append-only log. |
| 2. Source handoff | No picture-book references | Finish both upstream source files first. |
| 3. Story plan | `references/page-blueprints.md`; at least two pages from `assets/examples/series-reference/final_pages/` | Page roles, story rhythm, dialogue, and visual density. |
| 4. Character references | `references/assets-guide.md`; `references/series-style-guide.md`; identity PNG | Character identity, story-derived outfit design, accessories, and poses. Do not attach series-reference pages. |
| 5. Visual system | `references/text-rules.md`; reuse `references/page-blueprints.md`; `references/series-style-guide.md` as needed | Text fidelity, page schema, semantic containers, and visual constraints. |
| 6. Image generation | Relevant parts of `references/text-rules.md` and `references/series-style-guide.md` | Prompt and review rules for the current image. |
| 7. QA | `page_specs.json`, source files, and `qa_report.md`; consult references only for manual review | Deterministic package checks plus manual text, factual, and visual review. |

Bundled references are visual only:

- `assets/characters/qiqi-and-mom-reference.png` — character identity;
- `assets/examples/series-reference/final_pages/` — series style, composition, typography, and density.

Never copy plant facts, names, clothing, or page text from the bundled visual references.

## Core generation rules

- Use only facts from the scientific dossier and child guide.
- Use `imagegen` for every continuity sheet, final page, and content repair.
- Generate Chinese text and illustration in the same imagegen call.
- Use the image-specific attachment matrix and state each reference purpose:
  - continuity sheet: attach `assets/characters/qiqi-and-mom-reference.png` for identity only; do not attach series-reference pages;
  - final page or repair: attach the identity PNG, the continuity PNG for every visible character, and one series-reference page for style and composition.
- Never create a text-free base and add text afterward.
- Redraw the complete page when text, content, outfit, anatomy, or style fails.
- Keep every visible sentence in `page_specs.json` and the recorded imagegen prompt.

## Workflow

### 1. Initialize output

1. From the repository root—the directory containing `package.json` and `README.md`—run `npm run init:picturebook -- <plant-slug>`.
2. Create the output folder and child folders.
3. Create `step_log.md` immediately, before any production action.
4. Confirm the first log event exists.

Do not begin story planning or image generation until both source files are complete.

Do not create story, character, visual, or image assets in this stage.

### 2. Complete source handoff

1. If given only a plant name, run or request `shanghai-plant-guide-series`.
2. Save complete `scientific-dossier.md` and `child-guide.md` under `source/`.
3. Confirm both files are non-empty and source-backed.
4. Do not continue until both source files are complete.

Append a concise `source handoff` event to `step_log.md` immediately.

### 3. Plan the storybook

1. Read `references/page-blueprints.md`.
2. Inspect at least two pages from `assets/examples/series-reference/final_pages/`.
3. Read the scientific dossier as factual authority and the child guide as narrative source.
4. Create and freeze `story_text.md`.
5. Plan seven pages by default: cover, first encounter, name, plant secret, close-up, comparison, and warm ending.
6. If using another page count, add `meta.pagePlanException` to `page_specs.json`.

Freeze `story_text.md` before generating any character or page image. Append a concise `story plan frozen` event to `step_log.md`.

Use natural mother-child dialogue and source-backed facts. Do not force a warning ending.

### 4. Create character continuity references

1. Read `references/assets-guide.md` and `references/series-style-guide.md`.
2. Use the story plan to derive season, habitat, weather, activity, poses, and accessories.
3. Attach `assets/characters/qiqi-and-mom-reference.png` for identity only.
4. Do not attach series-reference pages when generating continuity sheets.
5. Generate exactly two PNGs with `imagegen`:

```text
output/<plant-slug>/continuity/qiqi-outfit-sheet.png
output/<plant-slug>/continuity/mom-outfit-sheet.png
```

Each sheet must contain standing front, standing three-quarter, crouching or kneeling three-quarter, and an independent accessory-detail panel. The panel must show exact buttons, bag, notebook, shoes, hair accessories, glasses, and other locked details. Preserve the same design, colors, shapes, and counts across all views.

6. Write the exact outfit specifications and canonical PNG paths under `characterContinuity` in `page_specs.json`.
7. Inspect both sheets and confirm the detail panel agrees with all poses.

Append a concise `character continuity` event to `step_log.md` immediately.

### 5. Design the visual system

1. Read `references/text-rules.md`.
2. Reuse the page schema and roles from `references/page-blueprints.md`.
3. Read `references/series-style-guide.md` only if visual constraints need review.
4. Complete `page_specs.json` for every page with:
   - exact `textBlocks`;
   - `characters`;
   - semantic text containers and placement;
   - seasonal and ecological constraints;
   - applicable identity and continuity paths;
   - at least one series-reference path;
   - a purpose label for every reference;
   - the complete first-attempt imagegen prompt.
4. Freeze the visual plan before drawing.

Freeze the visual plan before any final-page generation. The final QA command checks the deterministic package contract.

### 6. Generate images

For every continuity sheet, final page, retry, or repair:

1. Use the `imagegen` skill.
2. For a continuity sheet, attach the identity PNG only and state that it controls identity; derive outfit and accessory details from the frozen story plan and written specifications.
3. For a final page or repair, attach the identity PNG, the continuity PNG for every visible character, and one series-reference page; label identity, outfit/accessory, and style/composition purposes explicitly.
4. For final pages, include exact page text and native semantic text-container instructions. For continuity sheets, include the exact written outfit and accessory specification.
5. Generate text and illustration together on a native 3:4 canvas.
6. Inspect the result before continuing to the next page.
7. Record a concise production-log event immediately for the meaningful generation or repair. Do not defer logging until final QA.

If buttons are visible, state: “Preserve the exact button count, spacing, and placement from the independent continuity detail panel. Do not add, remove, or redesign buttons.”

### 7. Automate and manually review QA

Run the one final automated check:

```bash
npm install  # first run only, if sharp is not installed
npm run check:picturebook -- output/<plant-slug>/final_pages
```

The command writes `qa_report.md` and checks only deterministic package contracts:

- output structure and non-empty source files;
- append-only production-log format;
- canonical continuity paths and readable PNGs;
- image-generation reference paths and purpose labels;
- page records and page-plan exception;
- final PNG filenames, format, and exact dimensions.

After automated QA passes, manually review:

- exact Chinese text and native typography;
- identity, outfit, accessory, pose, and style continuity;
- independent detail-panel agreement;
- anatomy and button details;
- plant morphology, comparison facts, safety wording, and seasonal plausibility;
- page roles, narrative flow, and visual density.

Use `references/visual-qa-checklist.md` as the required page-by-page checklist. Copy its checks into `qa_report.md`, mark every item PASS or FAIL, and set `Manual QA sign-off: PASS` only after all pages pass. Any failure requires a complete imagegen redraw and a repair event in `step_log.md`.

Deliver only after automated and manual QA pass. Append a final delivery event to `step_log.md`.

## Bundled resources

| Group | Files | Purpose |
|---|---|---|
| References | `references/page-blueprints.md`, `series-style-guide.md`, `text-rules.md`, `assets-guide.md`, `step-log.md` | Load progressively by workflow stage. |
| Assets | `assets/characters/qiqi-and-mom-reference.png`, `assets/examples/series-reference/final_pages/` | Identity and visual style references. |
| QA | `scripts/check_picturebook_set.js`, `scripts/check_png_ratio.js`, `scripts/check_skill_assets.js`, `references/visual-qa-checklist.md` | Deterministic package and asset checks plus manual visual review. |
| Lifecycle | `scripts/init_picturebook_run.js`, `scripts/step_log_utils.js` | Initialize output and maintain the production log. |
