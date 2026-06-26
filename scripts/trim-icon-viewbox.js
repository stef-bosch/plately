/* eslint-disable */
/**
 * One-time tool: trims each brand glyph SVG's viewBox to a square that tightly
 * fits its drawable content (plus a small uniform margin). This makes the
 * `size` prop visually consistent across all brand icons AND with Ionicons,
 * because every glyph then fills its box the same way.
 *
 * Run: node scripts/trim-icon-viewbox.js
 */
const fs = require('fs');
const path = require('path');
const { svgPathBbox } = require('svg-path-bbox');

const BRAND_DIR = path.join(__dirname, '..', 'src', 'assets', 'brand');

// Glyph icons only — leave the wordmark (logo), mark (symbol) and app-icon
// untouched, as their composition/padding is intentional.
const ICONS = [
  'calendar', 'chef-hat', 'fish', 'fruit', 'grain', 'graph', 'heat', 'home',
  'like', 'line', 'measure', 'meat', 'notification', 'plus', 'scale', 'search',
  'settings', 'user', 'vegetable',
];

const PADDING_RATIO = 0.07; // small breathing room around the glyph

function mergeBox(a, b) {
  if (!a) return b;
  return [
    Math.min(a[0], b[0]),
    Math.min(a[1], b[1]),
    Math.max(a[2], b[2]),
    Math.max(a[3], b[3]),
  ];
}

function contentBox(svg) {
  let box = null;

  // Paths
  const pathRe = /<path[^>]*\sd="([^"]+)"/g;
  let m;
  while ((m = pathRe.exec(svg))) {
    box = mergeBox(box, svgPathBbox(m[1]));
  }

  // Circles
  const circleRe = /<circle[^>]*>/g;
  while ((m = circleRe.exec(svg))) {
    const tag = m[0];
    const cx = parseFloat((/\scx="([^"]+)"/.exec(tag) || [])[1] || '0');
    const cy = parseFloat((/\scy="([^"]+)"/.exec(tag) || [])[1] || '0');
    const r = parseFloat((/\sr="([^"]+)"/.exec(tag) || [])[1] || '0');
    box = mergeBox(box, [cx - r, cy - r, cx + r, cy + r]);
  }

  // Rects
  const rectRe = /<rect[^>]*>/g;
  while ((m = rectRe.exec(svg))) {
    const tag = m[0];
    const x = parseFloat((/\sx="([^"]+)"/.exec(tag) || [])[1] || '0');
    const y = parseFloat((/\sy="([^"]+)"/.exec(tag) || [])[1] || '0');
    const w = parseFloat((/\swidth="([^"]+)"/.exec(tag) || [])[1] || '0');
    const h = parseFloat((/\sheight="([^"]+)"/.exec(tag) || [])[1] || '0');
    box = mergeBox(box, [x, y, x + w, y + h]);
  }

  return box;
}

function round(n) {
  return Math.round(n * 1000) / 1000;
}

for (const name of ICONS) {
  const file = path.join(BRAND_DIR, `${name}.svg`);
  const svg = fs.readFileSync(file, 'utf8');
  const box = contentBox(svg);
  if (!box) {
    console.warn(`! ${name}: no content found, skipped`);
    continue;
  }

  const [x0, y0, x1, y1] = box;
  const w = x1 - x0;
  const h = y1 - y0;
  const cx = x0 + w / 2;
  const cy = y0 + h / 2;
  const side = Math.max(w, h) * (1 + PADDING_RATIO * 2);
  const minX = round(cx - side / 2);
  const minY = round(cy - side / 2);
  const s = round(side);

  const viewBox = `${minX} ${minY} ${s} ${s}`;
  const next = svg.replace(/viewBox="[^"]*"/, `viewBox="${viewBox}"`);
  fs.writeFileSync(file, next);
  console.log(`✓ ${name.padEnd(13)} viewBox="${viewBox}"`);
}
