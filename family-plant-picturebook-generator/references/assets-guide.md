# Bundled Asset Guide

Use these bundled assets to make the skill portable across chats and projects.

## Character Reference

Default asset:

`assets/characters/qiqi-and-mom-reference.png`

Use it to preserve identity:

1. Qiqi is a young girl with large curious eyes, rounded child proportions, brown hair, and usually two braids.
2. Mom has shoulder-length brown hair, round glasses, a gentle expression, and a patient explaining posture.
3. Clothing in this image is identity reference only, not a permanent outfit requirement.

When prompting image generation, describe identity and the current book's locked outfit separately. Do not say only “same as reference image,” because that can accidentally copy old clothing.

## Canonical Series Reference

Default sample pages:

`assets/examples/series-reference/final_pages/`

Use these pages as visual references for:

1. warm 3D picture-book rendering;
2. 3:4 Xiaohongshu-ready composition;
3. mother-child dialogue rhythm;
4. title/subtitle hierarchy;
5. speech bubble scale and placement;
6. botanical close-up density;
7. overall series polish.

Use these pages only for style, composition, typography, and visual density. Do not copy their plant facts, names, clothing, page titles, or subtitles into another plant book.

## Per-book Continuity Sheets

Every book creates two visual PNG continuity sheets under its output folder:

```text
output/<plant-slug>/continuity/
├── qiqi-outfit-sheet.png
└── mom-outfit-sheet.png
```

Use `imagegen` to generate and inspect both sheets after the source handoff and before finalizing page prompts. Each sheet must include four clearly separated areas: standing front, standing three-quarter, crouching or kneeling three-quarter, and an independent enlarged clothing-and-accessory detail panel. The detail panel is not another pose; it must separately show exact buttons, bags, notebooks, shoes, hair accessories, glasses, and other locked details.

Use this prompt instruction: “Draw the accessory detail panel separately from the three full-body pose views. Preserve the same exact design, colors, shapes, and counts across all views. Show no alternative accessory versions.”

Record the two paths and the written locked details in `page_specs.json` under `characterContinuity`. Attach the applicable PNG to every page prompt. These sheets are visual continuity references, not final pages or text-composition bases.

Use the bundled `assets/characters/qiqi-and-mom-reference.png` as the identity anchor for both sheets. This is one combined identity image; the Qiqi and Mom continuity PNGs add the current book's exact outfits, accessories, and pose views.

## Recommended Reference Loading

When starting a new book:

1. inspect `assets/characters/qiqi-and-mom-reference.png` for character identity;
2. inspect at least 2 pages from `assets/examples/series-reference/final_pages/` for layout and typography feel;
3. create the two per-book continuity sheets based on the new plant's season, habitat, weather, and story activity;
4. attach the applicable continuity-sheet reference and state its outfit/accessory purpose in every page prompt.

## Portability Rule

Never depend on files from a prior chat, generated-image cache, Downloads folder, or user-specific absolute path if an equivalent bundled asset exists. Use relative paths inside this skill whenever possible.
