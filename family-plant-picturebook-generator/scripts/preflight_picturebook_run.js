#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { appendEvent, validateLog } = require("./step_log_utils");

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
const missing = required.filter((file) => !fs.existsSync(path.join(bookDir, file)));
const empty = required.filter(
  (file) => fs.existsSync(path.join(bookDir, file)) && fs.statSync(path.join(bookDir, file)).size === 0
);
const logPath = path.join(bookDir, "step_log.md");
const log = fs.existsSync(logPath) ? fs.readFileSync(logPath, "utf8") : "";
const logCheck = validateLog(log);
let specError = null;
if (stage === "visual") {
  try {
    const spec = JSON.parse(fs.readFileSync(path.join(bookDir, "page_specs.json"), "utf8"));
    if (!Array.isArray(spec.pages) || spec.pages.length === 0) specError = "pages array is empty";
  } catch (error) {
    specError = error.message;
  }
}

const passed = missing.length === 0 && empty.length === 0 && logCheck.valid && !specError;
if (!passed) {
  if (missing.length) console.error(`Missing required files: ${missing.join(", ")}`);
  if (empty.length) console.error(`Empty required files: ${empty.join(", ")}`);
  if (!logCheck.valid) console.error(`Invalid production log (step_log.md): ${logCheck.errors.join("; ")}`);
  if (specError) console.error(`Invalid page_specs.json: ${specError}`);
}

if (fs.existsSync(logPath)) {
  appendEvent(logPath, {
    actor: "Script",
    action: `${stage} preflight`,
    output: passed ? "Required files and production state are valid." : "Preflight checks failed; see the command output.",
    decision: passed ? "Continue to the next workflow stage." : "Stop and repair the package before continuing.",
    risk: passed ? "None recorded." : "Production state is not ready."
  });
}

if (!passed) {
  console.error(`Preflight failed for ${stage} stage.`);
  process.exit(1);
}

console.log(`Preflight passed (${stage}): ${bookDir}`);
