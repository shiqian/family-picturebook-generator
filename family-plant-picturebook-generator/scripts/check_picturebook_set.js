#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { appendEvent, validateLog } = require("./step_log_utils");

async function main() {
  const dir = process.argv[2];
  if (!dir) {
    console.error("Usage: check_picturebook_set.js output/<plant-slug>/final_pages");
    process.exit(2);
  }
  const abs = path.resolve(dir);
  if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) {
    console.error(`Missing final_pages directory: ${abs}`);
    process.exit(1);
  }
  const folderName = path.basename(abs);
  const isFinalPages = folderName === "final_pages";
  if (!isFinalPages) {
    console.error(`Expected a final_pages directory: ${abs}`);
    process.exit(1);
  }
  const bookDir = path.dirname(abs);
  const specPath = path.join(path.dirname(abs), "page_specs.json");
  const requiredBookFiles = [
    "source/scientific-dossier.md",
    "source/child-guide.md",
    "story_text.md",
    "step_log.md"
  ];
  const requiredBookFileChecks = requiredBookFiles.map((relativePath) => {
    const fullPath = path.join(bookDir, relativePath);
    const present = fs.existsSync(fullPath);
    const nonEmpty = present && fs.statSync(fullPath).size > 0;
    return { relativePath, present, nonEmpty, ok: present && nonEmpty };
  });
  const requiredBookFilesOk = requiredBookFileChecks.every((check) => check.ok);
  const stepLogPath = path.join(bookDir, "step_log.md");
  const stepLogText = fs.existsSync(stepLogPath) ? fs.readFileSync(stepLogPath, "utf8") : "";
  const stepLogCheck = validateLog(stepLogText);
  const stepLogValid = Boolean(
    requiredBookFileChecks.find((check) => check.relativePath === "step_log.md").ok &&
    stepLogCheck.valid
  );
  let hasContinuitySheets = false;
  let hasContinuitySpecs = false;
  let identityReferenceOk = false;
  const continuityChecks = [];
  let hasPromptRecords = false;
  let promptTextOk = false;
  let promptReferencesOk = false;
  let promptStyleReferencesOk = false;
  let promptOutfitLocksOk = false;
  let pageStructureOk = false;
  let pagePlanOk = false;
  let expectedFiles = null;
  let specError = null;
  if (fs.existsSync(specPath)) {
    try {
      const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
      const continuity = spec.characterContinuity;
      const referenceImages = continuity && continuity.referenceImages;
      const expectedContinuityPaths = {
        qiqi: "continuity/qiqi-outfit-sheet.png",
        mom: "continuity/mom-outfit-sheet.png"
      };
      hasContinuitySpecs = Boolean(
        continuity &&
          typeof continuity.qiqi === "string" &&
          continuity.qiqi.trim() &&
          typeof continuity.mom === "string" &&
          continuity.mom.trim() &&
          referenceImages &&
          typeof referenceImages.qiqi === "string" &&
          referenceImages.qiqi === expectedContinuityPaths.qiqi &&
          typeof referenceImages.mom === "string" &&
          referenceImages.mom === expectedContinuityPaths.mom
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
        if (relativePath === expectedContinuityPaths[character] && fullPath && fs.existsSync(fullPath)) {
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
      const pagePlanException =
        typeof spec.meta?.pagePlanException === "string" && spec.meta.pagePlanException.trim();
      pageStructureOk = Boolean(
        pages.length > 0 &&
          pages.every(
            (page) =>
              typeof page.file === "string" &&
              page.file.trim() &&
              typeof page.pageRole === "string" &&
              page.pageRole.trim() &&
              Array.isArray(page.textBlocks) &&
              page.textBlocks.length > 0 &&
              Array.isArray(page.characters)
          )
      );
      pagePlanOk = pages.length === 7 || Boolean(pagePlanException);
      hasPromptRecords = Boolean(
        pages.length > 0 &&
          pages.every(
            (page) =>
              page.imagegenPrompt &&
              typeof page.imagegenPrompt.text === "string" &&
              page.imagegenPrompt.text.trim().length > 0
          )
      );
      promptTextOk = Boolean(
        pages.length > 0 &&
          pages.every((page) => {
            const promptText = page.imagegenPrompt?.text;
            const textBlocks = Array.isArray(page.textBlocks) ? page.textBlocks : [];
            return (
              typeof promptText === "string" &&
              textBlocks.length > 0 &&
              textBlocks.every(
                (block) => typeof block.text === "string" && promptText.includes(block.text)
              )
            );
          })
      );
      promptReferencesOk = Boolean(
        pages.length > 0 &&
          pages.every((page) => {
            const characters = page.characters;
            if (!Array.isArray(characters) || !characters.every((character) => ["qiqi", "mom"].includes(character))) {
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
      promptStyleReferencesOk = pages.length > 0;
      for (const page of pages) {
        const references = Array.isArray(page.imagegenPrompt?.references)
          ? page.imagegenPrompt.references
          : [];
        const styleReference = references.find(
          (reference) =>
            reference &&
            typeof reference.path === "string" &&
            reference.path.startsWith("assets/examples/erqiao-yulan/final_pages/")
        );
        if (!styleReference) {
          promptStyleReferencesOk = false;
          continue;
        }
        try {
          const styleMeta = await sharp(
            path.resolve(__dirname, "..", styleReference.path)
          ).metadata();
          if (styleMeta.format !== "png") promptStyleReferencesOk = false;
        } catch {
          promptStyleReferencesOk = false;
        }
      }
      promptOutfitLocksOk = Boolean(
        pages.length > 0 &&
          pages.every((page) => {
            const promptText = page.imagegenPrompt?.text;
            const characters = Array.isArray(page.characters) ? page.characters : [];
            if (typeof promptText !== "string" || !Array.isArray(page.characters)) return false;
            return characters.every(
              (character) =>
                typeof continuity?.[character] === "string" &&
                promptText.includes(continuity[character])
            );
          })
      );
      expectedFiles = Array.isArray(spec.pages)
        ? spec.pages.map((page) => page.file).filter((file) => typeof file === "string").sort()
        : null;
    } catch (error) {
      specError = error.message;
      hasContinuitySheets = false;
      hasContinuitySpecs = false;
      identityReferenceOk = false;
      hasPromptRecords = false;
      promptTextOk = false;
      promptReferencesOk = false;
      promptStyleReferencesOk = false;
      promptOutfitLocksOk = false;
      pageStructureOk = false;
      pagePlanOk = false;
    }
  } else {
    specError = "page_specs.json is missing";
  }
  const files = fs
    .readdirSync(abs)
    .filter((file) => file.toLowerCase().endsWith(".png"))
    .sort();
  const filesMatchSpec = Boolean(
    expectedFiles &&
      expectedFiles.length > 0 &&
      expectedFiles.length === files.length &&
      expectedFiles.every((file, index) => file === files[index])
  );
  const lines = ["# Picturebook QA Report", ""];
  lines.push(`Checked directory: ${abs}`);
  lines.push(`Checked stage: ${isFinalPages ? "final_pages" : folderName}`);
  lines.push(`PNG pages: ${files.length}`);
  for (const check of requiredBookFileChecks) {
    const status = !check.present ? "MISSING" : check.nonEmpty ? "PRESENT" : "EMPTY";
    lines.push(`Required file ${check.relativePath}: ${status}`);
  }
  lines.push(`Production log structure: ${stepLogValid ? "PASS" : "FAIL"}`);
  lines.push(`Production log events: ${stepLogCheck.events.length}`);
  if (!stepLogValid && stepLogCheck.errors.length) lines.push(`Production log errors: ${stepLogCheck.errors.join("; ")}`);
  if (specError) lines.push(`Page specifications: INVALID (${specError})`);
  lines.push(`Character continuity specifications: ${hasContinuitySpecs ? "PRESENT" : "MISSING"}`);
  lines.push(`Character continuity sheets: ${hasContinuitySheets ? "PRESENT" : "MISSING"}`);
  for (const check of continuityChecks) {
    lines.push(`- ${check.character}: ${check.path} ${check.readable ? "READABLE PNG" : "MISSING OR UNREADABLE"}`);
  }
  lines.push(`Bundled identity reference: ${identityReferenceOk ? "PRESENT" : "MISSING"}`);
  lines.push(`Imagegen prompt records: ${hasPromptRecords ? "PRESENT" : "MISSING"}`);
  lines.push(`Prompt text matches page text blocks: ${promptTextOk ? "PASS" : "FAIL"}`);
  lines.push(`Prompt continuity references: ${promptReferencesOk ? "PASS" : "FAIL"}`);
  lines.push(`Prompt style references: ${promptStyleReferencesOk ? "PASS" : "FAIL"}`);
  lines.push(`Prompt written outfit locks: ${promptOutfitLocksOk ? "PASS" : "FAIL"}`);
  lines.push(`Page record structure: ${pageStructureOk ? "PASS" : "FAIL"}`);
  lines.push(`Page plan: ${pagePlanOk ? "PASS" : "FAIL"}`);
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
  lines.push("- Each continuity sheet has an independent readable accessory/detail panel, and its buttons, bag, notebook, shoes, hair accessories, glasses, and other locked details agree with all three pose views.");
  lines.push("- Verify button count, spacing, and placement against the independent continuity detail panel; redraw the complete page if they are wrong.");
  lines.push("- All visible Chinese text matches page_specs.json and was generated through the required imagegen workflow.");
  lines.push("- No rare characters, pseudo-text, old text shadows, or typo-prone glyphs.");
  lines.push("- No sticker/plaster text blocks; text sits in native bubbles or panels.");
  lines.push("- Dialogue text is centered inside speech bubbles, or intentionally aligned inside panels with safe padding.");
  lines.push("- Character identity is consistent; clothing fits the plant season and setting.");
  lines.push("- Plant morphology and look-alike comparisons match the source dossier.");
  lines.push("");
  lines.push(`Overall dimension check: ${ok ? "PASS" : "FAIL"}`);
  const metadataOk =
    requiredBookFilesOk &&
    stepLogValid &&
    hasContinuitySpecs &&
    hasContinuitySheets &&
    identityReferenceOk &&
    hasPromptRecords &&
    promptTextOk &&
    promptReferencesOk &&
    promptStyleReferencesOk &&
    promptOutfitLocksOk &&
    pageStructureOk &&
    pagePlanOk &&
    filesMatchSpec;
  lines.push(`Overall metadata check: ${metadataOk ? "PASS" : "FAIL"}`);

  const report = path.join(path.dirname(abs), "qa_report.md");
  fs.writeFileSync(report, lines.join("\n"));
  if (fs.existsSync(stepLogPath)) {
    appendEvent(stepLogPath, {
      actor: "Script",
      action: "Automated gate",
      output: metadataOk && ok ? "Picturebook package passed automated QA." : "Picturebook package failed automated QA; see qa_report.md.",
      decision: metadataOk && ok ? "Continue to manual QA or deliver." : "Repair the package and rerun the gate.",
      risk: metadataOk && ok ? "None recorded." : "The package is not ready for delivery."
    });
  }
  console.log(report);
  if (!ok || (isFinalPages && !metadataOk)) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
