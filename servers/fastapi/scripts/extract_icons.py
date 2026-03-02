#!/usr/bin/env python3
"""
Extract icon SVG files from icons.json to per-style directories.

The icons.json file stores all Phosphor icon variants in a single JSON array.
Each icon's style is encoded in its name suffix:
  - acorn-bold    -> static/icons/bold/acorn-bold.svg
  - acorn-thin    -> static/icons/thin/acorn-thin.svg
  - acorn-light   -> static/icons/light/acorn-light.svg
  - acorn-fill    -> static/icons/fill/acorn-fill.svg
  - acorn-duotone -> static/icons/duotone/acorn-duotone.svg
  - acorn         -> static/icons/regular/acorn.svg

Usage:
    python servers/fastapi/scripts/extract_icons.py
    python servers/fastapi/scripts/extract_icons.py --force
"""

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path

STYLE_SUFFIXES = ("bold", "thin", "light", "fill", "duotone")

ICONS_JSON = (
    Path(__file__).resolve().parent.parent / "assets" / "icons.json"
)
ICONS_OUTPUT_DIR = (
    Path(__file__).resolve().parent.parent / "static" / "icons"
)


def determine_style(icon_name: str) -> str:
    """Return the style folder name for a given icon name."""
    for suffix in STYLE_SUFFIXES:
        if icon_name.endswith(f"-{suffix}"):
            return suffix
    return "regular"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Extract SVG icons from icons.json to per-style directories."
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing SVG files (default: skip files that already exist).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    if not ICONS_JSON.exists():
        print(f"ERROR: icons.json not found at {ICONS_JSON}", file=sys.stderr)
        sys.exit(1)

    print(f"Reading {ICONS_JSON} ...")
    with ICONS_JSON.open(encoding="utf-8") as fh:
        data = json.load(fh)

    icons = data.get("icons", [])
    if not icons:
        print("No icons found in icons.json.", file=sys.stderr)
        sys.exit(1)

    print(f"Found {len(icons)} icons total.")

    # Collect all unique style names so we can create all directories up front.
    style_names: set[str] = set()
    for icon in icons:
        style_names.add(determine_style(icon["name"]))

    # Create output directories.
    for style in sorted(style_names):
        style_dir = ICONS_OUTPUT_DIR / style
        style_dir.mkdir(parents=True, exist_ok=True)

    # Extract icons.
    counts: dict[str, int] = defaultdict(int)
    skipped: dict[str, int] = defaultdict(int)

    for icon in icons:
        name: str = icon["name"]
        content: str = icon.get("content", "")

        if not content:
            print(f"  WARNING: empty content for icon '{name}', skipping.")
            continue

        style = determine_style(name)
        dest = ICONS_OUTPUT_DIR / style / f"{name}.svg"

        if dest.exists() and not args.force:
            skipped[style] += 1
            continue

        dest.write_text(content, encoding="utf-8")
        counts[style] += 1

    # Summary.
    all_styles = sorted(style_names)
    print("\n--- Summary ---")
    print(f"{'Style':<12} {'Written':>8} {'Skipped':>8}")
    print("-" * 30)
    total_written = 0
    total_skipped = 0
    for style in all_styles:
        written = counts[style]
        skip = skipped[style]
        total_written += written
        total_skipped += skip
        print(f"{style:<12} {written:>8} {skip:>8}")
    print("-" * 30)
    print(f"{'TOTAL':<12} {total_written:>8} {total_skipped:>8}")

    if total_skipped > 0:
        print(
            f"\n{total_skipped} file(s) already existed and were skipped."
            " Use --force to overwrite them."
        )


if __name__ == "__main__":
    main()
