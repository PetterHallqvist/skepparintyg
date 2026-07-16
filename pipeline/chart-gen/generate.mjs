#!/usr/bin/env node
/**
 * Deterministic fictional-chart generator (SPEC §20, ADR-0002).
 *
 * Emits public/charts/grundviken-v1/{chart.svg,manifest.json}. All geography
 * is INVENTED — never derived from real charts. The SVG is visual only; every
 * semantic object lives in the manifest (§20.3). Same seed → identical
 * output, so the chart and manifest are always in sync and diffable.
 *
 *   node pipeline/chart-gen/generate.mjs
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// --- deterministic PRNG ------------------------------------------------------

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(58_11_2026); // fixed seed — determinism (§16.3 spirit)

// --- chart parameters --------------------------------------------------------

const W = 1800;
const H = 1200;
const PX_PER_NM = 120; // 15 × 10 NM chart
const VARIATION = 6; // fictional east variation

const PALETTE = {
  water: "#fdfdfb",
  shallow: "#d9e8f2",
  shallowLine: "#8fb3c7",
  land: "#ece1b4",
  landLine: "#b3a26b",
  contour: "#a8c2d4",
  sounding: "#41637d",
  label: "#2c3e50",
  graticule: "#c8c2ae",
  rose: "#8a8súbor",
  watermark: "#9aa3ab",
};
PALETTE.rose = "#9aa5b1";

// --- helpers -----------------------------------------------------------------

const fmt = (n) => Number(n.toFixed(1));

/** Organic island blob: radial noise polygon around a centre. */
function blob(cx, cy, rBase, irregular = 0.35, points = 18) {
  const pts = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const r = rBase * (1 - irregular / 2 + rand() * irregular);
    pts.push({
      x: fmt(cx + Math.cos(a) * r),
      y: fmt(cy + Math.sin(a) * r * 0.8),
    });
  }
  return pts;
}

function polyPath(pts, close = true) {
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  return close ? `${d} Z` : d;
}

/** Smooth closed path through points (quadratic midpoint technique). */
function smoothPath(pts) {
  const n = pts.length;
  let d = "";
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const next = pts[(i + 1) % n];
    const mx = (p.x + next.x) / 2;
    const my = (p.y + next.y) / 2;
    d += i === 0 ? `M ${mx} ${my} ` : "";
    d += `Q ${next.x} ${next.y} ${fmt((next.x + pts[(i + 2) % n].x) / 2)} ${fmt((next.y + pts[(i + 2) % n].y) / 2)} `;
  }
  return d + "Z";
}

// --- geography (invented) ----------------------------------------------------

// Mainland along the north-west corner
const mainland = [
  { x: -40, y: -40 },
  { x: 640, y: -40 },
  { x: 560, y: 60 },
  { x: 470, y: 110 },
  { x: 420, y: 200 },
  { x: 330, y: 250 },
  { x: 260, y: 340 },
  { x: 190, y: 370 },
  { x: 120, y: 460 },
  { x: 40, y: 500 },
  { x: -40, y: 520 },
];

const ekholmen = blob(1130, 420, 150);
const salskar = blob(1520, 880, 90);
const lillgrund = blob(620, 850, 60, 0.5, 12);

// Shoal between the fairway and Sälskär
const shoal = [
  { x: 1240, y: 700 },
  { x: 1330, y: 660 },
  { x: 1420, y: 700 },
  { x: 1400, y: 790 },
  { x: 1290, y: 810 },
];

// --- semantic features (manifest is the source of truth) ----------------------

const features = [
  {
    id: "fyr-norrgrund",
    type: "lighthouse",
    position: { x: 830, y: 210 },
    name: "Norrgrund",
    properties: { character: "Fl(2) 10s", heightM: 14 },
    hitRadiusPx: 26,
  },
  {
    id: "hamn-grundviken",
    type: "harbour",
    position: { x: 350, y: 300 },
    name: "Grundviken",
    properties: {},
    hitRadiusPx: 30,
  },
  {
    id: "sb-1",
    type: "lateral_starboard",
    position: { x: 600, y: 520 },
    name: "SB 1",
    properties: { light: "Q G" },
    hitRadiusPx: 24,
  },
  {
    id: "bb-1",
    type: "lateral_port",
    position: { x: 700, y: 430 },
    name: "BB 1",
    properties: { light: "Q R" },
    hitRadiusPx: 24,
  },
  {
    id: "sb-2",
    type: "lateral_starboard",
    position: { x: 960, y: 700 },
    name: "SB 2",
    properties: {},
    hitRadiusPx: 24,
  },
  {
    id: "nordprick-tva-systrar",
    type: "cardinal_north",
    position: { x: 1330, y: 620 },
    name: "Två systrar",
    properties: { topmark: "två koner uppåt", light: "Q" },
    hitRadiusPx: 24,
  },
  {
    id: "ankarplats-ekholmen",
    type: "anchorage",
    position: { x: 1060, y: 620 },
    name: "Ekholmens ankarplats",
    properties: {},
    hitRadiusPx: 28,
  },
];

