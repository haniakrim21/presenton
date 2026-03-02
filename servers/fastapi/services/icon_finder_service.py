import asyncio
import json
import os
import chromadb
from chromadb.config import Settings
from chromadb.utils.embedding_functions import ONNXMiniLM_L6_V2
from typing import List, Optional

# Increment this version string whenever the metadata schema changes.
# A mismatch triggers a full collection rebuild.
COLLECTION_VERSION = "v4"

SET_ID_TO_NAME = {
    1: "phosphor",
    2: "lucide",
    3: "heroicons",
    4: "material",
}

# Maps set_name to the directory segment used in the static URL path.
# For heroicons there are multiple sub-directories; the external_icons_meta.json
# is expected to carry explicit directory information so this is only a fallback.
SET_NAME_TO_DIRECTORY = {
    "lucide": "lucide",
    "heroicons": "heroicons-outline",
    "material": "material",
}

# Phosphor icon name suffixes that map to style directories.
_PHOSPHOR_STYLE_SUFFIXES = ("bold", "thin", "light", "fill", "duotone")

# Prefixes used by download_icon_sets.py when generating metadata names.
# SVG files on disk do NOT carry these prefixes, so we strip them for URL paths.
_EXTERNAL_SET_PREFIXES = ("lucide-", "heroicons-", "material-")


def _determine_phosphor_style(icon_name: str) -> str:
    """Return the style directory name for a Phosphor icon based on its name suffix."""
    for suffix in _PHOSPHOR_STYLE_SUFFIXES:
        if icon_name.endswith(f"-{suffix}"):
            return suffix
    return "regular"


