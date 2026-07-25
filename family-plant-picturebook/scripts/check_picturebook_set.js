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
  let hasContinuitySheets = false;
  let hasContinuitySpecs = false;
  let identityReferenceOk = false;
  const continuityChecks = [];
  let hasPromptRecords = false;
  let promptReferencesOk = false;
  let expectedFiles = null;
  if (fs.existsSync(specPath)) {
    try {
      const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
      const continuity = spec.characterContinuity;
      const referenceImages = continuity && continuity.referenceImages;
      hasContinuitySpecs = Boolean(
        continuity &&
          typeof continuity.qiqi === "string" &&
          continuity.qiqi.trim() &&
          typeof continuity.mom === "string" &&
          continuity.mom.trim() &&
          referenceImages &&
          typeof referenceImages.qiqi === "string" &&
          referenceImages.qiqi.trim() &&
          typeof referenceImages.mom === "string" &&
          referenceImages.mom.trim() &&
          referenceImages.qiqi !== referenceImages.mom
      );
      const identityReference = continuity && continuity.identityReference;
      if (identityReference === "assets/characters/qiqi-and-mom-reference.png") {
        try {
          const identityMeta = await sharp(
            path.resolve(__dirname, "..", identityReference)
          ).metadata();
          identityReferenceOk = identityMeta.format === "png";
        } catch {
          identityReferenceOk = false;
        }
      }
      for (const character of ["qiqi", "mom"]) {
        const relativePath = referenceImages && referenceImages[character];
        const fullPath = relativePath
          ? path.resolve(path.dirname(specPath), relativePath)
          : null;
        let readable = false;
        if (fullPath && fs.existsSync(fullPath)) {
          try {
            const metadata = await sharp(fullPath).metadata();
            readable = metadata.format === "png";
          } catch {
            readable = false;
          }
        }
        continuityChecks.push({ character, path: relativePath || "MISSING", readable });
      }
      hasContinuitySheets = continuityChecks.every((check) => check.readable);
      const pages = Array.isArray(spec.pages) ? spec.pages : [];
      hasPromptRecords = Boolean(
        pages.length > 0 &&
          pages.every(
            (page) =>
              page.imagegenPrompt &&
              typeof page.imagegenPrompt.text === "string" &&
              page.imagegenPrompt.text.trim().length > 0
          )
      );
      promptReferencesOk = Boolean(
        pages.length > 0 &&
          pages.every((page) => {
            const characters = Array.isArray(page.characters)
              ? page.characters
              : ["qiqi", "mom"];
            if (!characters.every((character) => ["qiqi", "mom"].includes(character))) {
              return false;
            }
            const requiredReferences = [
              "assets/characters/qiqi-and-mom-reference.png",
              ...characters
                .filter((character) => referenceImages && referenceImages[character])
                .map((character) => referenceImages[character])
            ];
            const references = Array.isArray(page.imagegenPrompt?.references)
              ? page.imagegenPrompt.references
              : [];
            return requiredReferences.every((requiredPath) =>
              references.some((reference) => reference && reference.path === requiredPath)
            );
          })
      );
      expectedFiles = Array.isArray(spec.pages)
        ? spec.pages.map((page) => page.file).filter((file) => typeof file === "string").sort()
        : null;
    } catch {
      hasContinuitySheets = false;
      hasContinuitySpecs = false;
      identityReferenceOk = false;
      promptReferencesOk = false;
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
  lines.push(`Character continuity specifications: ${hasContinuitySpecs ? "PRESENT" : "MISSING"}`);
  lines.push(`Character continuity sheets: ${hasContinuitySheets ? "PRESENT" : "MISSING"}`);
  for (const check of continuityChecks) {
    lines.push(`- ${check.character}: ${check.path} ${check.readable ? "READABLE PNG" : "MISSING OR UNREADABLE"}`);
  }
  lines.push(`Bundled identity reference: ${identityReferenceOk ? "PRESENT" : "MISSING"}`);
  lines.push(`Imagegen prompt records: ${hasPromptRecords ? "PRESENT" : "MISSING"}`);
  lines.push(`Prompt continuity references: ${promptReferencesOk ? "PASS" : "FAIL"}`);
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
  lines.push("- Visible hairstyle, outfit silhouette/colors, bag, glasses, shoes, and major accessories match the locked continuity sheets and written specifications.");
  lines.push("- All visible Chinese text matches page_specs.json and was generated through the required imagegen workflow.");
  lines.push("- No rare characters, pseudo-text, old text shadows, or typo-prone glyphs.");
  lines.push("- No sticker/plaster text blocks; text sits in native bubbles or panels.");
  lines.push("- Dialogue text is centered inside speech bubbles, or intentionally aligned inside panels with safe padding.");
  lines.push("- Character identity is consistent; clothing fits the plant season and setting.");
  lines.push("- Plant morphology and look-alike comparisons match the source dossier.");
  lines.push("");
  lines.push(`Overall dimension check: ${ok ? "PASS" : "FAIL"}`);
  const metadataOk =
    hasContinuitySpecs &&
    hasContinuitySheets &&
    identityReferenceOk &&
    hasPromptRecords &&
    promptReferencesOk &&
    filesMatchSpec;
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