const soundings = [];
for (let i = 0; i < 46; i++) {
  const x = 80 + rand() * (W - 160);
  const y = 80 + rand() * (H - 160);
  // keep off land/islands (rough exclusion by distance)
  const nearLand =
    (x < 700 && y < 520) ||
    Math.hypot(x - 1130, y - 420) < 210 ||
    Math.hypot(x - 1520, y - 880) < 150 ||
    Math.hypot(x - 620, y - 850) < 110 ||
    (x > 1230 && x < 1440 && y > 640 && y < 830) ||
    // keep the compass rose readable
    Math.hypot(x - 1560, y - 260) < 130;
  if (nearLand) continue;
  const depth = fmt(3 + rand() * 28);
  soundings.push({
    x: fmt(x),
    y: fmt(y),
    depth: String(depth).replace(".", ","),
  });
}

// --- SVG ----------------------------------------------------------------------

function marker(f) {
  const { x, y } = f.position;
  switch (f.type) {
    case "lighthouse":
      return `
  <g class="feature" data-id="${f.id}">
    <circle cx="${x}" cy="${y}" r="6" fill="#1b1b1b"/>
    <circle cx="${x}" cy="${y}" r="12" fill="none" stroke="#c0392b" stroke-width="2"/>
    <path d="M ${x - 16} ${y - 16} l 6 6 M ${x + 16} ${y - 16} l -6 6 M ${x - 16} ${y + 16} l 6 -6 M ${x + 16} ${y + 16} l -6 -6" stroke="#c0392b" stroke-width="1.4"/>
    <text x="${x + 20}" y="${y - 12}" class="lbl">${f.name}</text>
    <text x="${x + 20}" y="${y + 4}" class="char">${f.properties.character ?? ""}</text>
  </g>`;
    case "lateral_port":
      return `
  <g class="feature" data-id="${f.id}">
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y - 18}" stroke="#c0392b" stroke-width="3"/>
    <rect x="${x - 6}" y="${y - 30}" width="12" height="12" fill="#c0392b"/>
    <text x="${x + 12}" y="${y - 18}" class="char">${f.name}</text>
  </g>`;
    case "lateral_starboard":
      return `
  <g class="feature" data-id="${f.id}">
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y - 18}" stroke="#1e8449" stroke-width="3"/>
    <path d="M ${x - 7} ${y - 18} h 14 l -7 -14 z" fill="#1e8449"/>
    <text x="${x + 12}" y="${y - 18}" class="char">${f.name}</text>
  </g>`;
    case "cardinal_north":
      return `
  <g class="feature" data-id="${f.id}">
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y - 20}" stroke="#1b1b1b" stroke-width="3"/>
    <path d="M ${x - 6} ${y - 20} h 12 l -6 -10 z" fill="#1b1b1b"/>
    <path d="M ${x - 6} ${y - 32} h 12 l -6 -10 z" fill="#1b1b1b"/>
    <text x="${x + 12}" y="${y - 24}" class="char">${f.name}</text>
  </g>`;
    case "harbour":
      return `
  <g class="feature" data-id="${f.id}">
    <circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${PALETTE.label}" stroke-width="2.4"/>
    <path d="M ${x} ${y - 7} v 14 M ${x - 7} ${y} h 14" stroke="${PALETTE.label}" stroke-width="2.4"/>
    <text x="${x + 14}" y="${y + 5}" class="lbl">${f.name}</text>
  </g>`;
    case "anchorage":
      return `
  <g class="feature" data-id="${f.id}">
    <path d="M ${x} ${y - 10} v 18 M ${x - 8} ${y - 2} h 16 M ${x - 9} ${y + 4} q 9 10 18 0" fill="none" stroke="${PALETTE.label}" stroke-width="2"/>
    <circle cx="${x}" cy="${y - 12}" r="3" fill="none" stroke="${PALETTE.label}" stroke-width="2"/>
  </g>`;
    default:
      return "";
  }
}

