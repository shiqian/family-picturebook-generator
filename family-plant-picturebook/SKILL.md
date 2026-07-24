---
name: family-plant-picturebook
description: Turn a plant science dossier or children-facing plant guide into a reusable family picture-book series with imagegen-generated text-and-image pages, visual QA, and 3:4 final pages. Use when the user asks to create, redraw, systematize, or reuse a “七七的植物世界” style plant 绘本, Xiaohongshu-ready picture-book images, parent-child botanical story pages, or a workflow after shanghai-plant-guide-series.
---

# Family Plant Picturebook

Use this skill to produce a family plant picture-book series from source-backed plant content. It is the visual/story production stage after `shanghai-plant-guide-series`; it must not invent plant facts.

If the result drifts away from the bundled sample-book visual language, regenerate the page image.

## What This Skill Produces

Create a project output folder containing:

1. `story_text.md` - read-aloud page copy and dialogue;
2. `page_specs.json` - final page text, visual constraints, and semantic text-container intent;
3. `final_pages/` - finished 3:4 PNG pages in reading order;
4. `qa_report.md` - visual and factual QA notes.

Final page contract: exact 3:4 ratio at `1086 × 1448 px` for delivery. Use this pixel size whenever the image-generation tool exposes size control; if generation returns another exact 3:4 size, normalize it to `1086 × 1448 px` only after confirming that no text, characters, plant details, or safe margins are damaged.

## Inputs

Accept any of these:

1. a plant name, then first run or request `shanghai-plant-guide-series`;
2. an existing children-facing plant guide;
3. a complete scientific dossier plus user instructions.

Optional inputs:

1. series number, such as `No.30`;
2. reference character image or previous pages;
3. requested output directory.

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
3. Keep the book warm, polished, and story-like, with mother-child interaction as the emotional center.
4. Keep the page art in the sample-book language unless the user explicitly asks for a different look.
5. Use the `imagegen` skill for every production page. Generate the illustration and its final Chinese text together in one image-generation call so the typography, bubbles, lighting, and composition belong to the same visual scene.
6. Put every visible Chinese sentence in `page_specs.json` and the image prompt verbatim, then inspect the generated page for text accuracy. Never accept pseudo-text, missing text, or a near-match.

## Style Target

Match the bundled sample-book look:

1. polished warm 3D children’s picture-book rendering;
2. soft natural light and gentle shadow separation;
3. rounded child proportions and expressive mother-child interaction;
4. visible botanical structure rendered with volume;
5. native speech bubbles, title banners, and note panels that integrate the generated text;
6. enough scene density to feel like a complete illustrated page, not an icon sheet.

Recommended prompt phrase for every page image:

`native portrait 3:4 children's picture-book page, target final canvas 1086 by 1448 pixels, not 9:16, not 4:5, not square, not landscape, warm 3D rendering, soft natural light, layered depth, refined pastel palette, full-page story composition, leave safe spaces for integrated Chinese text and native speech bubbles or caption panels`

## Workflow

### 1. Lock the Source

Before drafting or generating anything, confirm in the project step log:

1. the target plant name is locked;
2. the scientific dossier or children-facing guide exists and is the only factual source;
3. the reference files listed above have been read;
4. at least 2 sample pages from `assets/examples/erqiao-yulan/final_pages/` have been inspected;
5. the output folder exists and a step log has started.

If any of these are missing, stop before image generation.

### 2. Plan the Book

Default to 7 pages:

1. cover;
2. first encounter;
3. name origin;
4. plant secret or growth mechanism;
5. close-up observation;
6. look-alike comparison;
7. warm ending.

Use natural mother-child dialogue. Do not force a warning ending on every book.

Before any page art is generated, freeze the paired plan for all pages in `page_specs.json`:

1. exact dialogue or caption copy;
2. how many bubbles, cards, banners, or labels each page needs;
3. the semantic container, placement, alignment, and approximate amount of space needed for each text block;
4. which sample page or pages it borrows layout density from.
5. seasonal and ecological background constraints for the scene, including a short whitelist of plausible companion plants and a short blacklist of plants or flowers that must not appear together if their blooming season conflicts.

The paired plan must be complete enough to drive composition before page-image generation starts.

### 3. Define the Visual System

