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

## Canonical Sample Book

Default sample pages:

`assets/examples/erqiao-yulan/final_pages/`

Use these pages as visual references for:

1. warm 3D picture-book rendering;
2. 3:4 Xiaohongshu-ready composition;
3. mother-child dialogue rhythm;
4. title/subtitle hierarchy;
5. speech bubble scale and placement;
6. botanical close-up density;
7. overall series polish.

Do not copy the 二乔玉兰 plant facts, flowers, colors, clothing, page titles, or subtitles into another plant book unless the new source content supports them.

## Recommended Reference Loading

When starting a new book:

1. inspect `assets/characters/qiqi-and-mom-reference.png` if character identity is relevant;
2. inspect at least 2 sample pages from `assets/examples/erqiao-yulan/final_pages/` for layout and typography feel;
3. create a new `characterOutfitSheet` based on the new plant's season, habitat, weather, and story activity;
4. repeat that locked outfit sheet in every page prompt.

## Portability Rule

Never depend on files from a prior chat, generated-image cache, Downloads folder, or user-specific absolute path if an equivalent bundled asset exists. Use relative paths inside this skill whenever possible.