// graticule: 1 NM = 1 latitude minute = PX_PER_NM px
let graticule = "";
for (let gx = PX_PER_NM; gx < W; gx += PX_PER_NM) {
  graticule += `<line x1="${gx}" y1="0" x2="${gx}" y2="14" stroke="${PALETTE.graticule}" stroke-width="1"/>`;
  graticule += `<line x1="${gx}" y1="${H}" x2="${gx}" y2="${H - 14}" stroke="${PALETTE.graticule}" stroke-width="1"/>`;
}
for (let gy = PX_PER_NM; gy < H; gy += PX_PER_NM) {
  graticule += `<line x1="0" y1="${gy}" x2="14" y2="${gy}" stroke="${PALETTE.graticule}" stroke-width="1"/>`;
  graticule += `<line x1="${W}" y1="${gy}" x2="${W - 14}" y2="${gy}" stroke="${PALETTE.graticule}" stroke-width="1"/>`;
  // latitude scale ticks (distance is read here, §F2)
  graticule += `<line x1="22" y1="${gy}" x2="34" y2="${gy}" stroke="${PALETTE.sounding}" stroke-width="1"/>`;
}

const rose = (() => {
  const cx = 1560;
  const cy = 260;
  let ticks = "";
  for (let d = 0; d < 360; d += 10) {
    const major = d % 90 === 0;
    const r0 = major ? 54 : 62;
    const a = ((d - 90) * Math.PI) / 180;
    ticks += `<line x1="${fmt(cx + Math.cos(a) * r0)}" y1="${fmt(cy + Math.sin(a) * r0)}" x2="${fmt(cx + Math.cos(a) * 70)}" y2="${fmt(cy + Math.sin(a) * 70)}" stroke="${PALETTE.rose}" stroke-width="${major ? 1.6 : 0.8}"/>`;
  }
  return `
  <g opacity="0.85">
    <circle cx="${cx}" cy="${cy}" r="70" fill="none" stroke="${PALETTE.rose}" stroke-width="1"/>
    <circle cx="${cx}" cy="${cy}" r="44" fill="none" stroke="${PALETTE.rose}" stroke-width="0.7"/>
    ${ticks}
    <path d="M ${cx} ${cy - 44} l 7 32 l -7 12 l -7 -12 z" fill="${PALETTE.rose}"/>
    <text x="${cx}" y="${cy - 78}" text-anchor="middle" class="char" fill="${PALETTE.sounding}">N</text>
    <text x="${cx}" y="${cy + 96}" text-anchor="middle" class="char">Missvisning ${VARIATION}° E (fiktiv)</text>
  </g>`;
})();

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="Georgia, 'Times New Roman', serif">
  <style>
    .lbl { font-size: 22px; fill: ${PALETTE.label}; font-style: italic; }
    .char { font-size: 15px; fill: ${PALETTE.sounding}; font-family: 'Courier New', monospace; }
    .snd { font-size: 14px; fill: ${PALETTE.sounding}; font-style: italic; }
    .wm { font-size: 26px; fill: ${PALETTE.watermark}; letter-spacing: 0.35em; font-family: 'Courier New', monospace; }
  </style>

  <rect width="${W}" height="${H}" fill="${PALETTE.water}"/>

  <!-- shallow water tints and contours -->
  <g id="layer-depths">
    <path d="${smoothPath(blob(1130, 420, 210, 0.15))}" fill="${PALETTE.shallow}" opacity="0.6"/>
    <path d="${smoothPath(blob(620, 850, 110, 0.2, 14))}" fill="${PALETTE.shallow}" opacity="0.6"/>
    <path d="${smoothPath(blob(1520, 880, 150, 0.15))}" fill="${PALETTE.shallow}" opacity="0.6"/>
    <path d="M 0 620 Q 300 560 560 640 T 1040 760 T 1500 1020" fill="none" stroke="${PALETTE.contour}" stroke-width="1.4"/>
    <path d="M 60 900 Q 380 820 700 950 T 1240 1080" fill="none" stroke="${PALETTE.contour}" stroke-width="1.4"/>
    <!-- shoal (hazard) -->
    <path d="${polyPath(shoal)}" fill="${PALETTE.shallow}" stroke="${PALETTE.shallowLine}" stroke-width="1.6" stroke-dasharray="6 5"/>
    <text x="1315" y="745" class="snd" font-weight="bold">1,8</text>
    <text x="1300" y="775" class="snd">Stengrundet</text>
  </g>

  <!-- land -->
  <g id="layer-land">
    <path d="${polyPath(mainland)}" fill="${PALETTE.land}" stroke="${PALETTE.landLine}" stroke-width="2.4"/>
    <path d="${smoothPath(ekholmen)}" fill="${PALETTE.land}" stroke="${PALETTE.landLine}" stroke-width="2.4"/>
    <path d="${smoothPath(salskar)}" fill="${PALETTE.land}" stroke="${PALETTE.landLine}" stroke-width="2.4"/>
    <path d="${smoothPath(lillgrund)}" fill="${PALETTE.land}" stroke="${PALETTE.landLine}" stroke-width="2.4"/>
    <text x="1080" y="420" class="lbl" font-size="26">Ekholmen</text>
    <text x="1470" y="880" class="lbl">Sälskär</text>
    <text x="585" y="855" class="lbl" font-size="18">Lillgrund</text>
    <text x="150" y="150" class="lbl" font-size="30">Grundviken</text>
  </g>

  <!-- soundings -->
  <g id="layer-soundings">
    ${soundings.map((s) => `<text x="${s.x}" y="${s.y}" class="snd" text-anchor="middle">${s.depth}</text>`).join("\n    ")}
  </g>

  <!-- marks and lights -->
  <g id="layer-marks">${features.map(marker).join("")}
  </g>

  <!-- graticule + rose -->
  <g id="layer-graticule">${graticule}</g>
  ${rose}

  <!-- frame -->
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="none" stroke="${PALETTE.landLine}" stroke-width="2"/>

  <!-- WATERMARK — always present, never removable (SPEC §20.1) -->
  <text x="${W / 2}" y="${H - 36}" text-anchor="middle" class="wm">ÖVNINGSKORT — EJ FÖR NAVIGATION</text>
  <text x="${W / 2}" y="${H / 2}" text-anchor="middle" class="wm" opacity="0.13" transform="rotate(-18 ${W / 2} ${H / 2})" font-size="54">ÖVNINGSKORT — EJ FÖR NAVIGATION</text>
  <text x="30" y="${H - 36}" class="char">Grundviken-v1 · fiktivt övningsområde · Sjöklart</text>
