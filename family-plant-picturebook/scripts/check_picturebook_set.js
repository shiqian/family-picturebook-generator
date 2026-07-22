#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function main() {
  const dir = process.argv[2];
  if (!dir) {
    console.error("Usage: check_picturebook_set.js <base_pages_or_final_pages_dir>");
    process.exit(2);
  }
  const abs = path.resolve(dir);
  const folderName = path.basename(abs);
  const isFinalPages = folderName === "final_pages";
  const specPath = path.join(path.dirname(abs), "page_specs.json");
  let hasOutfitSheet = false;
  if (fs.existsSync(specPath)) {
    try {
      const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
      hasOutfitSheet = Boolean(
        spec.characterOutfitSheet &&
          spec.characterOutfitSheet.qiqi &&
          spec.characterOutfitSheet.mom
      );
    } catch {
      hasOutfitSheet = false;
    }
  }
  const files = fs
    .readdirSync(abs)
    .filter((file) => file.toLowerCase().endsWith(".png"))
    .sort();
  const lines = ["# Picturebook QA Report", ""];
  lines.push(`Checked directory: ${abs}`);
  lines.push(`Checked stage: ${isFinalPages ? "final_pages" : folderName}`);
  lines.push(`PNG pages: ${files.length}`);
  lines.push(`Character outfit sheet: ${hasOutfitSheet ? "PRESENT" : "MISSING"}`);
  lines.push("");

  let ok = true;
  for (const file of files) {
    const full = path.join(abs, file);
    const meta = await sharp(full).metadata();
    const ratioOk = meta.width * 4 === meta.height * 3;
    if (!ratioOk) ok = false;
    lines.push(`- ${file}: ${meta.width}x${meta.height} ${ratioOk ? "OK 3:4" : "NOT 3:4"}`);
  }

  lines.push("");
  lines.push("Automated gate:");
  lines.push("- Non-3:4 pages must not move forward to final typography.");
  lines.push("- If a page is normalized by crop or canvas extension, record it and visually inspect all edges.");
  lines.push("");
  lines.push("Manual QA required:");
  lines.push("- Font style is consistent across all pages.");
  lines.push("- Character outfits match the locked characterOutfitSheet exactly unless a scene change is specified.");
  lines.push("- All visible Chinese text came from deterministic typography, not image generation.");
  lines.push("- No rare characters, pseudo-text, old text shadows, or typo-prone glyphs.");
  lines.push("- No sticker/plaster text blocks; text sits in native bubbles or panels.");
  lines.push("- Dialogue text is centered inside speech bubbles, or intentionally aligned inside panels with safe padding.");
  lines.push("- Character identity is consistent; clothing fits the plant season and setting.");
  lines.push("- Plant morphology and look-alike comparisons match the source dossier.");
  lines.push("");
  lines.push(`Overall automated ratio check: ${ok ? "PASS" : "FAIL"}`);
  lines.push(`Overall metadata check: ${hasOutfitSheet ? "PASS" : "FAIL"}`);

  const report = path.join(path.dirname(abs), "qa_report.md");
  fs.writeFileSync(report, lines.join("\n"));
  console.log(report);
  if (!ok || (isFinalPages && !hasOutfitSheet)) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
