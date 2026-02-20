"""Embedding generation for curriculum content."""

import os
from typing import Optional
import httpx


class EmbeddingGenerator:
    """Generates embeddings for text content."""

    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = "text-embedding-3-small"

    async def generate(self, text: str) -> Optional[list[float]]:
        """Generate an embedding vector for the given text."""
        if not self.api_key:
            return None

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.openai.com/v1/embeddings",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={"input": text, "model": self.model},
                )
                response.raise_for_status()
                data = response.json()
                return data["data"][0]["embedding"]
        except Exception as e:
            print(f"Embedding generation error: {e}")
            return None

    async def generate_batch(self, texts: list[str]) -> list[Optional[list[float]]]:
        """Generate embeddings for multiple texts."""
        results = []
        for text in texts:
            embedding = await self.generate(text)
            results.append(embedding)
        return results
