#!/usr/bin/env python3
"""
Download and normalize popular open-source icon packs for integration
into the Presenton icon system.

Supported sets:
  - Lucide     (~1,500 icons, MIT)
  - Heroicons  (~300 icons, 3 styles: outline / solid / mini, MIT)
  - Material Symbols (~2,500 outlined icons, Apache 2.0)

Usage
-----
  python download_icon_sets.py                        # download all sets
  python download_icon_sets.py --sets lucide heroicons
  python download_icon_sets.py --force                # overwrite existing
  python download_icon_sets.py --output-dir /custom/path

Output
------
  <output_dir>/lucide/{name}.svg
  <output_dir>/heroicons-outline/{name}.svg
  <output_dir>/heroicons-solid/{name}.svg
  <output_dir>/heroicons-mini/{name}.svg
  <output_dir>/material/{name}.svg

  servers/fastapi/assets/external_icons_meta.json
"""

from __future__ import annotations

import argparse
import io
import json
import os
import re
import sys
import zipfile
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
import xml.etree.ElementTree as ET

# ---------------------------------------------------------------------------
# Repository configuration
# ---------------------------------------------------------------------------

# Each entry: (org, repo, branch)
REPO_INFO: Dict[str, Tuple[str, str, str]] = {
    "lucide":   ("lucide-icons", "lucide",                  "main"),
    "heroicons": ("tailwindlabs", "heroicons",               "master"),
    "material": ("google",        "material-design-icons",   "master"),
}

# Archive URL template
ARCHIVE_URL = "https://github.com/{org}/{repo}/archive/refs/heads/{branch}.zip"

# Set metadata (id must not collide with Phosphor = 1)
SET_META = {
    "lucide":    {"label": "Lucide Icons",      "id": 2},
    "heroicons": {"label": "Heroicons",          "id": 3},
    "material":  {"label": "Material Symbols",  "id": 4},
}

