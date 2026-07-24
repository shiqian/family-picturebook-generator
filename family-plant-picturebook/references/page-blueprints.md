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
  "typography": {
    "titleFont": "Kaiti SC, STKaiti, PingFang SC, Hiragino Sans GB, sans-serif",
    "bodyFont": "Kaiti SC, STKaiti, PingFang SC, Hiragino Sans GB, sans-serif",
    "captionFont": "Kaiti SC, STKaiti, PingFang SC, Hiragino Sans GB, sans-serif",
    "titleColor": "#5F5B89",
    "bodyColor": "#2F2E35",
    "captionColor": "#4B4A57",
    "whiteStripColor": "#FFFFFF"
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
      "texts": [
        {
          "text": "七七的植物世界 No.30",
          "box": { "x": 160, "y": 82, "w": 760, "h": 72, "padding": 12 },
          "align": "center",
          "valign": "middle",
          "style": "title",
          "size": 36,
          "minSize": 28
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

Prefer `box` placement over bare `x`/`y` placement. Bare `x`/`y` is still allowed for decorative cover titles or one-line labels, but dialogue and captions should use boxes.

Box fields:

1. `x`, `y`, `w`, `h`: text-safe area inside the native bubble, panel, sign, or title banner;
2. `padding`: inner margin from the bubble edge, usually `16-28`;
3. `align`: `left`, `center`, or `right`;
4. `valign`: `top`, `middle`, or `bottom`;
5. `minSize`: smallest acceptable auto-fit font size.

Inspect each generated page before finalizing the page record. Text should feel embedded in native bubbles or panels, not pasted onto the illustration.

Recommended additional fields for richer page specs:

1. `pageRole`: human-readable role such as `cover`, `first encounter`, or `compare`;
2. `sceneSeason`: expected season or habitat state;
3. `backgroundConstraints`: `{ "whitelist": [], "blacklist": [] }` for seasonal plausibility checks;
4. `riskNotes`: short list of likely failure modes, such as extra limbs or cramped bubbles;
5. `qaHints`: page-specific checks such as `mustShowText`, `mustMatchRole`, `anatomyWarnings`, and `seasonCheck`.
