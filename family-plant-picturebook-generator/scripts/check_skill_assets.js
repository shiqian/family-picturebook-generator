#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function pngMeta(file) {
  const buffer = fs.readFileSync(file);
  const signature = buffer.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") {
    throw new Error(`${file} is not a PNG`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function main() {
  const skillDir = path.resolve(__dirname, "..");
  const required = [
    "assets/characters/qiqi-and-mom-reference.png",
    "assets/examples/erqiao-yulan/asset-manifest.json",
    "assets/examples/erqiao-yulan/final_pages/01-cover.png",
    "assets/examples/erqiao-yulan/final_pages/02-meet.png",
    "assets/examples/erqiao-yulan/final_pages/03-name.png",
    "assets/examples/erqiao-yulan/final_pages/04-why-first-flower.png",
    "assets/examples/erqiao-yulan/final_pages/05-flower-closeup.png",
    "assets/examples/erqiao-yulan/final_pages/06-comparison.png",
    "assets/examples/erqiao-yulan/final_pages/07-ending.png"
  ];

  let ok = true;
  for (const rel of required) {
    const full = path.join(skillDir, rel);
    if (!fs.existsSync(full)) {
      console.error(`MISSING ${rel}`);
      ok = false;
      continue;
    }
    if (rel.endsWith(".png")) {
      const { width, height } = pngMeta(full);
      const ratioOk = width * 4 === height * 3;
      console.log(`${ratioOk ? "OK" : "BAD"} ${rel} ${width}x${height}`);
      if (!ratioOk) ok = false;
    } else {
      console.log(`OK ${rel}`);
    }
  }

  if (!ok) process.exit(1);
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
