# Series Style Guide

Use this guide for “七七的植物世界” family plant picture books.

## Visual Identity

The series is warm, refined, and story-like:

1. polished 3D children’s picture-book illustration;
2. soft natural light;
3. gentle pastel palette fitted to the plant and season;
4. botanical features large enough for children to observe;
5. mother-child interaction as the emotional center;
6. blank native speech bubbles and panels for later typography.

Avoid generic AI poster layouts. Pages should feel like a continuous picture book, not separate ads.

## Characters

Maintain identity, not identical outfits.

Qiqi:

1. young child, big curious eyes, rounded child proportions;
2. brown hair, usually two braids unless scene logic requires a temporary variation;
3. expressive curiosity: pointing, looking up, crouching, comparing, asking.

Mom:

1. shoulder-length brown hair;
2. round glasses;
3. warm, patient expression;
4. gentle pointing or kneeling posture when explaining.

## Clothing Policy

Do not lock clothing to the Erqiao magnolia sample.

Adapt clothing to:

1. plant season;
2. habitat, such as park, pond, campus, woodland, garden, greenhouse;
3. weather and time of day;
4. story activity, such as walking, observing, sketching, collecting fallen leaves.

Before generating a book, create a `characterOutfitSheet`. The sheet must lock exact garments, colors, silhouettes, shoes, hairstyle, and accessories for Qiqi and Mom.

Within one book, clothing must remain the same as the locked outfit sheet unless the scene clearly changes day, season, weather, location, or activity. “Similar color” is not enough: a sage-green vest, a sage-green dress, and a sage-green jacket are different outfits.

Every image prompt must repeat the locked outfit sheet verbatim or near-verbatim. Do not rely on memory or broad phrases such as “same outfit as before.”

If a generated page changes outfit style without a story reason, regenerate that page before delivery.

Examples:

1. early spring flowering tree: light spring jackets, soft pastels;
2. summer aquatic plant: breathable short sleeves, sun hats, sandals or sneakers;
3. autumn fruit/tree page: knit vest, cardigan, warm earth colors;
4. winter evergreen: warmer coats, scarf or hat.

Example locked outfit sheet:

1. Qiqi: two braids with small pink hair ties; cream long-sleeve shirt; sage-green sleeveless quilted vest with front buttons; beige loose pants; white sneakers; no hat.
2. Mom: shoulder-length brown hair; round glasses; cream knit cardigan; white top; beige relaxed trousers; white sneakers; woven shoulder bag.

## Page Art Rules

Each generated production page must:

1. target the canonical `1086 × 1448 px` canvas and remain exactly 3:4;
2. contain the exact requested Chinese text generated through `imagegen`;
3. include no pseudo-writing, missing characters, or spelling substitutions;
4. place text inside native title banners, speech bubbles, captions, and infographic panels;
5. reserve enough text-safe space around each text container;
6. avoid hard post-production-looking rectangles;
7. show plant-specific morphology accurately.

Do not use a text-free base image as the normal production target. The bundled sample pages are final integrated text-and-image references. A text-free base plus local overlay is an optional repair workflow only.

For botanical accuracy, describe the exact visible parts in the image prompt: flower orientation, color pattern, leaf shape, fruit form, bark texture, or growth habit as supported by source facts.

## Ratio Discipline

Treat 3:4 as a delivery constraint, not a prompt preference.

For every generated production page:

1. inspect dimensions immediately after generation;
2. reject any 9:16, 4:5, square, or landscape page before typography;
3. deliver the final page at exactly `1086 × 1448 px`; if the generator returns another exact 3:4 size, normalize only after visual inspection confirms that no text, characters, plant details, or safe margins are harmed;
4. regenerate rejected pages before continuing the book, so clothing and scene continuity can still be corrected together;
5. never mix aspect ratios or delivery sizes inside one book.

Recommended prompt phrase:

`native portrait 3:4 children's picture-book page, target final canvas 1086 by 1448 pixels, not 9:16, not 4:5, not square, not landscape, leave safe margins on all sides`.

## Typography Look

Typography must look native to the book and be generated together with the page image:

1. title: warm deep rose or dark brown, rounded/handwritten feeling;
2. dialogue: dark black-brown, readable, child-friendly;
3. captions: smaller but same family feeling;
4. white text only on native colored strips with enough contrast.

Do not use opaque emergency patches unless the page is intentionally designed for them. If a page needs a patch to become readable, regenerate the page instead.