class IconFinderService:
    def __init__(self):
        self.collection_name = "icons"
        self.client = chromadb.PersistentClient(
            path="chroma", settings=Settings(anonymized_telemetry=False)
        )
        print("Initializing icons collection...")
        self._initialize_icons_collection()
        print("Icons collection initialized.")

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _build_phosphor_documents(self, icons_data: dict):
        """Return (documents, ids, metadatas) for all Phosphor icons."""
        documents = []
        ids = []
        metadatas = []

        for each in icons_data["icons"]:
            name = each["name"]
            # Derive the actual style from the icon name suffix, NOT
            # from the ``style`` field in icons.json (which is always "outline").
            style = _determine_phosphor_style(name)
            set_id = each.get("set_id", 1)
            set_name = SET_ID_TO_NAME.get(set_id, "phosphor")
            url_path = f"/static/icons/{style}/{name}.svg"

            doc_text = f"{name} {each.get('tags', '')}"
            documents.append(doc_text)
            ids.append(f"{set_name}_{name}_{style}")
            metadatas.append(
                {
                    "style": style,
                    "set_id": set_id,
                    "set_name": set_name,
                    "url_path": url_path,
                }
            )

        return documents, ids, metadatas

    def _build_external_documents(self, external_path: str):
        """Return (documents, ids, metadatas) for external icon sets.

        The file is expected to be a JSON array where each element has at least:
            {
                "name": str,
                "tags": str,          # optional
                "style": str,         # optional, defaults to "outline"
                "set_id": int,        # 2=lucide, 3=heroicons, 4=material
                "directory": str      # optional subfolder override
            }
        """
        documents = []
        ids = []
        metadatas = []

        try:
            with open(external_path, "r") as f:
                external_icons = json.load(f)
        except (OSError, json.JSONDecodeError) as exc:
            print(f"Warning: could not load external icons from {external_path}: {exc}")
            return documents, ids, metadatas

        # Accept either a raw list or a dict with an "icons" key.
        if isinstance(external_icons, dict):
            external_icons = external_icons.get("icons", [])

        for each in external_icons:
            name = each.get("name", "")
            if not name:
                continue

            style = each.get("style", "outline")
            set_id = each.get("set_id", 0)
            set_name = SET_ID_TO_NAME.get(set_id, each.get("set_name", "unknown"))

            # Determine the directory segment for the URL path.
            directory = each.get("directory") or SET_NAME_TO_DIRECTORY.get(set_name, set_name)

            # Strip the set prefix from the name to get the actual filename on disk.
            # download_icon_sets.py saves files as e.g. "house.svg" but metadata
            # names them "lucide-house", "material-house", etc.
            filename = name
            for prefix in _EXTERNAL_SET_PREFIXES:
                if filename.startswith(prefix):
                    filename = filename[len(prefix):]
                    break
            url_path = f"/static/icons/{directory}/{filename}.svg"

            tags = each.get("tags", "")
            doc_text = f"{name} {tags}"
            documents.append(doc_text)
            ids.append(f"{set_name}_{name}_{style}")
            metadatas.append(
                {
                    "style": style,
                    "set_id": set_id,
                    "set_name": set_name,
                    "url_path": url_path,
                }
            )

        return documents, ids, metadatas

    # ------------------------------------------------------------------
    # Collection initialisation
    # ------------------------------------------------------------------

    def _initialize_icons_collection(self):
        self.embedding_function = ONNXMiniLM_L6_V2()
        self.embedding_function.DOWNLOAD_PATH = "chroma/models"
        self.embedding_function._download_model_if_not_exists()

        need_rebuild = False
        try:
            existing = self.client.get_collection(
                self.collection_name, embedding_function=self.embedding_function
            )
            # Check schema version stored as collection metadata.
            stored_version = (existing.metadata or {}).get("schema_version")
            if stored_version != COLLECTION_VERSION:
                print(
                    f"Collection schema version mismatch "
                    f"(stored={stored_version}, expected={COLLECTION_VERSION}). Rebuilding..."
                )
                self.client.delete_collection(self.collection_name)
                need_rebuild = True
            else:
                self.collection = existing
        except Exception:
            need_rebuild = True

        if not need_rebuild:
            return

        # --- Build documents from all sources ---
        all_documents: List[str] = []
        all_ids: List[str] = []
        all_metadatas: List[dict] = []

        # 1. Phosphor icons (always present)
        with open("assets/icons.json", "r") as f:
            icons_data = json.load(f)

        docs, ids, metas = self._build_phosphor_documents(icons_data)
        all_documents.extend(docs)
        all_ids.extend(ids)
        all_metadatas.extend(metas)
        print(f"Loaded {len(docs)} Phosphor icons.")

        # 2. External icon sets (optional)
        external_path = "assets/external_icons_meta.json"
        if os.path.exists(external_path):
            docs, ids, metas = self._build_external_documents(external_path)
            all_documents.extend(docs)
            all_ids.extend(ids)
            all_metadatas.extend(metas)
            print(f"Loaded {len(docs)} external icons from {external_path}.")
        else:
            print(f"No external icons file found at {external_path}; skipping.")

        if not all_documents:
            print("Warning: no icon documents to index.")
            return

        self.collection = self.client.create_collection(
            name=self.collection_name,
            embedding_function=self.embedding_function,
            metadata={
                "hnsw:space": "cosine",
                "schema_version": COLLECTION_VERSION,
            },
        )

        # ChromaDB has a practical limit per batch; add in chunks of 5000.
        BATCH_SIZE = 5000
        for start in range(0, len(all_documents), BATCH_SIZE):
            end = start + BATCH_SIZE
            self.collection.add(
                documents=all_documents[start:end],
                ids=all_ids[start:end],
                metadatas=all_metadatas[start:end],
            )
        print(f"Indexed {len(all_documents)} icons in total.")

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def search_icons(
        self,
        query: str,
        k: int = 1,
        style: Optional[str] = None,
        icon_set: Optional[str] = None,
    ) -> List[str]:
        """Search for icons matching *query*.

        Parameters
        ----------
        query:
            Natural-language description of the desired icon.
        k:
            Number of results to return.
        style:
            If provided, restrict results to icons with this style
            (e.g. "bold", "outline", "fill", "thin", "light", "duotone", "regular").
        icon_set:
            If provided, restrict results to icons from this set
            (e.g. "phosphor", "lucide", "heroicons", "material").

        Returns
        -------
        List of URL paths to SVG files, e.g. ``["/static/icons/outline/acorn.svg"]``.
        """
        where: Optional[dict] = None
        if style and icon_set:
            where = {"$and": [{"style": style}, {"set_name": icon_set}]}
        elif style:
            where = {"style": style}
        elif icon_set:
            where = {"set_name": icon_set}

        query_kwargs = dict(query_texts=[query], n_results=k)
        if where is not None:
            query_kwargs["where"] = where

        result = await asyncio.to_thread(self.collection.query, **query_kwargs)

        urls: List[str] = []
        ids = result["ids"][0]
        metadatas_list = result.get("metadatas", [[]])[0]

        for i, doc_id in enumerate(ids):
            meta = metadatas_list[i] if i < len(metadatas_list) else {}
            url_path = meta.get("url_path")
            if url_path:
                urls.append(url_path)
            else:
                # Fallback: reconstruct from id pattern "{set_name}_{name}_{style}"
                # For backward compatibility keep original bold path format.
                parts = doc_id.split("_")
                if len(parts) >= 3:
                    icon_style = parts[-1]
                    icon_name = "_".join(parts[1:-1])
                    urls.append(f"/static/icons/{icon_style}/{icon_name}.svg")
                else:
                    urls.append(f"/static/icons/bold/{doc_id}.svg")

        return urls


ICON_FINDER_SERVICE = IconFinderService()