Create `characterOutfitSheet` in `page_specs.json` before generating pages. This is mandatory for each book.

Keep identity consistent, but adapt clothing to the story:

1. Qiqi stays recognizable through face, big eyes, child proportions, and usually two braids;
2. Mom stays recognizable through round glasses, gentle expression, and shoulder-length brown hair;
3. clothing may change with season, weather, habitat, and activity;
4. within one book, keep the locked outfit sheet consistent unless the story clearly changes day, season, weather, location, or activity;
5. repeat the exact outfit sheet in every image prompt.

Use `assets/characters/qiqi-and-mom-reference.png` for identity guidance. Use the Erqiao sample pages for mood, density, and composition rhythm, not as a clothing template.

### 4. Generate Final Page Images With `imagegen`

This is the canonical production stage. Do not generate a text-free base page first and treat later text compositing as the normal workflow; for this series, integrated imagegen text produces the most natural page design.

For each page:

1. use the `imagegen` skill's built-in image-generation path by default;
2. include the exact page text from `page_specs.json` in the prompt and require verbatim Chinese rendering;
3. generate a native 3:4 page image with the final text already integrated into speech bubbles, cards, banners, or panels;
4. keep the page visually close to the sample-book style;
5. reject weak, flat, schematic, poster-like, misspelled, or pseudo-text pages and regenerate them before moving on;
6. for any page with crouching, pointing, carrying, or multi-character interaction, state the arm and hand pose explicitly in the prompt so the generator does not invent extra limbs.

The page image is where composition, character pose, plant layout, and final text are decided together.

`render_picturebook_text.js` is an optional fallback and diagnostic helper for explicitly requested post-processing or controlled repair. It is not the default production path and must not replace `imagegen` for new pages.

### 5. Accept Each Generated Page

After a page image is generated:

1. Check dimensions immediately. The delivery target is exactly `1086 × 1448 px` (3:4).
2. Check the page role, exact Chinese text, text legibility, character anatomy, and plant subject at a glance.
3. If the ratio, text, or content fails, regenerate that page before moving to the next one.
4. If the ratio is correct but the size is not `1086 × 1448 px`, normalize only when safe margins are preserved, then record it in `qa_report.md`.

Keep the text-container and lettering details in `references/text-rules.md` and the page plan in `page_specs.json`; do not duplicate those rules in the production loop.

### 6. Keep a Step Log

Keep `step_log.md` in the output folder and append one short entry after each meaningful action or retry. Each entry should state: the page/file, the action, the result, and any risk or follow-up. Keep it current while working; do not reconstruct it only at the end.

### 7. Run Layered QA Before Delivery

Run `scripts/check_picturebook_set.js` on the final output folder, then complete a visual and factual review. Confirm four groups:

1. **Package:** required files exist, page filenames and order are complete, and every final page is exactly `1086 × 1448 px`.
2. **Text:** every visible character matches `page_specs.json`; text is legible, correctly placed, and free of pseudo-text or accidental old text.
3. **Continuity:** Qiqi, Mom, outfits, typography feel, anatomy, page roles, and overall sample-book style remain consistent.
4. **Botany:** plant morphology, comparison details, safety wording, and seasonally plausible backgrounds match the source guide.

If any page fails, regenerate only that page when possible, update `step_log.md`, and rerun the QA gate before delivery.

## Bundled Resources

Use these files as needed:

1. `references/series-style-guide.md` - visual style, characters, clothing adaptation, page art constraints;
2. `references/page-blueprints.md` - 7-page structure and page spec shape;
3. `references/text-rules.md` - imagegen text fidelity, native text-container, and common-character rules;
4. `references/assets-guide.md` - bundled character and sample-book usage;
5. `assets/characters/qiqi-and-mom-reference.png` - default character identity reference;
6. `assets/examples/erqiao-yulan/final_pages/` - canonical sample pages for the current series look;
7. `scripts/render_picturebook_text.js` - optional repair and diagnostic helper, not the default production path;
8. `scripts/check_picturebook_set.js` - final output QA report;
9. `scripts/check_png_ratio.js` - PNG ratio gate for final pages;
10. `scripts/check_skill_assets.js` - verify bundled character and sample-book assets are present and 3:4.
