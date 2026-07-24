# Text Rules

Final Chinese text is generated inside the imagegen page call so it belongs naturally to the bubbles, panels, lighting, and composition. Text must still be specified exactly and checked visually after generation.

## Common Character Policy

Use daily common Simplified Chinese characters by default.

Avoid:

1. archaic characters;
2. rare variants;
3. OCR-confusable substitutions;
4. scholarly terms in child dialogue.

Examples:

1. use `咦`, not visually similar uncommon or mistaken variants;
2. use `树枝`, not `小枝` for child-facing speech unless the source requires a technical distinction;
3. use `花心`, not unexplained botanical jargon for children.

## Font Consistency

One book must use one typography system.

Define these once in `page_specs.json`:

1. title font stack;
2. body/dialogue font stack;
3. caption font stack;
4. title color;
5. body color;
6. caption color;
7. white-on-strip color.

Every page must inherit from this same system unless a deliberate cover title style is defined.

## Imagegen Text Rules

Before image generation:

1. put the final page text in `page_specs.json`;
2. copy the exact text into the imagegen prompt and require verbatim Chinese characters;
3. describe the native bubble, banner, card, or panel where each text block belongs;
4. specify line breaks when they materially improve the intended reading rhythm;
5. keep enough margin from bubble borders and decorative flowers.

Use native text containers by default:

1. dialogue and captions should use `box: { x, y, w, h, padding }` in `page_specs.json`, not bare `x`/`y`;
2. set `align: "center"` and `valign: "middle"` for speech bubbles unless the bubble shape clearly calls for left alignment;
3. set `align: "left"` and `valign: "top"` for notebook panels or explanatory cards;
4. keep text-safe boxes smaller than the visible bubble, leaving at least 16-28 px padding;
5. if a bubble is irregular, choose a conservative inner rectangle rather than filling the whole shape;
6. if text is too small or incorrect, shorten the copy or regenerate the page with a larger native bubble.

Natural embedded typography means imagegen places the requested text inside native bubbles, signs, labels, or paper panels. Do not use floating text on busy backgrounds unless it is a deliberate cover/title design.

After image generation:

1. check every character visually;
2. verify no text overlaps dashed borders;
3. verify no old AI pseudo-text remains;
4. verify every character, word, punctuation mark, and line break against `page_specs.json`;
5. verify each dialogue block is centered within its bubble or intentionally aligned within a panel;
6. compare the lettering style against the other pages.

If text is misspelled, unreadable, pseudo-text, or placed unnaturally, regenerate the page with a targeted prompt change. Do not silently accept a near-match or patch over it by default.

## Optional renderer fallback

`scripts/render_picturebook_text.js` may be used only when the user explicitly requests controlled post-processing or a repair workflow. It is not the normal page-generation method for this series.
