# Family Picturebook Generator

A reusable Codex skill for turning a source-backed plant guide into a consistent family picture-book series.

The generator keeps plant facts tied to the source guide, creates a fixed portrait page system, and includes bundled character/style references plus QA scripts for the final image set.

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

## Setup

1. Clone this repository.
2. Install Node.js if you want to run the bundled image QA/render helpers.
3. Copy `family-plant-picturebook/` into your Codex skills directory, or expose this repository as a project-level skills folder.
4. Provide a completed scientific/children's plant guide as the factual source before generating pages.

The bundled examples and character reference are intentionally kept with the skill so new books can inherit the same visual language.

## QA helpers

```bash
node family-plant-picturebook/scripts/check_skill_assets.js
node family-plant-picturebook/scripts/check_png_ratio.js path/to/final_pages
node family-plant-picturebook/scripts/check_picturebook_set.js path/to/book
```

Generated books, local dependencies, and machine-specific files are ignored; the repository stores reusable source assets and examples instead.

