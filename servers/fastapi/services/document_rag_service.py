import asyncio
from copy import deepcopy
from typing import Any, List, Optional

import chromadb
from chromadb.config import Settings
from chromadb.utils.embedding_functions import ONNXMiniLM_L6_V2


class DocumentRAGService:
    """Per-presentation RAG service using ChromaDB for vector retrieval.

    Creates a session-scoped ChromaDB collection, chunks and embeds documents,
    then retrieves the most relevant chunks for outline and slide generation.
    """

    _client: Optional[chromadb.PersistentClient] = None
    _embedding_function: Optional[ONNXMiniLM_L6_V2] = None

    def __init__(self, session_id: str):
        self.session_id = session_id
        self.collection_name = f"rag_{session_id}"
        self._collection = None

    @classmethod
    def _get_client(cls) -> chromadb.PersistentClient:
        if cls._client is None:
            cls._client = chromadb.PersistentClient(
                path="chroma", settings=Settings(anonymized_telemetry=False)
            )
        return cls._client

    @classmethod
    def _get_embedding_function(cls) -> ONNXMiniLM_L6_V2:
        if cls._embedding_function is None:
            cls._embedding_function = ONNXMiniLM_L6_V2()
            cls._embedding_function.DOWNLOAD_PATH = "chroma/models"
            cls._embedding_function._download_model_if_not_exists()
        return cls._embedding_function

    async def ingest_documents(
        self, documents: List[str], file_names: Optional[List[str]] = None
    ) -> int:
        """Chunk documents, embed, and store in a session-scoped ChromaDB collection.

        Returns the number of chunks stored.
        """
        chunks = self._chunk_documents(documents, file_names)
        if not chunks:
            return 0

        client = self._get_client()
        ef = self._get_embedding_function()

        # Delete collection if it already exists (re-ingestion)
        try:
            await asyncio.to_thread(client.delete_collection, name=self.collection_name)
        except Exception:
            pass

        self._collection = await asyncio.to_thread(
            client.create_collection,
            name=self.collection_name,
            embedding_function=ef,
            metadata={"hnsw:space": "cosine"},
        )

        # Add chunks in batches
        batch_size = 500
        for i in range(0, len(chunks), batch_size):
            batch = chunks[i : i + batch_size]
            await asyncio.to_thread(
                self._collection.add,
                documents=[c["text"] for c in batch],
                ids=[c["id"] for c in batch],
                metadatas=[c["metadata"] for c in batch],
            )

        return len(chunks)

    def _chunk_documents(
        self, documents: List[str], file_names: Optional[List[str]] = None
    ) -> List[dict]:
        """Split documents into chunks using heading-aware + sliding window strategy."""
        all_chunks = []

        for doc_idx, doc_text in enumerate(documents):
            source = (
                file_names[doc_idx]
                if file_names and doc_idx < len(file_names)
                else f"document_{doc_idx}"
            )

            heading_chunks = self._chunk_by_headings(doc_text, source)
            if heading_chunks:
                all_chunks.extend(heading_chunks)
            else:
                all_chunks.extend(self._chunk_by_sliding_window(doc_text, source))

        return all_chunks

    def _chunk_by_headings(self, text: str, source: str) -> List[dict]:
        """Split markdown text by headings into semantic chunks."""
        lines = text.split("\n")
        chunks = []
        current_heading = ""
        current_content_lines: List[str] = []
        heading_count = 0

        for line in lines:
            stripped = line.strip()
            if stripped.startswith("#"):
                # Save previous chunk
                if current_content_lines or current_heading:
                    chunk_text = self._build_chunk_text(
                        current_heading, current_content_lines
                    )
                    if len(chunk_text) > 50:
                        chunks.append(
                            self._make_chunk(
                                f"{source}_{heading_count}",
                                chunk_text,
                                source,
                                current_heading,
                                "heading",
                            )
                        )

                current_heading = stripped
                current_content_lines = []
                heading_count += 1
            else:
                current_content_lines.append(line)

        # Final chunk
        if current_content_lines or current_heading:
            chunk_text = self._build_chunk_text(current_heading, current_content_lines)
            if len(chunk_text) > 50:
                chunks.append(
                    self._make_chunk(
                        f"{source}_{heading_count}",
                        chunk_text,
                        source,
                        current_heading,
                        "heading",
                    )
                )

        # Split oversized chunks
        final_chunks = []
        for chunk in chunks:
            if len(chunk["text"]) > 2000:
                final_chunks.extend(self._split_large_chunk(chunk))
            else:
                final_chunks.append(chunk)

        return final_chunks

    def _chunk_by_sliding_window(
        self, text: str, source: str, window_size: int = 1500, overlap: int = 200
    ) -> List[dict]:
        """Fallback chunking for documents without markdown headings."""
        chunks = []
        start = 0
        chunk_idx = 0

        while start < len(text):
            end = min(start + window_size, len(text))
            chunk_text = text[start:end].strip()

            if len(chunk_text) > 50:
                chunks.append(
                    self._make_chunk(
                        f"{source}_sw_{chunk_idx}",
                        chunk_text,
                        source,
                        "",
                        "sliding_window",
                    )
                )
                chunk_idx += 1

            start = end - overlap
            if start >= len(text):
                break

        return chunks

    def _split_large_chunk(self, chunk: dict) -> List[dict]:
        """Split a chunk that exceeds 2000 chars into sub-chunks with overlap."""
        text = chunk["text"]
        sub_chunks = []
        window_size = 1500
        overlap = 200
        start = 0
        sub_idx = 0

        while start < len(text):
            end = min(start + window_size, len(text))
            sub_text = text[start:end].strip()

            if len(sub_text) > 50:
                sub_chunks.append(
                    self._make_chunk(
                        f"{chunk['id']}_sub_{sub_idx}",
                        sub_text,
                        chunk["metadata"]["source"],
                        chunk["metadata"]["heading"],
                        "heading_split",
                    )
                )
                sub_idx += 1

            start = end - overlap
            if start >= len(text):
                break

        return sub_chunks

    @staticmethod
    def _build_chunk_text(heading: str, content_lines: List[str]) -> str:
        content = "\n".join(content_lines).strip()
        return f"{heading}\n{content}".strip() if heading else content

    @staticmethod
    def _make_chunk(
        chunk_id: str, text: str, source: str, heading: str, chunk_type: str
    ) -> dict:
        return {
            "id": chunk_id,
            "text": text,
            "metadata": {
                "source": source,
                "heading": heading,
                "chunk_type": chunk_type,
            },
        }

    async def query(self, query_text: str, n_results: int = 5) -> str:
        """Retrieve the most relevant chunks for a query.

        Returns a formatted context string with source attribution.
        """
        if self._collection is None:
            return ""

        count = await asyncio.to_thread(self._collection.count)
        if count == 0:
            return ""

        results = await asyncio.to_thread(
            self._collection.query,
            query_texts=[query_text],
            n_results=min(n_results, count),
        )

        if not results or not results["documents"] or not results["documents"][0]:
            return ""

        context_parts = []
        for doc, metadata in zip(results["documents"][0], results["metadatas"][0]):
            heading = metadata.get("heading", "")
            source = metadata.get("source", "")
            header = f"[From: {source}]" if source else ""
            if heading:
                header += f" {heading}"
            context_parts.append(f"{header}\n{doc}" if header else doc)

        return "\n\n---\n\n".join(context_parts)

    async def query_for_outline(self, topic: str, n_slides: int) -> str:
        """Retrieve broad context for outline generation."""
        n_results = min(max(n_slides * 2, 10), 20)
        return await self.query(topic, n_results=n_results)

    async def query_for_slide(self, slide_outline_content: str) -> str:
        """Retrieve focused context for a single slide's content generation."""
        return await self.query(slide_outline_content, n_results=5)

    async def cleanup(self):
        """Delete the session collection from ChromaDB."""
        try:
            client = self._get_client()
            await asyncio.to_thread(
                client.delete_collection, name=self.collection_name
            )
        except Exception:
            pass
        self._collection = None
