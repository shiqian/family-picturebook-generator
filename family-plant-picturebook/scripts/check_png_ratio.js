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
  const target = process.argv[2];
  if (!target) {
    console.error("Usage: check_png_ratio.js <png_file_or_directory>");
    process.exit(2);
  }

  const abs = path.resolve(target);
  const stat = fs.statSync(abs);
  const files = stat.isDirectory()
    ? fs.readdirSync(abs)
        .filter((file) => file.toLowerCase().endsWith(".png"))
        .sort()
        .map((file) => path.join(abs, file))
    : [abs];

  let ok = true;
  for (const file of files) {
    const { width, height } = pngMeta(file);
    const ratioOk = width * 4 === height * 3;
    console.log(`${ratioOk ? "OK" : "BAD"} ${path.basename(file)} ${width}x${height}`);
    if (!ratioOk) ok = false;
  }

  if (!ok) process.exit(1);
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
