#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function main() {
  const dir = process.argv[2];
  if (!dir) {
    console.error("Usage: check_picturebook_set.js output/<plant-slug>/final_pages");
    process.exit(2);
  }
  const abs = path.resolve(dir);
  const folderName = path.basename(abs);
  const isFinalPages = folderName === "final_pages";
  const specPath = path.join(path.dirname(abs), "page_specs.json");
  let hasOutfitSheet = false;
  let hasPromptRecords = false;
  let expectedFiles = null;
  if (fs.existsSync(specPath)) {
    try {
      const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
      hasOutfitSheet = Boolean(
        spec.characterOutfitSheet &&
          spec.characterOutfitSheet.qiqi &&
          spec.characterOutfitSheet.mom
      );
      hasPromptRecords = Boolean(
        Array.isArray(spec.pages) &&
          spec.pages.length > 0 &&
          spec.pages.every(
            (page) =>
              page.imagegenPrompt &&
              typeof page.imagegenPrompt.text === "string" &&
              page.imagegenPrompt.text.trim().length > 0
          )
      );
      expectedFiles = Array.isArray(spec.pages)
        ? spec.pages.map((page) => page.file).filter((file) => typeof file === "string").sort()
        : null;
    } catch {
      hasOutfitSheet = false;
    }
  }
  const files = fs
    .readdirSync(abs)
    .filter((file) => file.toLowerCase().endsWith(".png"))
    .sort();
  const filesMatchSpec = Boolean(
    expectedFiles &&
      expectedFiles.length === files.length &&
      expectedFiles.every((file, index) => file === files[index])
  );
  const lines = ["# Picturebook QA Report", ""];
  lines.push(`Checked directory: ${abs}`);
  lines.push(`Checked stage: ${isFinalPages ? "final_pages" : folderName}`);
  lines.push(`PNG pages: ${files.length}`);
  lines.push(`Character outfit sheet: ${hasOutfitSheet ? "PRESENT" : "MISSING"}`);
  lines.push(`Imagegen prompt records: ${hasPromptRecords ? "PRESENT" : "MISSING"}`);
  lines.push(`Page/spec file match: ${filesMatchSpec ? "PASS" : "FAIL"}`);
  lines.push("");

  let ok = true;
  for (const file of files) {
    const full = path.join(abs, file);
    const meta = await sharp(full).metadata();
    const dimensionsOk = meta.width === 1086 && meta.height === 1448;
    if (!dimensionsOk) ok = false;
    lines.push(`- ${file}: ${meta.width}x${meta.height} ${dimensionsOk ? "OK 1086x1448" : "NOT 1086x1448"}`);
  }

  lines.push("");
  lines.push("Automated gate:");
  lines.push("- Pages must be exactly 1086x1448 (3:4) before delivery.");
  lines.push("- If a page is normalized by crop or canvas extension, record it and visually inspect all edges.");
  lines.push("");
  lines.push("Manual QA required:");
  lines.push("- Font style is consistent across all pages.");
  lines.push("- Character outfits match the locked characterOutfitSheet exactly unless a scene change is specified.");
  lines.push("- All visible Chinese text matches page_specs.json and was generated through the required imagegen workflow.");
  lines.push("- No rare characters, pseudo-text, old text shadows, or typo-prone glyphs.");
  lines.push("- No sticker/plaster text blocks; text sits in native bubbles or panels.");
  lines.push("- Dialogue text is centered inside speech bubbles, or intentionally aligned inside panels with safe padding.");
  lines.push("- Character identity is consistent; clothing fits the plant season and setting.");
  lines.push("- Plant morphology and look-alike comparisons match the source dossier.");
  lines.push("");
  lines.push(`Overall dimension check: ${ok ? "PASS" : "FAIL"}`);
  const metadataOk = hasOutfitSheet && hasPromptRecords && filesMatchSpec;
  lines.push(`Overall metadata check: ${metadataOk ? "PASS" : "FAIL"}`);

  const report = path.join(path.dirname(abs), "qa_report.md");
  fs.writeFileSync(report, lines.join("\n"));
  console.log(report);
  if (!ok || (isFinalPages && !metadataOk)) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
