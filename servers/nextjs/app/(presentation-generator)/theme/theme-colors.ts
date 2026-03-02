import { ThemeType } from "../upload/type";
import { ALL_THEMES, ThemeColors } from "./theme-data";

// Re-export ThemeColors so existing imports from this file still work
export type { ThemeColors } from "./theme-data";

// Build display name map from ALL_THEMES + Custom entry
export const THEME_DISPLAY_NAMES: Record<string, string> = Object.fromEntries([
  ...ALL_THEMES.map((t) => [t.id, t.displayName]),
  [ThemeType.Custom, "Custom"],
]);

// Build color map from ALL_THEMES (excludes Custom which has no colors)
export const THEME_COLOR_MAP: Record<string, ThemeColors> = Object.fromEntries(
  ALL_THEMES.map((t) => [t.id, t.colors])
);

const CSS_VAR_KEYS = Object.keys(
  THEME_COLOR_MAP[ThemeType.Light]
) as (keyof ThemeColors)[];

/**
 * Applies theme CSS variables to the presentation wrapper element.
 */
export function applyTheme(theme: ThemeType | null): void {
  const element = document.getElementById("presentation-slides-wrapper");
  if (!element) return;

  // Clear existing theme vars first
  for (const key of CSS_VAR_KEYS) {
    element.style.removeProperty(key);
  }

  if (!theme || theme === ThemeType.Custom) return;

  const colors = THEME_COLOR_MAP[theme];
  if (!colors) return;

  for (const key of CSS_VAR_KEYS) {
    element.style.setProperty(key, colors[key]);
  }
}

/**
 * Clears theme CSS variables from the presentation wrapper element.
 */
export function clearThemeVars(): void {
  const element = document.getElementById("presentation-slides-wrapper");
  if (!element) return;
  for (const key of CSS_VAR_KEYS) {
    element.style.removeProperty(key);
  }
}
