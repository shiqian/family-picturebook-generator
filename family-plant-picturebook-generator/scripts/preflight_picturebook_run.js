#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const stage = process.argv[2];
const bookDir = process.argv[3] && path.resolve(process.argv[3]);
if (!["source", "visual"].includes(stage) || !bookDir) {
  console.error("Usage: node preflight_picturebook_run.js <source|visual> output/<plant-slug>");
  process.exit(2);
}

const commonRequired = [
  "step_log.md",
  "source/scientific-dossier.md",
  "source/child-guide.md"
];
const visualRequired = ["story_text.md", "page_specs.json", "continuity/qiqi-outfit-sheet.png", "continuity/mom-outfit-sheet.png"];
const required = stage === "visual" ? [...commonRequired, ...visualRequired] : commonRequired;
const headings = [
  "## 1. Source Handoff",
  "## 2. Story Plan",
  "## 3. Character Continuity",
  "## 4. Visual Plan",
  "## 5. Page Generation",
  "## 6. Automated Gate",
  "## 7. Manual QA"
];
const missing = required.filter((file) => !fs.existsSync(path.join(bookDir, file)));
const logPath = path.join(bookDir, "step_log.md");
const log = fs.existsSync(logPath) ? fs.readFileSync(logPath, "utf8") : "";
const missingHeadings = headings.filter((heading) => !log.includes(heading));
let specError = null;
if (stage === "visual") {
  try {
    const spec = JSON.parse(fs.readFileSync(path.join(bookDir, "page_specs.json"), "utf8"));
    if (!Array.isArray(spec.pages) || spec.pages.length === 0) specError = "pages array is empty";
  } catch (error) {
    specError = error.message;
  }
}

if (missing.length || missingHeadings.length || specError) {
  if (missing.length) console.error(`Missing required files: ${missing.join(", ")}`);
  if (missingHeadings.length) console.error(`Missing step-log headings: ${missingHeadings.join(", ")}`);
  if (specError) console.error(`Invalid page_specs.json: ${specError}`);
  console.error(`Preflight failed for ${stage} stage.`);
  process.exit(1);
}

console.log(`Preflight passed (${stage}): ${bookDir}`);
