"""Response adaptation based on detected sentiment."""


class ResponseAdapter:
    """Adapts the avatar's response strategy based on student sentiment."""

    ADAPTATION_STRATEGIES = {
        "confused": {
            "tone": "patient and clear",
            "approach": "simplify and use analogies",
            "pace": "slower",
            "actions": ["break down the concept", "use a simpler example", "check prerequisites"],
        },
        "frustrated": {
            "tone": "encouraging and supportive",
            "approach": "acknowledge difficulty, break into small steps",
            "pace": "slower",
            "actions": ["validate their effort", "simplify the problem", "offer a hint"],
        },
        "excited": {
            "tone": "enthusiastic and challenging",
            "approach": "push to higher Bloom's levels",
            "pace": "maintain or increase",
            "actions": ["ask a harder question", "introduce a new angle", "praise their insight"],
        },
        "bored": {
            "tone": "engaging and dynamic",
            "approach": "make it interactive and relevant",
            "pace": "faster",
            "actions": ["ask a thought-provoking question", "relate to real world", "try a different approach"],
        },
        "disengaged": {
            "tone": "warm and inviting",
            "approach": "re-engage with a question or activity",
            "pace": "moderate",
            "actions": ["ask an open question", "check in on how they're feeling", "change the activity"],
        },
        "neutral": {
            "tone": "friendly and professional",
            "approach": "continue current strategy",
            "pace": "moderate",
            "actions": ["continue teaching", "periodically check understanding"],
        },
    }

    def get_strategy(self, sentiment: str) -> dict:
        """Get the adaptation strategy for a given sentiment."""
        return self.ADAPTATION_STRATEGIES.get(
            sentiment, self.ADAPTATION_STRATEGIES["neutral"]
        )

    def build_adaptation_prompt(self, sentiment: str) -> str:
        """Build a prompt fragment to inject into the LLM context."""
        strategy = self.get_strategy(sentiment)
        return (
            f"[ADAPTATION] Student appears {sentiment}. "
            f"Use a {strategy['tone']} tone. "
            f"Strategy: {strategy['approach']}. "
            f"Pace: {strategy['pace']}."
        )
