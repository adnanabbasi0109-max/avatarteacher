"""Bloom's Taxonomy integration for pedagogical reasoning."""

from enum import IntEnum


class BloomLevel(IntEnum):
    REMEMBER = 1
    UNDERSTAND = 2
    APPLY = 3
    ANALYZE = 4
    EVALUATE = 5
    CREATE = 6


BLOOM_QUESTION_STEMS = {
    BloomLevel.REMEMBER: [
        "Can you recall...",
        "What is the definition of...",
        "List the...",
        "Who/What/When/Where...",
    ],
    BloomLevel.UNDERSTAND: [
        "Can you explain in your own words...",
        "What is the main idea of...",
        "How would you summarize...",
        "Why does...",
    ],
    BloomLevel.APPLY: [
        "How would you use this to solve...",
        "Can you demonstrate...",
        "What would happen if...",
        "How is this related to...",
    ],
    BloomLevel.ANALYZE: [
        "What are the parts of...",
        "How does this compare to...",
        "What is the relationship between...",
        "What evidence supports...",
    ],
    BloomLevel.EVALUATE: [
        "Do you agree that... Why?",
        "What is the most important...",
        "How would you prioritize...",
        "What criteria would you use to judge...",
    ],
    BloomLevel.CREATE: [
        "How would you design...",
        "What would you propose...",
        "Can you formulate a plan for...",
        "How could you improve...",
    ],
}


BLOOM_VERBS = {
    BloomLevel.REMEMBER: ["define", "list", "recall", "identify", "name", "state"],
    BloomLevel.UNDERSTAND: ["explain", "describe", "summarize", "interpret", "classify"],
    BloomLevel.APPLY: ["apply", "demonstrate", "solve", "use", "implement"],
    BloomLevel.ANALYZE: ["analyze", "compare", "contrast", "examine", "differentiate"],
    BloomLevel.EVALUATE: ["evaluate", "judge", "justify", "argue", "assess"],
    BloomLevel.CREATE: ["create", "design", "propose", "construct", "develop"],
}


def get_target_level(current_score: float, current_level: BloomLevel) -> BloomLevel:
    """Determine the next Bloom's level to target based on student performance."""
    if current_score >= 0.8 and current_level < BloomLevel.CREATE:
        return BloomLevel(current_level + 1)
    elif current_score < 0.4 and current_level > BloomLevel.REMEMBER:
        return BloomLevel(current_level - 1)
    return current_level


def get_question_stems(level: BloomLevel) -> list[str]:
    """Get question stems for a given Bloom's level."""
    return BLOOM_QUESTION_STEMS.get(level, BLOOM_QUESTION_STEMS[BloomLevel.UNDERSTAND])
