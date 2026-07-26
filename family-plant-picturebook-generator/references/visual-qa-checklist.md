# Manual Visual QA Checklist

Review every generated page at full size. Mark each item PASS or FAIL in `qa_report.md`.

- Text: every Chinese character, punctuation mark, line break, and label matches `page_specs.json`; lettering is legible and native to the composition.
- Identity: Qiqi keeps her face, brown hair, two braids, child proportions, and expression family; Mom keeps shoulder-length brown hair, round glasses, and adult proportions.
- Outfit: jacket/cardigan type, colors, button count, scarf, bag, notebook, hair ties, and shoes match the book's continuity sheets; no clothing is copied from style-reference characters.
- Accessories: the independent detail panel agrees with all poses and page appearances; no added or missing buttons, bags, glasses, or notebooks.
- Anatomy: no extra limbs, merged hands, distorted faces, or broken shoes.
- Plant accuracy: visible flowers, leaves, stems, bark, fruit, growth habit, and other plant features match the scientific dossier.
- Comparison: any comparison page uses only source-backed differences and identifies the compared plants correctly.
- Safety: actions, handling, warnings, and edibility claims match the source materials; observation remains non-destructive unless the story explicitly supports another safe action.
- Season and setting: season, weather, habitat, time of day, and Shanghai context remain plausible for the plant and frozen story plan.
- Story flow: page role, dialogue rhythm, visual density, and warm ending match the frozen story plan.

Final manual sign-off: `PASS` only after every item passes. If any item fails, redraw the complete page with imagegen and record the repair in `step_log.md`.
