#!/usr/bin/env node

/**
 * generate-themes.js
 *
 * Generates 100 theme definitions and writes them to:
 *   servers/nextjs/app/(presentation-generator)/theme/theme-data.ts
 *
 * Usage: node servers/nextjs/scripts/generate-themes.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Color math utilities
// ---------------------------------------------------------------------------

function hexToRgb(hex) {
  const clean = hex.replace(/^#/, "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHsl({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s, l };
}

function hslToRgb({ h, s, l }) {
  h = ((h % 360) + 360) % 360;
  const hNorm = h / 360;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, hNorm + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hNorm) * 255),
    b: Math.round(hue2rgb(p, q, hNorm - 1 / 3) * 255),
  };
}

function hslToHex(hsl) {
  const { r, g, b } = hslToRgb(hsl);
  return (
    "#" +
    [r, g, b]
      .map((v) => {
        const clamped = Math.max(0, Math.min(255, v));
        return clamped.toString(16).padStart(2, "0");
      })
      .join("")
      .toUpperCase()
  );
}

function hexToHsl(hex) {
  return rgbToHsl(hexToRgb(hex));
}

function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Blend two hex colors together.
 * amount=0 → pure base, amount=1 → pure target
 */
function tintColor(base, target, amount) {
  const b = hexToRgb(base);
  const t = hexToRgb(target);
  return (
    "#" +
    ["r", "g", "b"]
      .map((ch) => {
        const mixed = Math.round(b[ch] + (t[ch] - b[ch]) * amount);
        return Math.max(0, Math.min(255, mixed)).toString(16).padStart(2, "0");
      })
      .join("")
      .toUpperCase()
  );
}

/**
 * Generate 10 graph colors using 36° hue rotations from the primary color.
 * Each color gets good saturation (0.65–0.85) and appropriate lightness.
 */
function generateGraphColors(primaryHex) {
  const hsl = hexToHsl(primaryHex);
  const lum = luminance(primaryHex);
  const isDark = lum < 0.3;

  const colors = [];
  for (let i = 0; i < 10; i++) {
    const hue = (hsl.h + i * 36) % 360;
    // Vary saturation slightly for variety
    const sat = 0.65 + ((i * 13) % 20) / 100; // 0.65–0.85
    // Lightness: for dark themes slightly lighter, for light themes typical mid-range
    let lightness;
    if (isDark) {
      lightness = 0.55 + ((i * 7) % 15) / 100; // 0.55–0.70
    } else {
      lightness = 0.38 + ((i * 7) % 15) / 100; // 0.38–0.53
    }
    colors.push(hslToHex({ h: hue, s: sat, l: lightness }));
  }
  return colors;
}

// ---------------------------------------------------------------------------
// Derive colors for new themes from seed (primary, background) pairs
// ---------------------------------------------------------------------------

function deriveThemeColors(primaryHex, bgHex, cardTintAmount, strokeTintAmount) {
  cardTintAmount = cardTintAmount !== undefined ? cardTintAmount : 0.06;
  strokeTintAmount = strokeTintAmount !== undefined ? strokeTintAmount : 0.12;

  const bgLum = luminance(bgHex);
  const isDark = bgLum < 0.3;

  const cardColor = tintColor(bgHex, primaryHex, cardTintAmount);
  const strokeColor = tintColor(bgHex, primaryHex, strokeTintAmount);

  let primaryText, bgText;
  if (isDark) {
    // Dark background: use very light text
    primaryText = "#F0F0F0";
    // Background text: slightly muted white
    const primaryHsl = hexToHsl(primaryHex);
    bgText = hslToHex({ h: primaryHsl.h, s: 0.15, l: 0.70 });
  } else {
    // Light background: use very dark text derived from primary hue
    const primaryHsl = hexToHsl(primaryHex);
    primaryText = hslToHex({ h: primaryHsl.h, s: 0.35, l: 0.12 });
    bgText = hslToHex({ h: primaryHsl.h, s: 0.20, l: 0.42 });
  }

  const graphs = generateGraphColors(primaryHex);

  return {
    "--primary-color": primaryHex,
    "--background-color": bgHex,
    "--card-color": cardColor,
    "--stroke": strokeColor,
    "--primary-text": primaryText,
    "--background-text": bgText,
    "--graph-0": graphs[0],
    "--graph-1": graphs[1],
    "--graph-2": graphs[2],
    "--graph-3": graphs[3],
    "--graph-4": graphs[4],
    "--graph-5": graphs[5],
    "--graph-6": graphs[6],
    "--graph-7": graphs[7],
    "--graph-8": graphs[8],
    "--graph-9": graphs[9],
  };
}

