#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { appendEvent } = require("./step_log_utils");

const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("Usage: node init_picturebook_run.js <lowercase-plant-slug>");
  process.exit(2);
}

const bookDir = path.resolve(process.cwd(), "output", slug);
const dirs = ["source", "continuity", "final_pages"];
for (const dir of dirs) fs.mkdirSync(path.join(bookDir, dir), { recursive: true });

const logPath = path.join(bookDir, "step_log.md");
if (!fs.existsSync(logPath)) {
  fs.writeFileSync(logPath, `# Production Log — ${slug}\n\n`);
  appendEvent(logPath, {
    actor: "Script",
    action: "Initialization",
    output: "source/, continuity/, and final_pages/ created.",
    decision: "Await source handoff.",
    risk: "Plant taxon is not locked yet."
  });
  console.log(`Created ${logPath}`);
} else {
  console.log(`Preserved existing ${logPath}`);
}
console.log(bookDir);
