# Family Picturebook Generator

A reusable Codex skill for turning a source-backed plant guide into a consistent seven-page family picture-book series.

The generator keeps plant facts tied to the source guide, creates a fixed portrait page system, and includes bundled character/style references plus QA scripts for the final image set. It is the visual production stage after a scientific or child-facing plant guide has been prepared.

## What it demonstrates

- source-locked botanical storytelling with no invented plant facts;
- a repeatable seven-page narrative: cover, encounter, name, plant secret, close-up, comparison, and ending;
- consistent Qiqi-and-Mom character direction with a per-book outfit sheet;
- native 3:4 page composition with deterministic Chinese text and safe text containers;
- automated ratio and asset checks plus a manual visual/factual QA gate.

## Visual sample

The repository includes a canonical sample from the “七七的植物世界” series. These images define the intended visual language and composition density; they are reference assets, not a factual source for new plants.

| Cover | Plant detail | Comparison |
| --- | --- | --- |
| ![Sample cover](family-plant-picturebook/assets/examples/erqiao-yulan/final_pages/01-cover.png) | ![Sample flower close-up](family-plant-picturebook/assets/examples/erqiao-yulan/final_pages/05-flower-closeup.png) | ![Sample comparison page](family-plant-picturebook/assets/examples/erqiao-yulan/final_pages/06-comparison.png) |

## Layout

```text
.
├── README.md
├── family-plant-picturebook/
│   ├── SKILL.md
│   ├── agents/
│   ├── assets/
│   ├── references/
│   └── scripts/
└── .gitignore
```

The bundled sample is documented in [`asset-manifest.json`](family-plant-picturebook/assets/examples/erqiao-yulan/asset-manifest.json). A generated book should additionally contain `story_text.md`, `page_specs.json`, `final_pages/`, and `qa_report.md`.

## Setup

1. Clone this repository.
2. Install Node.js 18 or newer.
3. Run `npm install` if you want to use the full QA helper, which uses `sharp` for image metadata.
4. Copy `family-plant-picturebook/` into your Codex skills directory, or expose this repository as a project-level skills folder.
5. Provide a completed scientific/children's plant guide as the factual source before generating pages.

The bundled examples and character reference are intentionally kept with the skill so new books can inherit the same visual language.

## QA helpers

```bash
npm install
node family-plant-picturebook/scripts/check_skill_assets.js
node family-plant-picturebook/scripts/check_png_ratio.js path/to/final_pages
node family-plant-picturebook/scripts/check_picturebook_set.js path/to/book/final_pages
```

`check_skill_assets.js` validates the bundled references. `check_png_ratio.js` is a dependency-free 3:4 gate. `check_picturebook_set.js` writes `qa_report.md` and combines automated image checks with a documented manual review checklist.

Generated books, local dependencies, and machine-specific files are ignored; the repository stores reusable source assets and examples instead.