# Mapping: set_key -> list of (zip_path_prefix, output_subdir, style_label)
# zip_path_prefix is the path *inside* the extracted archive root folder.
SET_PATHS = {
    "lucide": [
        ("icons/",     "lucide",             "outline"),
    ],
    "heroicons": [
        ("src/24/outline/", "heroicons-outline", "outline"),
        ("src/24/solid/",   "heroicons-solid",   "solid"),
        ("src/20/solid/",   "heroicons-mini",    "mini"),
    ],
    "material": [
        # Only download the "outlined" variant for brevity.
        # Files live at: symbols/web/<icon_name>/materialsymbolsoutlined/<icon>_wght400.svg
        # We detect these in code rather than a simple prefix match.
        ("symbols/web/",    "material",          "outlined"),
    ],
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
FASTAPI_DIR = SCRIPT_DIR.parent
DEFAULT_OUTPUT_DIR = FASTAPI_DIR / "static" / "icons"
META_OUTPUT_PATH   = FASTAPI_DIR / "assets" / "external_icons_meta.json"

# Common synonym expansions used to enrich tags
SYNONYM_MAP: Dict[str, List[str]] = {
    "arrow":   ["direction", "pointer", "navigate"],
    "chevron": ["arrow", "direction", "expand"],
    "check":   ["tick", "done", "complete", "confirm"],
    "close":   ["x", "dismiss", "remove", "cancel"],
    "search":  ["find", "magnify", "look"],
    "home":    ["house", "main", "start"],
    "user":    ["person", "account", "profile"],
    "users":   ["people", "group", "team", "accounts"],
    "lock":    ["secure", "closed", "privacy"],
    "unlock":  ["open", "unsecure"],
    "eye":     ["view", "visible", "show", "watch"],
    "camera":  ["photo", "picture", "snapshot"],
    "image":   ["photo", "picture", "gallery"],
    "video":   ["film", "movie", "camera", "media"],
    "music":   ["audio", "sound", "song", "melody"],
    "bell":    ["notification", "alert", "alarm"],
    "star":    ["favourite", "favorite", "rating", "bookmark"],
    "heart":   ["love", "like", "favourite", "favorite"],
    "trash":   ["delete", "remove", "bin"],
    "edit":    ["pencil", "modify", "write", "update"],
    "pen":     ["write", "edit", "draw"],
    "pencil":  ["write", "edit", "draw"],
    "settings":["gear", "options", "configure", "preferences"],
    "gear":    ["settings", "cog", "options", "configure"],
    "cog":     ["settings", "gear", "options", "configure"],
    "folder":  ["directory", "files"],
    "file":    ["document", "page"],
    "calendar":["date", "schedule", "event"],
    "clock":   ["time", "watch", "timer"],
    "map":     ["location", "navigation", "geography"],
    "pin":     ["location", "marker", "place"],
    "phone":   ["call", "mobile", "contact", "telephone"],
    "email":   ["mail", "message", "envelope"],
    "mail":    ["email", "message", "envelope"],
    "chat":    ["message", "conversation", "comment"],
    "comment": ["chat", "message", "reply"],
    "globe":   ["world", "earth", "internet", "web"],
    "wifi":    ["wireless", "internet", "network", "connection"],
    "cloud":   ["storage", "upload", "server"],
    "download":["save", "export", "get"],
    "upload":  ["send", "export", "share"],
    "share":   ["export", "send", "social"],
    "link":    ["url", "chain", "connect"],
    "tag":     ["label", "category", "badge"],
    "badge":   ["label", "tag", "award"],
    "flag":    ["report", "country", "marker"],
    "filter":  ["sort", "refine", "search"],
    "sort":    ["filter", "order", "arrange"],
    "grid":    ["layout", "columns", "table"],
    "list":    ["items", "rows", "bullet"],
    "table":   ["grid", "data", "rows"],
    "chart":   ["graph", "data", "analytics", "statistics"],
    "graph":   ["chart", "data", "analytics"],
    "bar":     ["chart", "graph", "statistics"],
    "plus":    ["add", "create", "new", "insert"],
    "add":     ["plus", "create", "new", "insert"],
    "minus":   ["subtract", "remove", "decrease"],
    "info":    ["information", "help", "about"],
    "help":    ["question", "support", "info"],
    "warning": ["alert", "caution", "danger"],
    "alert":   ["warning", "notification", "danger"],
    "error":   ["warning", "danger", "fail"],
    "sun":     ["light", "day", "brightness", "weather"],
    "moon":    ["night", "dark", "sleep", "weather"],
    "car":     ["vehicle", "auto", "automobile", "drive"],
    "truck":   ["vehicle", "delivery", "transport"],
    "plane":   ["airplane", "flight", "travel"],
    "train":   ["rail", "transit", "transport"],
    "bus":     ["transit", "transport", "vehicle"],
    "shop":    ["store", "cart", "ecommerce", "buy"],
    "cart":    ["shop", "basket", "ecommerce", "buy"],
    "wallet":  ["money", "payment", "finance"],
    "money":   ["cash", "payment", "finance", "currency"],
    "card":    ["payment", "credit", "finance"],
    "code":    ["programming", "developer", "syntax"],
    "terminal":["console", "cli", "developer"],
    "database":["storage", "server", "data"],
    "server":  ["database", "cloud", "backend"],
    "cpu":     ["chip", "processor", "hardware"],
    "tool":    ["wrench", "fix", "build", "utility"],
    "wrench":  ["tool", "fix", "repair", "settings"],
    "hammer":  ["tool", "build", "fix"],
    "book":    ["read", "library", "document", "education"],
    "library": ["books", "collection", "education"],
    "school":  ["education", "learn", "university"],
    "leaf":    ["nature", "eco", "plant", "environment"],
    "tree":    ["nature", "plant", "environment", "forest"],
    "fire":    ["flame", "hot", "trending", "delete"],
    "water":   ["drop", "liquid", "nature"],
    "bolt":    ["lightning", "electricity", "fast", "flash"],
    "flash":   ["bolt", "lightning", "fast"],
    "power":   ["energy", "on", "off", "electricity"],
    "print":   ["printer", "output", "document"],
    "mic":     ["microphone", "audio", "record", "voice"],
    "speaker": ["audio", "sound", "volume"],
    "volume":  ["audio", "sound", "speaker"],
    "play":    ["media", "start", "video", "audio"],
    "pause":   ["media", "stop", "wait"],
    "stop":    ["media", "pause", "end"],
    "skip":    ["media", "next", "forward"],
    "refresh": ["reload", "update", "sync", "repeat"],
    "rotate":  ["spin", "turn", "transform"],
    "zoom":    ["magnify", "scale", "resize"],
    "crop":    ["trim", "resize", "edit"],
    "copy":    ["duplicate", "clone", "paste"],
    "paste":   ["insert", "copy", "clip"],
    "cut":     ["scissors", "remove", "trim"],
    "undo":    ["revert", "back", "reset"],
    "redo":    ["forward", "repeat"],
    "save":    ["disk", "store", "floppy"],
    "print":   ["printer", "paper", "output"],
    "send":    ["submit", "mail", "share"],
    "reply":   ["respond", "answer", "chat"],
}


def _synonyms_for_word(word: str) -> List[str]:
    """Return synonym list for a single word (empty list if no synonyms)."""
    return SYNONYM_MAP.get(word.lower(), [])


def _tags_from_name(name: str) -> str:
    """
    Derive a space-separated tags string from an icon filename stem.

    Strategy:
      1. Split on hyphens/underscores.
      2. Keep all unique tokens.
      3. For each token that has synonyms, append them (deduped).
    """
    tokens = re.split(r"[-_]", name.lower())
    tokens = [t for t in tokens if t]  # remove empties
    seen: List[str] = []
    seen_set: set = set()

    def _add(word: str) -> None:
        if word and word not in seen_set:
            seen.append(word)
            seen_set.add(word)

    for token in tokens:
        _add(token)

    # Add synonyms for each base token
    for token in tokens:
        for syn in _synonyms_for_word(token):
            _add(syn)

    return " ".join(seen)


def _normalize_svg(svg_bytes: bytes, fill_value: str = "currentColor") -> str:
    """
    Parse an SVG, ensure the root <svg> element has fill="currentColor",
    and return the serialized XML string.

    Falls back to regex-based injection if XML parsing fails.
    """
    try:
        # Strip XML declaration / BOM to make parsing easier
        text = svg_bytes.decode("utf-8", errors="replace").strip()
        text = re.sub(r"^<\?xml[^?]*\?>", "", text).strip()

        root = ET.fromstring(text)

        # Ensure namespace is in place for serialization
        # ElementTree may strip or mangle xmlns – handle carefully
        ns = {"svg": "http://www.w3.org/2000/svg"}
        tag = root.tag

        # The root tag might be '{http://www.w3.org/2000/svg}svg' or plain 'svg'
        if tag in ("svg", "{http://www.w3.org/2000/svg}svg"):
            if root.get("fill") is None:
                root.set("fill", fill_value)
            elif root.get("fill") == "none":
                # Some icon sets set fill="none" at root and manage child fills
                # individually – leave it unchanged to avoid breaking stroked icons.
                pass

        # Re-register namespace so output doesn't use 'ns0:' prefix
        ET.register_namespace("", "http://www.w3.org/2000/svg")
        ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")

        result = ET.tostring(root, encoding="unicode", xml_declaration=False)
        return result

    except ET.ParseError:
        # Fallback: raw regex injection if the SVG isn't valid XML
        text = svg_bytes.decode("utf-8", errors="replace")
        if 'fill=' not in text[:200]:
            text = text.replace("<svg ", f'<svg fill="{fill_value}" ', 1)
        return text


def _download_zip(url: str, desc: str) -> Optional[bytes]:
    """Download a zip archive from *url* and return its raw bytes."""
    print(f"  Downloading {desc}...")
    print(f"    URL: {url}")
    try:
        req = Request(url, headers={"User-Agent": "presenton-icon-downloader/1.0"})
        with urlopen(req, timeout=120) as resp:
            total = resp.headers.get("Content-Length")
            total_mb = f"{int(total) / 1_048_576:.1f} MB" if total else "unknown size"
            print(f"    Size: {total_mb}")
            data = resp.read()
        print(f"    Downloaded {len(data) / 1_048_576:.1f} MB OK")
        return data
    except HTTPError as exc:
        print(f"  ERROR: HTTP {exc.code} - {exc.reason} for {url}", file=sys.stderr)
        return None
    except URLError as exc:
        print(f"  ERROR: {exc.reason}", file=sys.stderr)
        return None


def _stem(filename: str) -> str:
    """Return filename without extension."""
    return Path(filename).stem


# ---------------------------------------------------------------------------
# Per-set extraction logic
# ---------------------------------------------------------------------------

def _extract_lucide(
    zf: zipfile.ZipFile,
    archive_root: str,
    output_dir: Path,
    force: bool,
) -> List[Dict]:
    """
    Extract Lucide icons.
    Archive path: <root>/icons/<name>.svg
    """
    prefix = f"{archive_root}/icons/"
    icons_meta: List[Dict] = []
    saved = skipped = errors = 0

    for member in zf.infolist():
        if not member.filename.startswith(prefix):
            continue
        if not member.filename.lower().endswith(".svg"):
            continue
        # Skip directory entries
        if member.filename.endswith("/"):
            continue

        relative = member.filename[len(prefix):]
        # Skip nested directories (there shouldn't be any, but guard anyway)
        if "/" in relative:
            continue

        stem = _stem(relative)
        dest = output_dir / f"{stem}.svg"

        if dest.exists() and not force:
            skipped += 1
            icons_meta.append({
                "name": f"lucide-{stem}",
                "style": "outline",
                "tags": _tags_from_name(stem),
                "set_id": SET_META["lucide"]["id"],
            })
            continue

        try:
            raw = zf.read(member.filename)
            normalized = _normalize_svg(raw)
            dest.write_text(normalized, encoding="utf-8")
            saved += 1
            icons_meta.append({
                "name": f"lucide-{stem}",
                "style": "outline",
                "tags": _tags_from_name(stem),
                "set_id": SET_META["lucide"]["id"],
            })
        except Exception as exc:  # pylint: disable=broad-except
            print(f"    WARN: could not process {member.filename}: {exc}", file=sys.stderr)
            errors += 1

    print(f"    lucide: {saved} saved, {skipped} skipped, {errors} errors")
    return icons_meta


def _extract_heroicons(
    zf: zipfile.ZipFile,
    archive_root: str,
    output_dirs: Dict[str, Path],  # style_label -> Path
    force: bool,
) -> List[Dict]:
    """
    Extract Heroicons for all three styles.
    Archive paths:
      <root>/src/24/outline/<name>.svg  -> heroicons-outline
      <root>/src/24/solid/<name>.svg    -> heroicons-solid
      <root>/src/20/solid/<name>.svg    -> heroicons-mini
    """
    style_config = [
        (f"{archive_root}/src/24/outline/", "heroicons-outline", "outline"),
        (f"{archive_root}/src/24/solid/",   "heroicons-solid",   "solid"),
        (f"{archive_root}/src/20/solid/",   "heroicons-mini",    "mini"),
    ]
    icons_meta: List[Dict] = []
    totals = {"saved": 0, "skipped": 0, "errors": 0}

    for prefix, dir_key, style_label in style_config:
        out_dir = output_dirs[dir_key]
        saved = skipped = errors = 0

        for member in zf.infolist():
            if not member.filename.startswith(prefix):
                continue
            if not member.filename.lower().endswith(".svg"):
                continue
            if member.filename.endswith("/"):
                continue
            relative = member.filename[len(prefix):]
            if "/" in relative:
                continue

            stem = _stem(relative)
            dest = out_dir / f"{stem}.svg"

            if dest.exists() and not force:
                skipped += 1
                icons_meta.append({
                    "name": f"heroicons-{stem}",
                    "style": style_label,
                    "tags": _tags_from_name(stem),
                    "set_id": SET_META["heroicons"]["id"],
                })
                continue

            try:
                raw = zf.read(member.filename)
                normalized = _normalize_svg(raw)
                dest.write_text(normalized, encoding="utf-8")
                saved += 1
                icons_meta.append({
                    "name": f"heroicons-{stem}",
                    "style": style_label,
                    "tags": _tags_from_name(stem),
                    "set_id": SET_META["heroicons"]["id"],
                })
            except Exception as exc:  # pylint: disable=broad-except
                print(f"    WARN: {member.filename}: {exc}", file=sys.stderr)
                errors += 1

        print(f"    heroicons/{style_label}: {saved} saved, {skipped} skipped, {errors} errors")
        totals["saved"]   += saved
        totals["skipped"] += skipped
        totals["errors"]  += errors

    return icons_meta


def _extract_material(
    zf: zipfile.ZipFile,
    archive_root: str,
    output_dir: Path,
    force: bool,
) -> List[Dict]:
    """
    Extract Material Symbols (outlined variant only).

    Archive structure:
      <root>/symbols/web/<icon_name>/materialsymbolsoutlined/<icon>_24px.svg

    We pick the default-weight 24px variant: {name}_24px.svg (no _wght/_grad/_fill suffix).
    Output filename: <icon_name>.svg  (the top-level folder name)
    """
    base_prefix = f"{archive_root}/symbols/web/"
    icons_meta: List[Dict] = []
    saved = skipped = errors = 0

    # Build a dict: icon_name -> member path  (pick default-weight 24px outlined)
    # This avoids re-scanning the full list for each icon.
    icon_members: Dict[str, str] = {}

    for member in zf.infolist():
        if not member.filename.startswith(base_prefix):
            continue
        if not member.filename.lower().endswith(".svg"):
            continue
        if member.filename.endswith("/"):
            continue

        # Expected: base_prefix + <icon_name>/materialsymbolsoutlined/<file>.svg
        rest = member.filename[len(base_prefix):]
        parts = rest.split("/")
        if len(parts) != 3:
            continue

        icon_name, variant_folder, svg_file = parts
        if variant_folder.lower() != "materialsymbolsoutlined":
            continue
        # Pick the default-weight 24px variant: {name}_24px.svg
        # (no _wght, _grad, or _fill suffix — just the base icon)
        if not svg_file.lower().endswith("_24px.svg"):
            continue
        # Exclude files with weight/gradient/fill modifiers
        base_part = svg_file.lower().replace("_24px.svg", "")
        if "_wght" in base_part or "_grad" in base_part or "_fill" in base_part or "fill1" in base_part:
            continue

        icon_members[icon_name] = member.filename

    for icon_name, member_path in sorted(icon_members.items()):
        # Normalize name: material uses underscores, convert to hyphens
        stem = icon_name.replace("_", "-").lower()
        dest = output_dir / f"{stem}.svg"

        if dest.exists() and not force:
            skipped += 1
            icons_meta.append({
                "name": f"material-{stem}",
                "style": "outlined",
                "tags": _tags_from_name(stem),
                "set_id": SET_META["material"]["id"],
            })
            continue

        try:
            raw = zf.read(member_path)
            normalized = _normalize_svg(raw)
            dest.write_text(normalized, encoding="utf-8")
            saved += 1
            icons_meta.append({
                "name": f"material-{stem}",
                "style": "outlined",
                "tags": _tags_from_name(stem),
                "set_id": SET_META["material"]["id"],
            })
        except Exception as exc:  # pylint: disable=broad-except
            print(f"    WARN: {member_path}: {exc}", file=sys.stderr)
            errors += 1

    print(f"    material/outlined: {saved} saved, {skipped} skipped, {errors} errors")
    return icons_meta


# ---------------------------------------------------------------------------
# Output directory helpers
# ---------------------------------------------------------------------------

def _output_dirs_for_set(set_key: str, base: Path) -> Dict[str, Path]:
    """
    Return a mapping of dir_key -> absolute Path for a given set.
    Creates the directories if they do not exist.
    """
    mapping: Dict[str, Path] = {}
    for _, dir_key, _ in SET_PATHS[set_key]:
        p = base / dir_key
        p.mkdir(parents=True, exist_ok=True)
        mapping[dir_key] = p
    return mapping


# ---------------------------------------------------------------------------
# Main download + extract orchestration per set
# ---------------------------------------------------------------------------

def process_lucide(base_output: Path, force: bool) -> List[Dict]:
    org, repo, branch = REPO_INFO["lucide"]
    url = ARCHIVE_URL.format(org=org, repo=repo, branch=branch)
    archive_root = f"{repo}-{branch}"

    print("\n[Lucide Icons]")
    data = _download_zip(url, "Lucide Icons")
    if data is None:
        return []

    dirs = _output_dirs_for_set("lucide", base_output)
    with zipfile.ZipFile(io.BytesIO(data)) as zf:
        return _extract_lucide(zf, archive_root, dirs["lucide"], force)


def process_heroicons(base_output: Path, force: bool) -> List[Dict]:
    org, repo, branch = REPO_INFO["heroicons"]
    url = ARCHIVE_URL.format(org=org, repo=repo, branch=branch)
    archive_root = f"{repo}-{branch}"

    print("\n[Heroicons]")
    data = _download_zip(url, "Heroicons")
    if data is None:
        return []

    dirs = _output_dirs_for_set("heroicons", base_output)
    return _extract_heroicons(zf=zipfile.ZipFile(io.BytesIO(data)),
                               archive_root=archive_root,
                               output_dirs=dirs,
                               force=force)


def process_material(base_output: Path, force: bool) -> List[Dict]:
    org, repo, branch = REPO_INFO["material"]
    url = ARCHIVE_URL.format(org=org, repo=repo, branch=branch)
    archive_root = f"{repo}-{branch}"

    print("\n[Material Symbols]")
    print("  NOTE: The material-design-icons repo is large (~300 MB). "
          "This may take a while.")
    data = _download_zip(url, "Material Symbols")
    if data is None:
        return []

    dirs = _output_dirs_for_set("material", base_output)
    with zipfile.ZipFile(io.BytesIO(data)) as zf:
        return _extract_material(zf, archive_root, dirs["material"], force)


PROCESSORS = {
    "lucide":    process_lucide,
    "heroicons": process_heroicons,
    "material":  process_material,
}


# ---------------------------------------------------------------------------
# Metadata writer
# ---------------------------------------------------------------------------

def write_metadata(all_icons: List[Dict], active_sets: List[str]) -> None:
    """Write external_icons_meta.json next to icons.json."""
    sets_meta = [SET_META[s] for s in active_sets if s in SET_META]
    meta = {"sets": sets_meta, "icons": all_icons}

    META_OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    # If file already exists, merge with existing data for sets we are NOT
    # regenerating so that partial runs remain consistent.
    if META_OUTPUT_PATH.exists():
        try:
            existing = json.loads(META_OUTPUT_PATH.read_text(encoding="utf-8"))
            kept_sets = [s for s in existing.get("sets", [])
                         if s["id"] not in {m["id"] for m in sets_meta}]
            kept_icons = [i for i in existing.get("icons", [])
                          if i.get("set_id") not in {m["id"] for m in sets_meta}]
            meta["sets"]  = kept_sets + sets_meta
            meta["icons"] = kept_icons + all_icons
        except (json.JSONDecodeError, KeyError):
            pass  # overwrite if corrupted

    META_OUTPUT_PATH.write_text(
        json.dumps(meta, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"\nMetadata written -> {META_OUTPUT_PATH}")
    print(f"  Sets:  {len(meta['sets'])}")
    print(f"  Icons: {len(meta['icons'])}")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Download and normalize open-source icon packs.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--sets",
        nargs="+",
        choices=["lucide", "heroicons", "material"],
        default=["lucide", "heroicons", "material"],
        metavar="SET",
        help=(
            "Which icon sets to download. "
            "Choices: lucide heroicons material. "
            "Default: all three."
        ),
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing SVG files (default: skip if already present).",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        metavar="DIR",
        help=(
            f"Base directory to store downloaded SVGs. "
            f"Default: {DEFAULT_OUTPUT_DIR}"
        ),
    )
    return parser.parse_args()


def main() -> None:
    args = _parse_args()
    base_output: Path = args.output_dir.resolve()
    active_sets: List[str] = args.sets
    force: bool = args.force

    print("=" * 60)
    print("Presenton Icon Set Downloader")
    print("=" * 60)
    print(f"Sets to download : {', '.join(active_sets)}")
    print(f"Output directory : {base_output}")
    print(f"Force overwrite  : {force}")
    print("=" * 60)

    base_output.mkdir(parents=True, exist_ok=True)

    all_icons: List[Dict] = []

    for set_key in active_sets:
        processor = PROCESSORS[set_key]
        icons = processor(base_output, force)
        all_icons.extend(icons)

    write_metadata(all_icons, active_sets)

    print("\n" + "=" * 60)
    print("Done.")
    total_by_set: Dict[str, int] = {}
    for icon in all_icons:
        sid = icon["set_id"]
        label = next(
            (SET_META[k]["label"] for k in SET_META if SET_META[k]["id"] == sid),
            str(sid),
        )
        total_by_set[label] = total_by_set.get(label, 0) + 1
    for label, count in total_by_set.items():
        print(f"  {label}: {count} icons")
    print(f"  Total: {len(all_icons)} icons across {len(total_by_set)} set(s)")
    print("=" * 60)


if __name__ == "__main__":
    main()