// ---------------------------------------------------------------------------
// Hardcoded existing 6 themes (MUST NOT change)
// ---------------------------------------------------------------------------

const EXISTING_THEMES = [
  {
    id: "light",
    displayName: "Light",
    category: "Classic",
    colors: {
      "--primary-color": "#234CD9",
      "--background-color": "#FFFFFF",
      "--card-color": "#F5F5F5",
      "--stroke": "#E5E7EB",
      "--primary-text": "#1A1A1A",
      "--background-text": "#666666",
      "--graph-0": "#234CD9",
      "--graph-1": "#E74C3C",
      "--graph-2": "#2ECC71",
      "--graph-3": "#F39C12",
      "--graph-4": "#9B59B6",
      "--graph-5": "#1ABC9C",
      "--graph-6": "#E67E22",
      "--graph-7": "#3498DB",
      "--graph-8": "#E91E63",
      "--graph-9": "#00BCD4",
    },
  },
  {
    id: "dark",
    displayName: "Dark",
    category: "Classic",
    colors: {
      "--primary-color": "#7C6BFF",
      "--background-color": "#1A1A2E",
      "--card-color": "#262640",
      "--stroke": "#3A3A55",
      "--primary-text": "#FFFFFF",
      "--background-text": "#A0A0B8",
      "--graph-0": "#7C6BFF",
      "--graph-1": "#FF6B6B",
      "--graph-2": "#51CF66",
      "--graph-3": "#FFD43B",
      "--graph-4": "#CC5DE8",
      "--graph-5": "#20C997",
      "--graph-6": "#FF922B",
      "--graph-7": "#339AF0",
      "--graph-8": "#F06595",
      "--graph-9": "#22B8CF",
    },
  },
  {
    id: "royal_blue",
    displayName: "Royal Blue",
    category: "Classic",
    colors: {
      "--primary-color": "#1E3A8A",
      "--background-color": "#EFF6FF",
      "--card-color": "#DBEAFE",
      "--stroke": "#93C5FD",
      "--primary-text": "#1E3A5F",
      "--background-text": "#4B6A9B",
      "--graph-0": "#1E3A8A",
      "--graph-1": "#DC2626",
      "--graph-2": "#15803D",
      "--graph-3": "#CA8A04",
      "--graph-4": "#7E22CE",
      "--graph-5": "#0D9488",
      "--graph-6": "#EA580C",
      "--graph-7": "#2563EB",
      "--graph-8": "#DB2777",
      "--graph-9": "#0891B2",
    },
  },
  {
    id: "faint_yellow",
    displayName: "Faint Yellow",
    category: "Classic",
    colors: {
      "--primary-color": "#92400E",
      "--background-color": "#FFFBEB",
      "--card-color": "#FEF3C7",
      "--stroke": "#FDE68A",
      "--primary-text": "#451A03",
      "--background-text": "#78716C",
      "--graph-0": "#92400E",
      "--graph-1": "#DC2626",
      "--graph-2": "#15803D",
      "--graph-3": "#B45309",
      "--graph-4": "#7E22CE",
      "--graph-5": "#0D9488",
      "--graph-6": "#EA580C",
      "--graph-7": "#2563EB",
      "--graph-8": "#DB2777",
      "--graph-9": "#0891B2",
    },
  },
  {
    id: "light_red",
    displayName: "Light Red",
    category: "Classic",
    colors: {
      "--primary-color": "#DC2626",
      "--background-color": "#FEF2F2",
      "--card-color": "#FEE2E2",
      "--stroke": "#FECACA",
      "--primary-text": "#7F1D1D",
      "--background-text": "#991B1B",
      "--graph-0": "#DC2626",
      "--graph-1": "#2563EB",
      "--graph-2": "#15803D",
      "--graph-3": "#CA8A04",
      "--graph-4": "#7E22CE",
      "--graph-5": "#0D9488",
      "--graph-6": "#EA580C",
      "--graph-7": "#1E3A8A",
      "--graph-8": "#DB2777",
      "--graph-9": "#0891B2",
    },
  },
  {
    id: "dark_pink",
    displayName: "Dark Pink",
    category: "Classic",
    colors: {
      "--primary-color": "#DB2777",
      "--background-color": "#FDF2F8",
      "--card-color": "#FCE7F3",
      "--stroke": "#FBCFE8",
      "--primary-text": "#831843",
      "--background-text": "#9D174D",
      "--graph-0": "#DB2777",
      "--graph-1": "#2563EB",
      "--graph-2": "#15803D",
      "--graph-3": "#CA8A04",
      "--graph-4": "#7E22CE",
      "--graph-5": "#0D9488",
      "--graph-6": "#EA580C",
      "--graph-7": "#1E3A8A",
      "--graph-8": "#DC2626",
      "--graph-9": "#0891B2",
    },
  },
];

