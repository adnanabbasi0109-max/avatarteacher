"""Assessment and quiz generation utilities."""

from typing import Optional
from .bloom import BloomLevel, BLOOM_VERBS


class AssessmentGenerator:
    """Generates assessments aligned with learning objectives."""

    def generate_formative_prompt(
        self,
        topic: str,
        bloom_level: BloomLevel,
        context: Optional[str] = None,
    ) -> str:
        """Generate a formative assessment prompt for the avatar to use."""
        verbs = BLOOM_VERBS.get(bloom_level, BLOOM_VERBS[BloomLevel.UNDERSTAND])
        verb = verbs[0]

        prompts = {
            BloomLevel.REMEMBER: f"Can you {verb} the key points about {topic}?",
            BloomLevel.UNDERSTAND: f"Can you {verb} {topic} in your own words?",
            BloomLevel.APPLY: f"Can you {verb} what you know about {topic} to solve a problem?",
            BloomLevel.ANALYZE: f"Can you {verb} the different aspects of {topic}?",
            BloomLevel.EVALUATE: f"Can you {verb} the significance of {topic}?",
            BloomLevel.CREATE: f"Can you {verb} something new based on your understanding of {topic}?",
        }

        return prompts.get(bloom_level, prompts[BloomLevel.UNDERSTAND])

    def evaluate_response_depth(self, response: str) -> BloomLevel:
        """Estimate the Bloom's level demonstrated in a student's response."""
        response_lower = response.lower()
        word_count = len(response.split())

        if word_count < 5:
            return BloomLevel.REMEMBER

        create_indicators = ["i would design", "my proposal", "i could build", "new approach"]
        if any(ind in response_lower for ind in create_indicators):
            return BloomLevel.CREATE

        eval_indicators = ["i think because", "the best", "i agree", "i disagree", "however"]
        if any(ind in response_lower for ind in eval_indicators):
            return BloomLevel.EVALUATE

        analysis_indicators = ["compared to", "the difference", "because", "the reason", "relationship"]
        if any(ind in response_lower for ind in analysis_indicators):
            return BloomLevel.ANALYZE

        apply_indicators = ["for example", "if we", "we can use", "this means"]
        if any(ind in response_lower for ind in apply_indicators):
            return BloomLevel.APPLY

        if word_count > 15:
            return BloomLevel.UNDERSTAND

        return BloomLevel.REMEMBER
