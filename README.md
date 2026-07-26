# Family Plant Picturebook Generator

A reusable Codex skill that turns source-backed plant information into a consistent family picture-book series.

It combines source control, story planning, per-character visual continuity, imagegen-integrated Chinese typography, automated package checks, and manual visual/factual QA for “七七的植物世界”-style parent-child botanical stories.

## Contents

- [What it provides](#what-it-provides)
- [Visual examples](#visual-examples)
- [Workflow](#workflow)
- [Inputs and dependencies](#inputs-and-dependencies)
- [Setup](#setup)
- [Install the related skills](#install-the-related-skills)
- [Output contract](#output-contract)
- [Quality assurance](#quality-assurance)
- [Repository layout](#repository-layout)

## What it provides

- Source-backed seven-page botanical picture books with no invented plant facts
- Two separate per-book continuity sheets for stable Qiqi and Mom outfits, accessories, and poses
- Imagegen-generated Chinese text and illustration on canonical `1086 × 1448 px` (`3:4`) pages
- A controlled output package containing source files, story text, page specifications, production history, final pages, and QA results

## Key contributions

- Designed an end-to-end source-to-delivery workflow for AI-generated botanical picture books, including upstream research handoff, story planning, visual design, generation, and QA gates.
- Built a reusable Codex skill with progressive-disclosure references, bundled visual assets, deterministic scripts, and structured production outputs.
- Implemented automated Node.js QA for source files, prompt references, continuity assets, PNG format, filename order, and exact `1086 × 1448 px` delivery dimensions.
- Established per-character visual continuity using separate Qiqi and Mom outfit-reference sheets to improve cross-page consistency.
- Defined an imagegen-first text-and-image workflow with complete-page redraws for content repairs and no post-production text overlays.
- Added append-only production logging to track actions, outputs, decisions, retries, risks, and automated checks.

## Visual examples

The bundled Erqiao Yulan pages demonstrate the intended warmth, typography feel, composition density, and parent-child storytelling rhythm. They are style references only, not factual sources for other plants.

<table>
  <tr>
    <th>Cover</th>
    <th>Botanical close-up</th>
    <th>Comparison</th>
  </tr>
  <tr>
    <td><img src="family-plant-picturebook-generator/assets/examples/erqiao-yulan/final_pages/01-cover.png" alt="Sample cover" width="180"></td>
    <td><img src="family-plant-picturebook-generator/assets/examples/erqiao-yulan/final_pages/05-flower-closeup.png" alt="Sample botanical close-up" width="180"></td>
    <td><img src="family-plant-picturebook-generator/assets/examples/erqiao-yulan/final_pages/06-comparison.png" alt="Sample comparison page" width="180"></td>
  </tr>
</table>

The bundled [`gou-shu`](family-plant-picturebook-generator/assets/examples/gou-shu/) package is a complete generated-book example containing source files, story plan, continuity sheets, page specifications, seven final pages, production log, and QA report.

## Workflow

The skill uses progressive disclosure: it loads only the references needed at each stage.

```mermaid
flowchart TD
    A["Plant name or source files"] --> B["0. Initialize\noutput/<slug> + step_log.md"]
    B --> C["1. Source handoff\nupstream series when needed"]
    C --> D{"Source preflight"}
    D -->|fail| C
    D -->|pass| E["2. Story plan\nread sources + page blueprint\nstory_text.md"]
    E --> F["3. Character continuity\nstyle/assets references\n2 separate PNG sheets"]
    F --> G["4. Visual system\ntext rules + page_specs.json\nprompts and references"]
    G --> H{"Visual preflight"}
    H -->|fail| G
    H -->|pass| I["5. Page generation\nimagegen text + illustration"]
    I --> J["6. Automated gate\npackage, references, PNGs, dimensions"]
    J -->|fail| R["Repair reported package or page issue\nappend production-log event"]
    R --> J
    J -->|pass| K["7. Manual QA\ntext, continuity, anatomy, botany"]
    K --> L["Deliver output/<slug>/"]
```

### Stage dependencies

1. Initialization creates the controlled output folder and the first production-log event.
2. Source handoff supplies `scientific-dossier.md` and `child-guide.md`; source preflight must pass before story or image work.
3. Story planning reads the source files, `page-blueprints.md`, and at least two sample pages from `assets/examples/erqiao-yulan/final_pages/`.
4. Character continuity uses the story context, style guide, asset guide, and bundled identity image to create one Qiqi sheet and one Mom sheet.
5. Visual planning uses the text rules, style guide, continuity references, and source-backed story to freeze `page_specs.json`.
6. Visual preflight must pass before final-page generation.
7. Every page is generated with image and required Chinese text together through `imagegen`.
8. Automated QA runs before manual QA; delivery requires both gates to pass.

## Inputs and dependencies

| Input | Handling |
|---|---|
| Plant name only | Run or request `shanghai-plant-guide-series` before research, drafting, or image generation. |
| Child-facing plant guide | Use as the narrative source; obtain the scientific dossier before delivery. |
| Complete scientific dossier | Use as factual authority; create or obtain the child-facing guide before delivery. |
| Optional user instructions | Apply only when they do not conflict with source facts or workflow gates. |

The final book package always requires both source files. Do not silently reconstruct a missing upstream stage from web research, an uncaptured chat response, or an example file.

The workflow depends on:

- Node.js 18 or newer;
- the `imagegen` skill for continuity sheets, final pages, and content repairs;
- `shanghai-plant-guide-series` when the input is only a plant name;
- the repository QA dependency `sharp` for PNG metadata and readability checks.

## Setup

Install Node.js 18 or newer, then follow [Install the related skills](#install-the-related-skills) to clone the repositories, install the QA dependency, and expose both skills to Codex.

Example request:

```text
Run $family-plant-picturebook-generator for 桂花.
```

The normal skill workflow runs the lifecycle controls automatically. The commands are also available for development and troubleshooting:

```bash
npm run init:picturebook -- <plant-slug>
npm run preflight:source -- output/<plant-slug>
npm run preflight:visual -- output/<plant-slug>
```

## Install the related skills

The generator uses `shanghai-plant-guide-series` when the input is only a plant name. External users should therefore make both repositories available to Codex.

### 1. Clone both repositories

Choose any local parent directory for your skills. The following example uses `~/codex-projects/`:

```bash
mkdir -p ~/codex-projects
cd ~/codex-projects
git clone https://github.com/shiqian/shanghai-plant-guide.git
git clone https://github.com/shiqian/family-plant-picturebook-generator.git
```

Install the generator’s QA dependency from its repository root:

```bash
cd ~/codex-projects/family-plant-picturebook-generator
npm install
```

### 2. Expose the skill directories to Codex

Codex discovers a skill when its directory contains `SKILL.md` and is available under `~/.codex/skills/<skill-name>/`.

Create the skills directory and link the two cloned skill folders:

```bash
mkdir -p ~/.codex/skills
ln -sfn ~/codex-projects/shanghai-plant-guide/shanghai-plant-guide-series \
  ~/.codex/skills/shanghai-plant-guide-series
ln -sfn ~/codex-projects/family-plant-picturebook-generator/family-plant-picturebook-generator \
  ~/.codex/skills/family-plant-picturebook-generator
```

Verify the expected files exist:

```bash
test -f ~/.codex/skills/shanghai-plant-guide-series/SKILL.md
test -f ~/.codex/skills/family-plant-picturebook-generator/SKILL.md
```

If your Codex installation uses a custom skills directory, place or link the same two directories there instead. Copying the directories is also valid; symlinks make it easier to update them with `git pull`.

### 3. Run the workflow

Start a new Codex task and request:

```text
Run $family-plant-picturebook-generator for 桂花.
```

With a plant name, the generator must obtain the scientific dossier and child guide through `shanghai-plant-guide-series` before story planning or image generation. With source files already available, provide both files and invoke the generator directly.

## Output contract

Generated books live under the repository-level `output/` directory. Use a stable lowercase slug such as `yulan`, `guihua`, or `gou-shu`.

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

`step_log.md` is the append-only English production log. Each event records a timestamp, actor, action, output, decision, and risk. Retries and user-requested revisions are appended as new events. See [`references/step-log.md`](family-plant-picturebook-generator/references/step-log.md) for the logging specification.

Do not create generated books in `out/`, ad-hoc folders, or the skill source directory. Draft or diagnostic files belong under `output/<plant-slug>/drafts/`.

## Quality assurance

During normal skill execution, Codex runs the automated gate and reads `qa_report.md` automatically. The gate checks:

- required source, story, log, continuity, and page-spec files;
- production-log structure and event validity;
- both continuity PNGs and the bundled identity reference;
- per-page prompt records, literal text, character declarations, and continuity references;
- final-page filename order and PNG format;
- exact `1086 × 1448 px` dimensions.

Manual QA remains required for:

- Chinese text accuracy and legibility;
- Qiqi and Mom identity, outfits, accessories, anatomy, and typography continuity;
- button count and placement when buttons are visible;
- plant morphology, comparison details, safety wording, and seasonal plausibility;
- page-role coverage, narrative flow, visual density, and overall series style.

Use these commands only to recheck an existing package, debug a failed generation, validate bundled assets, or support CI/development work:

```bash
npm run check:assets
npm run check:ratio -- output/<plant-slug>/final_pages
npm run check:picturebook -- output/<plant-slug>/final_pages
```

The final command writes `output/<plant-slug>/qa_report.md`. A package is deliverable only when automated QA and manual QA both pass.

## Repository layout

```text
.
├── README.md
├── package.json
├── package-lock.json
├── family-plant-picturebook-generator/
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   ├── assets/
│   ├── references/
│   └── scripts/
└── .gitignore
```

The bundled assets and sample packages make the skill portable across projects. The canonical sample manifest is [`asset-manifest.json`](family-plant-picturebook-generator/assets/examples/erqiao-yulan/asset-manifest.json), and the complete generated-book example is [`gou-shu/`](family-plant-picturebook-generator/assets/examples/gou-shu/).
