# Text Rules

Final Chinese text must be deterministic font rendering, not image-model-generated text.

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

## Rendering Rules

Before rendering:

1. inspect the base image;
2. ensure the text box is native to the artwork;
3. avoid adding opaque rectangles unless the page was designed for them;
4. wrap lines manually for natural reading rhythm;
5. keep enough margin from bubble borders and decorative flowers.

Use embedded text boxes by default:

1. dialogue and captions should use `box: { x, y, w, h, padding }`, not bare `x`/`y`;
2. set `align: "center"` and `valign: "middle"` for speech bubbles unless the bubble shape clearly calls for left alignment;
3. set `align: "left"` and `valign: "top"` for notebook panels or explanatory cards;
4. keep text-safe boxes smaller than the visible bubble, leaving at least 16-28 px padding;
5. if a bubble is irregular, choose a conservative inner rectangle rather than filling the whole shape;
6. if text needs to shrink below comfortable reading size, shorten the copy or regenerate a base page with a larger bubble.

Natural embedded typography means the base art provides native empty bubbles, signs, labels, or paper panels, and the renderer places text inside those regions. Do not use floating text on busy backgrounds unless it is a deliberate cover/title design.

After rendering:

1. check every character visually;
2. verify no text overlaps dashed borders;
3. verify no old AI pseudo-text remains;
4. verify each dialogue block is centered within its bubble or intentionally aligned within a panel;
5. compare font style against the other pages.

If readability requires a patch-like block, regenerate the no-text base image instead.
