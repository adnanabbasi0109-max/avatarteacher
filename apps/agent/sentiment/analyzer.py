"""Voice and text sentiment analysis."""


class SentimentAnalyzer:
    """Analyzes student sentiment from text and voice features."""

    SENTIMENT_KEYWORDS = {
        "confused": [
            "i don't understand", "what do you mean", "i'm lost", "confused",
            "huh", "wait what", "can you repeat", "i don't get it",
        ],
        "frustrated": [
            "this is hard", "i can't", "i give up", "this doesn't make sense",
            "ugh", "i hate", "too difficult", "impossible",
        ],
        "excited": [
            "oh i see", "that's cool", "awesome", "i love", "amazing",
            "that makes sense", "aha", "eureka", "i got it",
        ],
        "bored": [
            "whatever", "okay", "sure", "i guess", "mhm",
            "can we move on", "this is boring",
        ],
    }

    async def analyze(self, text: str) -> str:
        """Analyze text for sentiment indicators."""
        text_lower = text.lower().strip()

        for sentiment, keywords in self.SENTIMENT_KEYWORDS.items():
            for keyword in keywords:
                if keyword in text_lower:
                    return sentiment

        if len(text_lower.split()) < 3:
            return "disengaged"

        return "neutral"
