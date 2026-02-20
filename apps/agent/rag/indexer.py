"""Document indexing pipeline for curriculum content."""

import os
from typing import Optional


class DocumentIndexer:
    """Indexes curriculum documents into the vector database."""

    def __init__(self):
        self.pinecone_api_key = os.getenv("PINECONE_API_KEY")

    async def index_document(
        self,
        content: str,
        metadata: dict,
        course_id: str,
        module_id: str,
    ) -> bool:
        """Index a document chunk into the vector database."""
        if not self.pinecone_api_key:
            print("Pinecone not configured. Skipping indexing.")
            return False

        try:
            # TODO: Implement when Pinecone is configured
            return True
        except Exception as e:
            print(f"Indexing error: {e}")
            return False

    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
        """Split text into overlapping chunks."""
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i : i + chunk_size])
            chunks.append(chunk)
        return chunks