</svg>
`;

// --- manifest ------------------------------------------------------------------

const manifest = {
  id: "grundviken-v1",
  title: "Grundviken",
  version: 1,
  svg: "/charts/grundviken-v1/chart.svg",
  widthPx: W,
  heightPx: H,
  coordinateSystem: {
    type: "fictional_geographic",
    originLatDeg: 58,
    originLatMin: 10,
    originLonDeg: 11,
    originLonMin: 20,
    pxPerLatMinute: PX_PER_NM,
    pxPerLonMinuteAtChart: PX_PER_NM,
    northVector: [0, -1],
  },
  scale: { pxPerNm: PX_PER_NM, uniform: true },
  compass: {
    variationDeg: VARIATION,
    variationEpochLabel: "Fiktivt övningsvärde",
    deviationTable: [
      { compassDeg: 0, deviationDeg: -3 },
      { compassDeg: 45, deviationDeg: -1 },
      { compassDeg: 90, deviationDeg: 2 },
      { compassDeg: 135, deviationDeg: 4 },
      { compassDeg: 180, deviationDeg: 3 },
      { compassDeg: 225, deviationDeg: 0 },
      { compassDeg: 270, deviationDeg: -2 },
      { compassDeg: 315, deviationDeg: -4 },
      { compassDeg: 360, deviationDeg: -3 },
    ],
  },
  layers: [
    { id: "land", defaultVisible: true },
    { id: "depths", defaultVisible: true },
    { id: "marks", defaultVisible: true },
    { id: "labels", defaultVisible: true },
  ],
  features,
  hazards: [
    {
      id: "stengrundet",
      kind: "shoal",
      minDepthM: 1.8,
      polygon: shoal,
    },
  ],
  legal: {
    notice: "Fiktivt övningskort. Ej för navigation.",
    assetAuthor: "Sjöklart chart-gen (deterministisk, seed 58112026)",
    reviewedBy: "",
  },
};

// --- write ---------------------------------------------------------------------

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const outDir = join(root, "public", "charts", "grundviken-v1");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "chart.svg"), svg);
writeFileSync(
  join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `wrote grundviken-v1: ${features.length} features, ${soundings.length} soundings, ${manifest.hazards.length} hazards`,
);
