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

## Shared Lettering Direction

One book must use one lettering direction. Define this once in `page_specs.json`:

1. title treatment, such as warm hand-lettered or rounded display lettering;
2. dialogue treatment, such as dark, readable, child-friendly lettering;
3. caption treatment and relative size;
4. palette and contrast rules for text on banners, bubbles, and panels.

Do not require a specific installed font for imagegen pages. The goal is consistent visual lettering across the book, not post-production font substitution.

## Imagegen Text Rules

Before image generation:

1. put every final text block in `page_specs.json`;
2. copy the exact text into the imagegen prompt and require verbatim Chinese characters;
3. specify each block's semantic `role`, `container`, `placement`, `alignment`, and `maxLines`;
4. specify line breaks only when they materially improve the intended reading rhythm;
5. keep enough visual breathing room around text containers and decorative elements.

Use semantic placement by default:

1. use placements such as `upper-center`, `left speech bubble`, `right caption panel`, or `lower-third`;
2. name the intended container, such as `ribbon-banner`, `speech-bubble`, `notebook-card`, or `caption-panel`;
3. use `alignment` and `maxLines` to guide composition without prescribing pixel coordinates;
4. reserve enough space for the full text before generation;
5. if text is too small or incorrect, shorten the copy or regenerate the page with a larger native container.

Exact coordinates are not required for normal imagegen production. An optional `fallbackBox` may be added only when the controlled repair renderer is explicitly requested.

Natural embedded typography means imagegen places the requested text inside native bubbles, signs, labels, or paper panels. Do not use floating text on busy backgrounds unless it is a deliberate cover/title design.

After image generation:

1. check every character visually;
2. verify no text overlaps dashed borders;
3. verify no old AI pseudo-text remains;
4. verify every character, word, punctuation mark, and line break against `page_specs.json`;
5. verify each block appears in the intended semantic container and alignment;
6. compare the lettering style against the other pages.

If text is misspelled, unreadable, pseudo-text, or placed unnaturally, regenerate the page with a targeted prompt change. Do not silently accept a near-match or patch over it by default.

## Optional renderer fallback

`scripts/render_picturebook_text.js` may be used only when the user explicitly requests controlled post-processing or a repair workflow. It is not the normal page-generation method for this series.
