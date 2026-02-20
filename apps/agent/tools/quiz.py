"""Quiz generation tool for the avatar agent."""

import random
from pedagogy.bloom import BloomLevel, BLOOM_QUESTION_STEMS


class QuizGenerator:
    """Generates contextual quizzes aligned with Bloom's Taxonomy."""

    def generate_question(
        self,
        topic: str,
        bloom_level: BloomLevel = BloomLevel.UNDERSTAND,
    ) -> dict:
        """Generate a single quiz question."""
        stems = BLOOM_QUESTION_STEMS.get(bloom_level, BLOOM_QUESTION_STEMS[BloomLevel.UNDERSTAND])
        stem = random.choice(stems)

        return {
            "question": f"{stem} {topic}?",
            "bloom_level": bloom_level.name,
            "expected_depth": bloom_level.value,
            "topic": topic,
        }
