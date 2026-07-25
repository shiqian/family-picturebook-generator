#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

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
  const date = new Date().toISOString();
  fs.writeFileSync(logPath, `# Production Log — ${slug}\n\nStarted: ${date}\n\n` +
`## 1. Source Handoff\n- [ ] Target taxon locked.\n- [ ] source/scientific-dossier.md present.\n- [ ] source/child-guide.md present.\n\n` +
`## 2. Story Plan\n- [ ] story_text.md created and source-traceable.\n\n` +
`## 3. Character Continuity\n- [ ] qiqi-outfit-sheet.png generated and inspected.\n- [ ] mom-outfit-sheet.png generated and inspected.\n\n` +
`## 4. Visual Plan\n- [ ] page_specs.json complete before page generation.\n\n` +
`## 5. Page Generation\n- Pages generated: 0\n\n` +
`## 6. Automated Gate\n- [ ] Automated QA passed.\n\n` +
`## 7. Manual QA\n- [ ] Visual and factual QA passed.\n\n`);
  console.log(`Created ${logPath}`);
} else {
  console.log(`Preserved existing ${logPath}`);
}
console.log(bookDir);
