#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function styleFor(spec, block) {
  const typography = spec.typography || {};
  const colors = typography.colors || {};
  const font =
    block.font ||
    (block.style === "title"
      ? typography.titleFont
      : block.style === "caption"
        ? typography.captionFont
        : typography.bodyFont) ||
    "Kaiti SC, STKaiti, PingFang SC, Hiragino Sans GB, sans-serif";
  const fill =
    block.color ||
    colors[block.style] ||
    (block.style === "title" ? "#8b3439" : "#2b1d1b");
  const weight = block.weight || (block.style === "title" ? 600 : 400);
  return { font, fill, weight };
}

function charWidth(char, size) {
  if (/[\x00-\x7F]/.test(char)) return size * 0.56;
  return size;
}

function measureText(text, size) {
  return Array.from(String(text)).reduce((sum, char) => sum + charWidth(char, size), 0);
}

function wrapText(text, size, maxWidth) {
  const paragraphs = String(text).split("\n");
  const lines = [];
  for (const paragraph of paragraphs) {
    let line = "";
    for (const char of Array.from(paragraph)) {
      const candidate = line + char;
      if (line && measureText(candidate, size) > maxWidth) {
        lines.push(line);
        line = char;
      } else {
        line = candidate;
      }
    }
    lines.push(line);
  }
  return lines;
}

function fitLines(text, initialSize, box, lineHeightRatio, minSize) {
  const padding = box.padding ?? 0;
  const maxWidth = Number(box.w) - padding * 2;
  const maxHeight = Number(box.h) - padding * 2;
  let size = initialSize;

  while (size >= minSize) {
    const lineHeight = Math.round(size * lineHeightRatio);
    const lines = wrapText(text, size, maxWidth);
    const textHeight = lines.length * lineHeight;
    const widest = Math.max(...lines.map((line) => measureText(line, size)), 0);
    if (widest <= maxWidth && textHeight <= maxHeight) {
      return { lines, size, lineHeight, textHeight };
    }
    size -= 1;
  }

  const lineHeight = Math.round(minSize * lineHeightRatio);
  const lines = wrapText(text, minSize, maxWidth);
  return { lines, size: minSize, lineHeight, textHeight: lines.length * lineHeight, overflow: true };
}

function renderBoxText(spec, block) {
  const { font, fill, weight } = styleFor(spec, block);
  const box = block.box;
  const initialSize = block.size || 28;
  const minSize = block.minSize || Math.max(18, initialSize - 8);
  const lineHeightRatio = block.lineHeightRatio || 1.32;
  const padding = box.padding ?? 18;
  const fit = fitLines(block.text, initialSize, { ...box, padding }, lineHeightRatio, minSize);
  if (fit.overflow && block.overflow !== "allow") {
    throw new Error(`Text overflow in block "${String(block.text).slice(0, 24)}..."`);
  }

  const align = block.align || box.align || "center";
  const valign = block.valign || box.valign || "middle";
  const letterSpacing = block.letterSpacing ? ` letter-spacing="${block.letterSpacing}"` : "";
  const maxWidth = Number(box.w) - padding * 2;
  const startX = Number(box.x) + padding;
  const centerX = Number(box.x) + Number(box.w) / 2;
  const endX = Number(box.x) + Number(box.w) - padding;
  const x = align === "left" ? startX : align === "right" ? endX : centerX;
  const anchor = align === "left" ? "start" : align === "right" ? "end" : "middle";
  const top =
    valign === "top"
      ? Number(box.y) + padding
      : valign === "bottom"
        ? Number(box.y) + Number(box.h) - padding - fit.textHeight
        : Number(box.y) + (Number(box.h) - fit.textHeight) / 2;
  const baselineOffset = Math.round(fit.size * 0.88);

  const debug = block.debugBox
    ? `<rect x="${Number(box.x)}" y="${Number(box.y)}" width="${Number(box.w)}" height="${Number(box.h)}" fill="none" stroke="#ff4d4d" stroke-width="2" />`
    : "";
  const textNodes = fit.lines
    .map((line, index) => {
      const y = top + baselineOffset + index * fit.lineHeight;
      return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${esc(font)}" font-size="${fit.size}" font-weight="${weight}" fill="${esc(fill)}"${letterSpacing}>${esc(line)}</text>`;
    })
    .join("\n");
  return `${debug}\n${textNodes}`;
}

function renderPointText(spec, block) {
  const { font, fill, weight } = styleFor(spec, block);
  const size = block.size || 28;
  const anchor = block.anchor || "start";
  const letterSpacing = block.letterSpacing ? ` letter-spacing="${block.letterSpacing}"` : "";
  const lines = Array.isArray(block.text) ? block.text : String(block.text).split("\n");
  const lineHeight = block.lineHeight || Math.round(size * 1.45);
  return lines
    .map((line, index) => {
      const y = Number(block.y) + index * lineHeight;
      return `<text x="${Number(block.x)}" y="${y}" text-anchor="${anchor}" font-family="${esc(font)}" font-size="${size}" font-weight="${weight}" fill="${esc(fill)}"${letterSpacing}>${esc(line)}</text>`;
    })
    .join("\n");
}

function textSvg(spec, page, width, height) {
  const texts = page.texts || [];
  const nodes = texts.map((block) => {
    if (block.box) return renderBoxText(spec, block);
    return renderPointText(spec, block);
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">\n${nodes.join("\n")}\n</svg>`;
}

async function render(specPath) {
  const root = path.dirname(path.resolve(specPath));
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const pages = spec.pages || [];
  if (!pages.length) throw new Error("page_specs.json has no pages");

  for (const page of pages) {
    const base = path.resolve(root, page.base);
    const out = path.resolve(root, page.out);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const meta = await sharp(base).metadata();
    const svg = textSvg(spec, page, meta.width, meta.height);
    await sharp(base)
      .composite([{ input: Buffer.from(svg), left: 0, top: 0 }])
      .png()
      .toFile(out);
    console.log(out);
  }
}

const specPath = process.argv[2];
if (!specPath) {
  console.error("Usage: render_picturebook_text.js <page_specs.json>");
  process.exit(2);
}

render(specPath).catch((error) => {
  console.error(error);
  process.exit(1);
});
