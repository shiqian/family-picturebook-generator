#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { appendEvent, validateLog } = require("./step_log_utils");

const IDENTITY_PATH = "assets/characters/qiqi-and-mom-reference.png";
const CONTINUITY_PATHS = {
  qiqi: "continuity/qiqi-outfit-sheet.png",
  mom: "continuity/mom-outfit-sheet.png"
};
const STYLE_PREFIX = "assets/examples/series-reference/final_pages/";

function nonEmptyFile(file) {
  return fs.existsSync(file) && fs.statSync(file).isFile() && fs.statSync(file).size > 0;
}

function hasReference(references, expectedPath, roleWords) {
  return references.some((reference) => {
    const role = typeof reference?.role === "string" ? reference.role.toLowerCase() : "";
    return reference?.path === expectedPath && roleWords.some((word) => role.includes(word));
  });
}

async function readablePng(file) {
  try {
    const metadata = await sharp(file).metadata();
    return metadata.format === "png";
  } catch {
    return false;
  }
}

async function main() {
  const dir = process.argv[2];
  if (!dir) {
    console.error("Usage: npm run check:picturebook -- output/<plant-slug>/final_pages");
    process.exit(2);
  }

  const finalPagesDir = path.resolve(dir);
  if (path.basename(finalPagesDir) !== "final_pages" || !fs.existsSync(finalPagesDir)) {
    console.error(`Expected an existing final_pages directory: ${finalPagesDir}`);
    process.exit(1);
  }

  const bookDir = path.dirname(finalPagesDir);
  const skillDir = path.resolve(__dirname, "..");
  const requiredFiles = [
    "source/scientific-dossier.md",
    "source/child-guide.md",
    "story_text.md",
    "page_specs.json",
    "step_log.md"
  ];
  const requiredFileChecks = requiredFiles.map((relativePath) => ({
    relativePath,
    present: nonEmptyFile(path.join(bookDir, relativePath))
  }));
  const requiredFilesOk = requiredFileChecks.every((check) => check.present);
  const stepLogPath = path.join(bookDir, "step_log.md");
  const stepLog = fs.existsSync(stepLogPath) ? fs.readFileSync(stepLogPath, "utf8") : "";
  const logCheck = validateLog(stepLog);
  const requiredDirsOk = ["source", "continuity", "final_pages"].every((dirName) =>
    fs.existsSync(path.join(bookDir, dirName)) && fs.statSync(path.join(bookDir, dirName)).isDirectory()
  );

  let specError = null;
  let continuitySpecsOk = false;
  let continuityAssetsOk = false;
  let identityAssetOk = false;
  let pageStructureOk = false;
  let pagePlanOk = false;
  let promptRecordsOk = false;
  let promptTextOk = false;
  let promptReferencesOk = false;
  let expectedFiles = null;

  if (nonEmptyFile(path.join(bookDir, "page_specs.json"))) {
    try {
      const spec = JSON.parse(fs.readFileSync(path.join(bookDir, "page_specs.json"), "utf8"));
      const continuity = spec.characterContinuity;
      const references = continuity?.referenceImages;
      continuitySpecsOk = Boolean(
        typeof continuity?.qiqi === "string" && continuity.qiqi.trim() &&
        typeof continuity?.mom === "string" && continuity.mom.trim() &&
        references?.qiqi === CONTINUITY_PATHS.qiqi &&
        references?.mom === CONTINUITY_PATHS.mom &&
        continuity.identityReference === IDENTITY_PATH
      );
      identityAssetOk = await readablePng(path.join(skillDir, IDENTITY_PATH));
      continuityAssetsOk = await Promise.all(
        Object.values(CONTINUITY_PATHS).map((relativePath) =>
          readablePng(path.join(bookDir, relativePath))
        )
      ).then((checks) => checks.every(Boolean));

      const pages = Array.isArray(spec.pages) ? spec.pages : [];
      const pagePlanException = typeof spec.meta?.pagePlanException === "string" && spec.meta.pagePlanException.trim();
      pageStructureOk = pages.length > 0 && pages.every((page) =>
        typeof page.file === "string" && page.file.trim() &&
        typeof page.pageRole === "string" && page.pageRole.trim() &&
        Array.isArray(page.characters) &&
        Array.isArray(page.textBlocks) && page.textBlocks.length > 0 &&
        page.imagegenPrompt && typeof page.imagegenPrompt.text === "string" && page.imagegenPrompt.text.trim() &&
        Array.isArray(page.imagegenPrompt.references)
      );
      pagePlanOk = pages.length === 7 || Boolean(pagePlanException);
      promptRecordsOk = pageStructureOk;
      promptTextOk = promptRecordsOk && pages.every((page) =>
        page.textBlocks.every((block) => typeof block.text === "string" && page.imagegenPrompt.text.includes(block.text))
      );
      promptReferencesOk = promptRecordsOk;
      if (promptReferencesOk) {
        for (const page of pages) {
          const refs = page.imagegenPrompt.references;
          if (!hasReference(refs, IDENTITY_PATH, ["identity", "character"])) {
            promptReferencesOk = false;
            break;
          }
          const styleReference = refs.find((reference) =>
            typeof reference?.path === "string" && reference.path.startsWith(STYLE_PREFIX)
          );
          if (!styleReference || !hasReference(refs, styleReference.path, ["style", "composition", "typography", "density"]) || !await readablePng(path.join(skillDir, styleReference.path))) {
            promptReferencesOk = false;
            break;
          }
          if (page.characters.some((character) =>
            !CONTINUITY_PATHS[character] || !hasReference(refs, CONTINUITY_PATHS[character], ["outfit", "accessor", "continuity"])
          )) {
            promptReferencesOk = false;
            break;
          }
        }
      }
    } catch (error) {
      specError = error.message;
    }
  } else {
    specError = "page_specs.json is missing or empty";
  }

  const files = fs.readdirSync(finalPagesDir).filter((file) => file.toLowerCase().endsWith(".png")).sort();
  expectedFiles = expectedFiles || [];
  let filesMatchSpec = false;
  try {
    const spec = JSON.parse(fs.readFileSync(path.join(bookDir, "page_specs.json"), "utf8"));
    expectedFiles = (Array.isArray(spec.pages) ? spec.pages : []).map((page) => page.file).filter(Boolean).sort();
    filesMatchSpec = expectedFiles.length > 0 && expectedFiles.length === files.length && expectedFiles.every((file, index) => file === files[index]);
  } catch {}

  const dimensionChecks = [];
  for (const file of files) {
    const metadata = await sharp(path.join(finalPagesDir, file)).metadata();
    const dimensionsOk = metadata.width === 1086 && metadata.height === 1448;
    dimensionChecks.push({ file, dimensionsOk, width: metadata.width, height: metadata.height });
  }
  const dimensionsOk = dimensionChecks.every((check) => check.dimensionsOk);
  const metadataOk = requiredDirsOk && requiredFilesOk && logCheck.valid && continuitySpecsOk && continuityAssetsOk && identityAssetOk && pageStructureOk && pagePlanOk && promptRecordsOk && promptTextOk && promptReferencesOk && filesMatchSpec;

  const lines = ["# Picturebook QA Report", "", `Checked directory: ${finalPagesDir}`, ""];
  lines.push(`Output directories: ${requiredDirsOk ? "PASS" : "FAIL"}`);
  for (const check of requiredFileChecks) lines.push(`Required file ${check.relativePath}: ${check.present ? "PRESENT" : "MISSING OR EMPTY"}`);
  lines.push(`Production log: ${logCheck.valid ? "PASS" : "FAIL"}`);
  if (!logCheck.valid) lines.push(`Production log errors: ${logCheck.errors.join("; ")}`);
  lines.push(`Continuity specifications: ${continuitySpecsOk ? "PASS" : "FAIL"}`);
  lines.push(`Continuity PNGs: ${continuityAssetsOk ? "PASS" : "FAIL"}`);
  lines.push(`Identity PNG: ${identityAssetOk ? "PASS" : "FAIL"}`);
  lines.push(`Page records: ${pageStructureOk ? "PASS" : "FAIL"}`);
  lines.push(`Page plan: ${pagePlanOk ? "PASS" : "FAIL"}`);
  lines.push(`Prompt records: ${promptRecordsOk ? "PASS" : "FAIL"}`);
  lines.push(`Prompt text matches page specs: ${promptTextOk ? "PASS" : "FAIL"}`);
  lines.push(`Prompt references and purpose labels: ${promptReferencesOk ? "PASS" : "FAIL"}`);
  lines.push(`Page/spec filename match: ${filesMatchSpec ? "PASS" : "FAIL"}`);
  for (const check of dimensionChecks) lines.push(`- ${check.file}: ${check.width}x${check.height} ${check.dimensionsOk ? "OK" : "FAIL"}`);
  lines.push(`Final page dimensions: ${dimensionsOk ? "PASS" : "FAIL"}`, "", "Manual QA required:");
  lines.push("- Text is exact, legible, native to the composition, and free of pseudo-text.");
  lines.push("- Identity, outfits, accessories, poses, style, anatomy, and typography remain consistent.");
  lines.push("- Plant morphology, comparisons, safety wording, seasons, and narrative flow are source-backed.");
  lines.push("", `Overall QA: ${metadataOk && dimensionsOk ? "PASS" : "FAIL"}`);

  const reportPath = path.join(bookDir, "qa_report.md");
  fs.writeFileSync(reportPath, lines.join("\n"));
  if (fs.existsSync(stepLogPath)) {
    appendEvent(stepLogPath, {
      actor: "Script",
      action: "final QA",
      outcome: metadataOk && dimensionsOk ? "completed" : "failed",
      output: metadataOk && dimensionsOk ? "Package contract passed." : "Package contract failed; see qa_report.md.",
      risk: metadataOk && dimensionsOk ? "Manual visual review remains." : "Package is not ready for delivery."
    });
  }
  console.log(reportPath);
  if (!metadataOk || !dimensionsOk) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
