# Page Blueprints

Default to 7 pages. Adjust only when the user asks or the plant lacks enough supported content.

## 01-cover

Purpose: introduce the series and plant.

Include:

1. series label, such as `七七的植物世界 No.30`;
2. plant name;
3. short child-friendly visual hook;
4. hero view of the plant and the mother-child pair.

## 02-meet

Purpose: first encounter.

Include:

1. where the family sees the plant;
2. what catches the child’s eye;
3. one simple observation question.

## 03-name

Purpose: name origin.

Include only supported name-origin content. If etymology is uncertain, use soft wording without scholarly stiffness.

Good style:

1. “人们很早就这样叫它了。”
2. “很多人会把这个名字和它……的样子联系起来。”
3. “这个说法很常见，但我们不把它说得太绝对。”

Avoid:

1. “目前考证不足” in child dialogue;
2. invented legends;
3. hard academic caveats in speech bubbles.

## 04-plant-secret

Purpose: explain one plant-specific mechanism or growth secret.

Examples:

1. first flower then leaves;
2. leaves close at night;
3. flower opens at a specific time;
4. fruit changes color;
5. floating leaves or aerial roots.

Explain from a first-principles child logic:

1. what the child sees;
2. what the plant prepared or needs;
3. why the order/shape/behavior helps the plant.

## 05-closeup

Purpose: observe one visually rich plant part.

Choose the strongest supported feature:

1. flower close-up;
2. leaf texture;
3. fruit form;
4. bark/branch/bud;
5. seed or cone.

## 06-compare

Purpose: one-look distinction from similar plants.

Include:

1. Chinese name;
2. scientific name when space allows;
3. only child-visible differences;
4. no microscope-only features.

## 07-ending

Purpose: close the book warmly.

Do not always end with “不要摘花.” Prefer:

1. observation diary;
2. sketching;
3. seasonal revisit;
4. a quiet emotional moment;
5. a safe, non-destructive activity.

## page_specs.json Shape

Use this minimal structure:

```json
{
  "meta": {
    "title": "二乔玉兰",
    "series": "七七的植物世界",
    "number": "No.30",
    "size": { "width": 1086, "height": 1448, "ratio": "3:4" },
    "sourcePlant": "Magnolia soulangeana"
  },
  "characterOutfitSheet": {
    "continuityRule": "Reuse this exact outfit on every page unless the story explicitly changes day, season, weather, location, or activity.",
    "qiqi": "Two braids with small hair ties; exact top, outerwear, pants/skirt, shoes, and accessories locked for this book.",
    "mom": "Round glasses; shoulder-length brown hair; exact top, outerwear, pants/skirt, shoes, and accessories locked for this book."
  },
  "textStrategy": "imagegen-integrated",
  "typography": {
    "titleTreatment": "warm rounded hand-lettered display style",
    "dialogueTreatment": "dark, readable, child-friendly lettering",
    "captionTreatment": "smaller lettering in the same visual family",
    "palette": {
      "title": "deep rose or dark brown",
      "dialogue": "dark black-brown",
      "caption": "dark black-brown",
      "onColoredStrip": "white only with strong contrast"
    }
  },
  "pages": [
    {
      "file": "01-cover.png",
      "pageRole": "cover",
      "sampleDensityFrom": ["01-cover.png", "07-ending.png"],
      "sceneSeason": "spring",
      "backgroundConstraints": {
        "whitelist": ["magnolia", "tulip", "leaf-buds"],
        "blacklist": ["lotus", "water lily", "summer pond flowers"]
      },
      "riskNotes": [
        "dense floral border may crowd title",
        "cover pose may distort arms if too many foreground elements are requested"
      ],
      "imagegenPrompt": {
        "text": "Use case: illustration-story. Create a native portrait 3:4 children's picture-book cover at 1086 by 1448 pixels with the exact title text below integrated into a ribbon banner. Preserve the locked Qiqi and Mom identities and outfit sheet. Show the target plant with only source-supported morphology. Warm 3D rendering, soft natural light, layered depth, refined pastel palette. Avoid pseudo-text, misspelled Chinese, extra limbs, and crowded title space.",
        "references": [
          { "path": "assets/characters/qiqi-and-mom-reference.png", "role": "character identity" },
          { "path": "assets/examples/erqiao-yulan/final_pages/01-cover.png", "role": "composition and style" }
        ],
        "avoid": ["pseudo-text", "misspelled Chinese", "extra arms", "crowded title space"]
      },
      "textBlocks": [
        {
          "id": "series-label",
          "text": "七七的植物世界 No.30",
          "role": "series-label",
          "container": "ribbon-banner",
          "placement": "upper-center",
          "alignment": "center",
          "maxLines": 1,
          "priority": "required"
        }
      ],
      "qaHints": {
        "mustShowText": true,
        "mustMatchRole": true,
        "anatomyWarnings": ["extra arms", "extra hands", "merged sleeves"],
        "seasonCheck": true
      }
    }
  ]
}
```

For normal imagegen production, do not prescribe pixel coordinates. Each `textBlocks` item should identify the exact text plus its semantic layout intent:

1. `id`: stable page-local identifier;
2. `text`: exact visible text, copied verbatim into the imagegen prompt;
3. `role`: `title`, `dialogue`, `caption`, `label`, or `series-label`;
4. `container`: `ribbon-banner`, `speech-bubble`, `caption-panel`, `notebook-card`, or another clear container;
5. `placement`: a semantic location such as `upper-center`, `left`, `right`, or `lower-third`;
6. `alignment`: `left`, `center`, or `right`;
7. `maxLines`: a composition guardrail;
8. `priority`: `required` or `optional`.

Each page must also contain an `imagegenPrompt` record before generation. Its `text` field is the complete prompt used for the first attempt; update it before every retry and record the retry reason in `step_log.md`.

Inspect each generated page before finalizing the page record. Text should feel embedded in native bubbles or panels, not pasted onto the illustration.

Recommended additional fields for richer page specs:

1. `pageRole`: human-readable role such as `cover`, `first encounter`, or `compare`;
2. `sceneSeason`: expected season or habitat state;
3. `backgroundConstraints`: `{ "whitelist": [], "blacklist": [] }` for seasonal plausibility checks;
4. `riskNotes`: short list of likely failure modes, such as extra limbs or cramped bubbles;
5. `qaHints`: page-specific checks such as `mustShowText`, `mustMatchRole`, `anatomyWarnings`, and `seasonCheck`.