// ---------------------------------------------------------------------------
// New theme seed definitions — [id, displayName, category, primary, bg, cardTint, strokeTint]
// ---------------------------------------------------------------------------

const NEW_THEME_SEEDS = [
  // ── Classic (4 new) ──────────────────────────────────────────────────────
  ["slate",        "Slate",        "Classic",  "#475569", "#F8FAFC", 0.06, 0.14],
  ["charcoal",     "Charcoal",     "Classic",  "#94A3B8", "#1E293B", 0.08, 0.16],
  ["ivory",        "Ivory",        "Classic",  "#78716C", "#FAFAF9", 0.05, 0.10],
  ["silver",       "Silver",       "Classic",  "#64748B", "#F1F5F9", 0.06, 0.13],

  // ── Warm (10) ─────────────────────────────────────────────────────────────
  ["amber",        "Amber",        "Warm",     "#D97706", "#FFFBF0", 0.06, 0.13],
  ["terracotta",   "Terracotta",   "Warm",     "#C2410C", "#FFF5EE", 0.06, 0.12],
  ["peach",        "Peach",        "Warm",     "#FB923C", "#FFF7ED", 0.05, 0.10],
  ["saffron",      "Saffron",      "Warm",     "#B45309", "#FFFBEB", 0.06, 0.12],
  ["copper",       "Copper",       "Warm",     "#B45309", "#2A1810", 0.07, 0.15],
  ["coral",        "Coral",        "Warm",     "#F05252", "#FFF5F5", 0.05, 0.11],
  ["cinnamon",     "Cinnamon",     "Warm",     "#A16207", "#FEFCE8", 0.06, 0.12],
  ["rust",         "Rust",         "Warm",     "#C2410C", "#1F0F08", 0.07, 0.15],
  ["burnt_orange", "Burnt Orange", "Warm",     "#EA580C", "#FFF5F0", 0.05, 0.11],
  ["golden",       "Golden",       "Warm",     "#CA8A04", "#FFFBEB", 0.06, 0.13],

  // ── Cool (10) ─────────────────────────────────────────────────────────────
  ["ocean",        "Ocean",        "Cool",     "#0369A1", "#F0F9FF", 0.06, 0.13],
  ["arctic",       "Arctic",       "Cool",     "#38BDF8", "#F0FEFF", 0.05, 0.10],
  ["glacier",      "Glacier",      "Cool",     "#0EA5E9", "#0A1929", 0.07, 0.14],
  ["midnight",     "Midnight",     "Cool",     "#4F46E5", "#0B0C2A", 0.08, 0.16],
  ["sapphire",     "Sapphire",     "Cool",     "#1D4ED8", "#EFF6FF", 0.06, 0.13],
  ["teal",         "Teal",         "Cool",     "#0D9488", "#F0FDFA", 0.06, 0.12],
  ["frost",        "Frost",        "Cool",     "#38BDF8", "#0C1B33", 0.07, 0.14],
  ["steel_blue",   "Steel Blue",   "Cool",     "#0284C7", "#F0F8FF", 0.05, 0.11],
  ["periwinkle",   "Periwinkle",   "Cool",     "#818CF8", "#EEF2FF", 0.05, 0.10],
  ["ice",          "Ice",          "Cool",     "#22D3EE", "#F0FEFF", 0.05, 0.10],

  // ── Pastel (10) ───────────────────────────────────────────────────────────
  ["lavender",     "Lavender",     "Pastel",   "#8B5CF6", "#FAF5FF", 0.05, 0.09],
  ["mint",         "Mint",         "Pastel",   "#34D399", "#F0FDF4", 0.05, 0.09],
  ["blush",        "Blush",        "Pastel",   "#F472B6", "#FFF0F6", 0.05, 0.10],
  ["powder_blue",  "Powder Blue",  "Pastel",   "#60A5FA", "#EFF6FF", 0.05, 0.09],
  ["sage",         "Sage",         "Pastel",   "#6EE7B7", "#ECFDF5", 0.05, 0.09],
  ["lilac",        "Lilac",        "Pastel",   "#C084FC", "#FAF5FF", 0.05, 0.09],
  ["buttercream",  "Buttercream",  "Pastel",   "#FCD34D", "#FEFCE8", 0.05, 0.10],
  ["rose_quartz",  "Rose Quartz",  "Pastel",   "#FDA4AF", "#FFF1F2", 0.05, 0.09],
  ["seafoam",      "Seafoam",      "Pastel",   "#5EEAD4", "#F0FDFA", 0.05, 0.09],
  ["wisteria",     "Wisteria",     "Pastel",   "#A78BFA", "#F5F3FF", 0.05, 0.09],

  // ── Bold (10) ─────────────────────────────────────────────────────────────
  ["electric",     "Electric",     "Bold",     "#2563EB", "#0D1B4B", 0.08, 0.16],
  ["crimson",      "Crimson",      "Bold",     "#DC143C", "#1A0000", 0.08, 0.16],
  ["emerald",      "Emerald",      "Bold",     "#059669", "#022C22", 0.07, 0.15],
  ["violet",       "Violet",       "Bold",     "#7C3AED", "#150B35", 0.08, 0.16],
  ["cobalt",       "Cobalt",       "Bold",     "#1E40AF", "#0A1240", 0.08, 0.16],
  ["magenta",      "Magenta",      "Bold",     "#C026D3", "#200020", 0.08, 0.16],
  ["tangerine",    "Tangerine",    "Bold",     "#EA580C", "#1A0800", 0.07, 0.15],
  ["cherry",       "Cherry",       "Bold",     "#BE123C", "#2D0A14", 0.07, 0.15],
  ["jade",         "Jade",         "Bold",     "#16A34A", "#0A2012", 0.07, 0.15],
  ["indigo",       "Indigo",       "Bold",     "#4338CA", "#12103A", 0.08, 0.16],

  // ── Earth (10) ────────────────────────────────────────────────────────────
  ["forest",       "Forest",       "Earth",    "#15803D", "#F0FDF4", 0.06, 0.12],
  ["desert",       "Desert",       "Earth",    "#B45309", "#FEFCE8", 0.06, 0.12],
  ["moss",         "Moss",         "Earth",    "#4D7C0F", "#FAFFF0", 0.06, 0.11],
  ["clay",         "Clay",         "Earth",    "#9A3412", "#FFF5F0", 0.06, 0.12],
  ["walnut",       "Walnut",       "Earth",    "#78350F", "#1C1007", 0.07, 0.14],
  ["sand",         "Sand",         "Earth",    "#92400E", "#FEFDF5", 0.05, 0.10],
  ["olive",        "Olive",        "Earth",    "#65A30D", "#F7FAEA", 0.05, 0.11],
  ["sienna",       "Sienna",       "Earth",    "#C2410C", "#FFF3EE", 0.06, 0.12],
  ["pebble",       "Pebble",       "Earth",    "#78716C", "#FAFAF9", 0.05, 0.10],
  ["driftwood",    "Driftwood",    "Earth",    "#92400E", "#1C140A", 0.07, 0.14],

  // ── Neon (10) ─────────────────────────────────────────────────────────────
  ["cyber",        "Cyber",        "Neon",     "#00FF94", "#05080F", 0.06, 0.14],
  ["plasma",       "Plasma",       "Neon",     "#FF00FF", "#0A000A", 0.06, 0.14],
  ["synthwave",    "Synthwave",    "Neon",     "#F72585", "#0D0015", 0.07, 0.15],
  ["acid_green",   "Acid Green",   "Neon",     "#39FF14", "#050A00", 0.06, 0.14],
  ["aurora",       "Aurora",       "Neon",     "#00FFCC", "#000D0A", 0.06, 0.14],
  ["matrix",       "Matrix",       "Neon",     "#00FF41", "#0D1200", 0.07, 0.15],
  ["laser",        "Laser",        "Neon",     "#FF0080", "#0F000A", 0.06, 0.14],
  ["fluorescent",  "Fluorescent",  "Neon",     "#FFFF00", "#0A0A00", 0.06, 0.14],
  ["retrowave",    "Retrowave",    "Neon",     "#FF6AC1", "#0F0028", 0.07, 0.15],
  ["voltage",      "Voltage",      "Neon",     "#FFD700", "#0A0800", 0.07, 0.15],

  // ── Monochrome (10) ───────────────────────────────────────────────────────
  ["pure_white",   "Pure White",   "Monochrome", "#374151", "#FFFFFF", 0.05, 0.10],
  ["near_black",   "Near Black",   "Monochrome", "#9CA3AF", "#111827", 0.08, 0.16],
  ["warm_gray",    "Warm Gray",    "Monochrome", "#6B7280", "#FAFAFA", 0.05, 0.10],
  ["cool_gray",    "Cool Gray",    "Monochrome", "#6B7280", "#F3F4F6", 0.05, 0.10],
  ["graphite",     "Graphite",     "Monochrome", "#9CA3AF", "#1F2937", 0.08, 0.16],
  ["onyx",         "Onyx",         "Monochrome", "#D1D5DB", "#030712", 0.08, 0.16],
  ["ash",          "Ash",          "Monochrome", "#6B7280", "#374151", 0.08, 0.16],
  ["platinum",     "Platinum",     "Monochrome", "#4B5563", "#F9FAFB", 0.05, 0.10],
  ["smoke",        "Smoke",        "Monochrome", "#9CA3AF", "#F3F4F6", 0.05, 0.10],
  ["fog",          "Fog",          "Monochrome", "#6B7280", "#F9FAFB", 0.04, 0.09],

  // ── Nature (10) ───────────────────────────────────────────────────────────
  ["meadow",       "Meadow",       "Nature",   "#16A34A", "#F0FDF4", 0.06, 0.12],
  ["sunset",       "Sunset",       "Nature",   "#EA580C", "#FFF5F0", 0.06, 0.12],
  ["autumn",       "Autumn",       "Nature",   "#B45309", "#FFFBEB", 0.06, 0.12],
  ["bloom",        "Bloom",        "Nature",   "#EC4899", "#FFF0F6", 0.05, 0.10],
  ["winter",       "Winter",       "Nature",   "#3B82F6", "#EFF6FF", 0.05, 0.11],
  ["storm",        "Storm",        "Nature",   "#475569", "#0F172A", 0.07, 0.14],
  ["dawn",         "Dawn",         "Nature",   "#F59E0B", "#FFFDF0", 0.05, 0.11],
  ["dusk",         "Dusk",         "Nature",   "#6D28D9", "#13052A", 0.07, 0.14],
  ["spring",       "Spring",       "Nature",   "#84CC16", "#F7FEE7", 0.05, 0.10],
  ["harvest",      "Harvest",      "Nature",   "#D97706", "#1C0F00", 0.07, 0.14],

  // ── Professional (10) ─────────────────────────────────────────────────────
  ["corporate_blue",  "Corporate Blue",  "Professional",  "#1D4ED8", "#F8FAFF", 0.06, 0.13],
  ["executive",       "Executive",       "Professional",  "#1E293B", "#FAFAFA", 0.05, 0.10],
  ["finance",         "Finance",         "Professional",  "#166534", "#F0FFF4", 0.06, 0.12],
  ["medical",         "Medical",         "Professional",  "#0284C7", "#F0FAFF", 0.06, 0.12],
  ["tech",            "Tech",            "Professional",  "#6366F1", "#0E0E2A", 0.07, 0.14],
  ["academic",        "Academic",        "Professional",  "#7C3AED", "#FAF8FF", 0.05, 0.11],
  ["legal",           "Legal",           "Professional",  "#1E3A8A", "#F8FBFF", 0.06, 0.12],
  ["consulting",      "Consulting",      "Professional",  "#0F766E", "#F0FDFA", 0.06, 0.12],
  ["government",      "Government",      "Professional",  "#1D4ED8", "#F5F7FF", 0.05, 0.11],
  ["startup",         "Startup",         "Professional",  "#7C3AED", "#F5F3FF", 0.05, 0.11],
];

