import asyncio
import json
import os
from fastembed_vectorstore import FastembedEmbeddingModel, FastembedVectorstore


class IconFinderService:
    def __init__(self):
        self.model = FastembedEmbeddingModel.AllMiniLML6V2
        # Use absolute path to ensure it works in packaged environments
        self.cache_directory = os.path.abspath("fastembed_cache")
        self.vectorstore = None
        self._initialized = False
        self._initialization_failed = False

    def _initialize_icons_collection(self):
        if self._initialized or self._initialization_failed:
            return
        
        # Mark as initialized immediately to prevent repeated attempts
        self._initialized = True
            
        print("Initializing icons collection...")
        
        # Ensure cache directory exists
        try:
            os.makedirs(self.cache_directory, exist_ok=True)
        except Exception as e:
            print(f"Warning: Could not create cache directory: {e}")
            self._initialization_failed = True
            return
            
        try:
            icons_vectorstore_path = os.path.abspath("assets/icons-vectorstore.json")
            icons_path = os.path.abspath("assets/icons.json")
            
            if os.path.exists(icons_vectorstore_path):
                print(f"Loading existing vectorstore from {icons_vectorstore_path}")
                self.vectorstore = FastembedVectorstore.load(
                    self.model, icons_vectorstore_path, cache_directory=self.cache_directory
                )
            elif os.path.exists(icons_path):
                print(f"Creating new vectorstore from {icons_path}")
                self.vectorstore = FastembedVectorstore(
                    self.model, cache_directory=self.cache_directory
                )
                with open(icons_path, "r") as f:
                    icons = json.load(f)

                documents = []

                for each in icons["icons"]:
                    if each["name"].split("-")[-1] == "bold":
                        doc_text = f"{each['name']}||{each['tags']}"
                        documents.append(doc_text)

                if documents:
                    success = self.vectorstore.embed_documents(documents)
                    if success:
                        print(f"Successfully embedded {len(documents)} icons")
                        self.vectorstore.save(icons_vectorstore_path)
                    else:
                        print(f"Failed to embed {len(documents)} icons")
                        self._initialization_failed = True
            else:
                print(f"Warning: Icons assets not found at {icons_path}")
                self._initialization_failed = True
            
            print("Icons collection initialized successfully.")
        except Exception as e:
            print(f"Warning: Could not initialize icon finder service: {e}")
            print(f"Error type: {type(e).__name__}")
            print("Icon search will be disabled.")
            self._initialization_failed = True
            # Keep vectorstore as None so search_icons returns empty results

    async def search_icons(self, query: str, k: int = 1):
        if not self._initialized and not self._initialization_failed:
            self._initialize_icons_collection()
        
        if not self.vectorstore or self._initialization_failed:
            # Return empty list if vectorstore failed to initialize
            return []
            
        try:
            result = await asyncio.to_thread(self.vectorstore.search, query, k)
            return [
                f"/static/icons/bold/{each[0].split('||')[0]}.svg"
                for each in result
            ]
        except Exception as e:
            print(f"Icon search error: {e}")
            return []


ICON_FINDER_SERVICE = IconFinderService()
