# Production Log — 构树 (Broussonetia papyrifera)

## 1. Source Handoff

- Action: Received the plant name 构树 and ran `shanghai-plant-guide-series` first.
- Output: Locked 构树 to *Broussonetia papyrifera* (L.) L'Hér. ex Vent.; saved the scientific dossier and child guide under `source/`.
- Decision: The scientific dossier is the factual authority; the child guide is the narrative source. Treat Shanghai digital flora information as the source basis for the local context.

## 2. Story Plan

- Action: Read the page blueprints, series style guide, text rules, asset guide, character reference, and sample pages.
- Output: Planned seven pages: cover, first encounter, name origin, dioecy, leaf/fruit close-up, comparison with mulberry, and observation-diary ending.
- Risk: The origin of the Chinese character “构” is uncertain; do not present it as established fact.

## 3. Character Continuity

- Action: Generated and inspected Qiqi and Mom continuity sheets with `imagegen`.
- Output: Locked late-spring/early-summer observation outfits, notebook, and woven bag.
- Decision: Use the continuity sheets for exact outfits and accessories; use sample pages only for style and composition.

## 4. Visual Plan

- Action: Froze `page_specs.json` before page generation.
- Output: Recorded page text, semantic text containers, botanical constraints, continuity references, and first-attempt prompts for all seven pages.
- Risk: Watch for text errors, anatomy problems, drifting plant morphology, and inconsistent button placement.

## 5. Page Generation

- Action: Generated all pages with integrated Chinese text and illustration through `imagegen`.
- Output: Seven final pages passed thumbnail review for leaf form, male/female inflorescences, orange-red aggregate fruit, mulberry comparison, and character continuity.
- Revision: Safely normalized 01-cover, 02-meet, and 07-ending from their original sizes to `1086 × 1448 px` after visual inspection.
- Revision: Redrew page 5 three times to match the continuity sheet: Mom's left side has two buttons and her right side has none, using Mom's own viewpoint for left/right.

## 6. Automated Gate

- Action: Ran `check_picturebook_set.js`.
- Output: Seven PNG pages, exact `1086 × 1448 px`, continuity specifications and PNGs, bundled identity reference, prompt references, and file order all passed.
- Result: PASS.

## 7. Manual QA

- Action: Reviewed text, native bubbles/cards, character anatomy and continuity, plant morphology, comparison details, and seasonal plausibility.
- Result: PASS. No post-production text overlay or text patch was used.
- Decision: Keep conservative wording around fruit bristles, pollen sensitivity, and non-destructive observation; do not encourage eating the fruit.