// ---------------------------------------------------------------------------
// Build ALL_THEMES array
// ---------------------------------------------------------------------------

const ALL_THEMES = [
  ...EXISTING_THEMES,
  ...NEW_THEME_SEEDS.map(([id, displayName, category, primary, bg, cardTint, strokeTint]) => ({
    id,
    displayName,
    category,
    colors: deriveThemeColors(primary, bg, cardTint, strokeTint),
  })),
];

// Validate we have exactly 100
if (ALL_THEMES.length !== 100) {
  console.error(`ERROR: Expected 100 themes, got ${ALL_THEMES.length}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Build TypeScript output
// ---------------------------------------------------------------------------

function themeToTs(theme) {
  const c = theme.colors;
  return `  {
    id: "${theme.id}",
    displayName: "${theme.displayName}",
    category: "${theme.category}",
    colors: {
      "--primary-color": "${c["--primary-color"]}",
      "--background-color": "${c["--background-color"]}",
      "--card-color": "${c["--card-color"]}",
      "--stroke": "${c["--stroke"]}",
      "--primary-text": "${c["--primary-text"]}",
      "--background-text": "${c["--background-text"]}",
      "--graph-0": "${c["--graph-0"]}",
      "--graph-1": "${c["--graph-1"]}",
      "--graph-2": "${c["--graph-2"]}",
      "--graph-3": "${c["--graph-3"]}",
      "--graph-4": "${c["--graph-4"]}",
      "--graph-5": "${c["--graph-5"]}",
      "--graph-6": "${c["--graph-6"]}",
      "--graph-7": "${c["--graph-7"]}",
      "--graph-8": "${c["--graph-8"]}",
      "--graph-9": "${c["--graph-9"]}",
    },
  }`;
}

const categories = [
  "Classic",
  "Warm",
  "Cool",
  "Pastel",
  "Bold",
  "Earth",
  "Neon",
  "Monochrome",
  "Nature",
  "Professional",
];

const themesByCategory = categories.map((cat) => {
  const themes = ALL_THEMES.filter((t) => t.category === cat);
  return `  ${cat}: ALL_THEMES.filter((t) => t.category === "${cat}"),`;
});

const tsContent = `// AUTO-GENERATED by scripts/generate-themes.js — DO NOT EDIT MANUALLY
// Re-generate by running: node servers/nextjs/scripts/generate-themes.js

export interface ThemeColors {
  "--primary-color": string;
  "--background-color": string;
  "--card-color": string;
  "--stroke": string;
  "--primary-text": string;
  "--background-text": string;
  "--graph-0": string;
  "--graph-1": string;
  "--graph-2": string;
  "--graph-3": string;
  "--graph-4": string;
  "--graph-5": string;
  "--graph-6": string;
  "--graph-7": string;
  "--graph-8": string;
  "--graph-9": string;
}

export type ThemeCategory =
  | "Classic"
  | "Warm"
  | "Cool"
  | "Pastel"
  | "Bold"
  | "Earth"
  | "Neon"
  | "Monochrome"
  | "Nature"
  | "Professional";

export interface ThemeDefinition {
  id: string;
  displayName: string;
  category: ThemeCategory;
  colors: ThemeColors;
}

export const THEME_CATEGORIES: ThemeCategory[] = [
  "Classic",
  "Warm",
  "Cool",
  "Pastel",
  "Bold",
  "Earth",
  "Neon",
  "Monochrome",
  "Nature",
  "Professional",
];

export const ALL_THEMES: ThemeDefinition[] = [
${ALL_THEMES.map(themeToTs).join(",\n")}
];

export const THEMES_BY_CATEGORY: Record<ThemeCategory, ThemeDefinition[]> = {
${themesByCategory.join("\n")}
};
`;

// ---------------------------------------------------------------------------
// Write the output file
// ---------------------------------------------------------------------------

const outputPath = path.resolve(
  __dirname,
  "../app/(presentation-generator)/theme/theme-data.ts"
);

fs.writeFileSync(outputPath, tsContent, "utf8");

console.log(`\nGenerated ${ALL_THEMES.length} themes successfully.`);
console.log(`Output: ${outputPath}`);
console.log("\nThemes per category:");
for (const cat of categories) {
  const count = ALL_THEMES.filter((t) => t.category === cat).length;
  console.log(`  ${cat.padEnd(16)}: ${count}`);
}

// Validate all themes have 16 color keys
const requiredKeys = [
  "--primary-color",
  "--background-color",
  "--card-color",
  "--stroke",
  "--primary-text",
  "--background-text",
  "--graph-0",
  "--graph-1",
  "--graph-2",
  "--graph-3",
  "--graph-4",
  "--graph-5",
  "--graph-6",
  "--graph-7",
  "--graph-8",
  "--graph-9",
];

let valid = true;
for (const theme of ALL_THEMES) {
  for (const key of requiredKeys) {
    if (!theme.colors[key]) {
      console.error(`ERROR: Theme "${theme.id}" is missing key "${key}"`);
      valid = false;
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(theme.colors[key])) {
      console.error(
        `ERROR: Theme "${theme.id}" key "${key}" has invalid value: ${theme.colors[key]}`
      );
      valid = false;
    }
  }
}

if (valid) {
  console.log("\nAll theme color values validated successfully.");
} else {
  process.exit(1);
}
