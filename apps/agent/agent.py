"""
EduAvatar LiveKit Agent
Real-time voice AI pipeline: User Audio -> VAD -> STT -> Pedagogical LLM -> TTS -> Avatar
"""

import os
import json
import logging
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()

from livekit.agents import (
    Agent, AgentSession, JobContext, RunContext,
    function_tool, cli, llm
)
from livekit.plugins import silero, deepgram, cartesia, openai

from pedagogy.engine import PedagogicalEngine
from pedagogy.prompts import build_system_prompt
from rag.retriever import CurriculumRetriever
from sentiment.analyzer import SentimentAnalyzer

logger = logging.getLogger("eduavatar-agent")
logger.setLevel(logging.INFO)

pedagogy_engine = PedagogicalEngine()
curriculum_retriever = CurriculumRetriever()
sentiment_analyzer = SentimentAnalyzer()


class EduAvatarAgent(Agent):
    """Educational avatar agent with pedagogical reasoning."""

    def __init__(self, session_config: dict):
        self.session_config = session_config
        self.persona = session_config.get("persona", {})
        self.student = session_config.get("student", {})
        self.course = session_config.get("course", {})
        self.conversation_history: list[dict] = []
        self.current_objective = None
        self.session_start = datetime.utcnow()

        system_prompt = build_system_prompt(
            persona=self.persona,
            student=self.student,
            course=self.course,
            teaching_style=self.persona.get("teachingStyle", "ADAPTIVE"),
        )

        super().__init__(instructions=system_prompt)

    async def on_enter(self):
        """Called when agent enters the session."""
        greeting = self.persona.get(
            "greeting",
            f"Hello {self.student.get('name', 'there')}! "
            f"I'm {self.persona.get('name', 'your tutor')}. "
            f"What would you like to learn about today?"
        )
        self.session.say(greeting)

    async def on_user_turn(self, turn):
        """Process each user turn with pedagogical context."""
        user_text = turn.text

        sentiment = await sentiment_analyzer.analyze(user_text)

        context_chunks = await curriculum_retriever.retrieve(
            query=user_text,
            course_id=self.course.get("id"),
            top_k=5,
        )

        self.conversation_history.append({
            "role": "student",
            "content": user_text,
            "sentiment": sentiment,
            "timestamp": datetime.utcnow().isoformat(),
        })

        context_message = self._build_context_message(context_chunks, sentiment)
        return context_message

    def _build_context_message(self, context_chunks, sentiment):
        """Build a context injection message for the LLM."""
        parts = []

        if context_chunks:
            parts.append("RELEVANT CURRICULUM CONTEXT:")
            for chunk in context_chunks:
                parts.append(f"- [{chunk.get('type', 'text')}] {chunk.get('content', '')}")

        if sentiment and sentiment != "neutral":
            parts.append(f"\nSTUDENT SENTIMENT: {sentiment}")
            if sentiment == "confused":
                parts.append("INSTRUCTION: Simplify your explanation. Use an analogy or example.")
            elif sentiment == "frustrated":
                parts.append("INSTRUCTION: Be encouraging. Break the problem into smaller steps.")
            elif sentiment == "bored":
                parts.append("INSTRUCTION: Make it more engaging. Ask a thought-provoking question.")

        if self.current_objective:
            parts.append(f"\nCURRENT LEARNING OBJECTIVE: {self.current_objective}")

        return "\n".join(parts) if parts else None


@function_tool
async def generate_quiz(
    context: RunContext,
    topic: str,
    difficulty: str = "medium",
    num_questions: int = 3,
):
    """Generate a quick quiz to assess the student's understanding of a topic.

    Args:
        topic: The topic to quiz on
        difficulty: easy, medium, or hard
        num_questions: Number of questions (1-5)
    """
    quiz = await pedagogy_engine.generate_quiz(
        topic=topic,
        difficulty=difficulty,
        num_questions=num_questions,
        course_context=context.agent.course,
    )
    return json.dumps(quiz)


@function_tool
async def check_understanding(
    context: RunContext,
    concept: str,
    student_explanation: str,
):
    """Evaluate if the student correctly understands a concept.

    Args:
        concept: The concept being assessed
        student_explanation: What the student said about the concept
    """
    assessment = await pedagogy_engine.evaluate_understanding(
        concept=concept,
        student_explanation=student_explanation,
        bloom_level=context.agent.current_objective,
    )
    return json.dumps(assessment)


@function_tool
async def show_visual(
    context: RunContext,
    visual_type: str,
    description: str,
):
    """Display a visual aid to the student.

    Args:
        visual_type: Type of visual - diagram, chart, formula, image
        description: Description of what to display
    """
    await context.room.local_participant.perform_rpc(
        destination_identity="student",
        method="display_visual",
        payload=json.dumps({"type": visual_type, "description": description}),
    )
    return "Visual displayed to student"


@function_tool
async def update_progress(
    context: RunContext,
    objective_id: str,
    status: str,
    score: float = None,
):
    """Update the student's learning progress for an objective.

    Args:
        objective_id: The learning objective ID
        status: NOT_STARTED, IN_PROGRESS, MASTERED, NEEDS_REVIEW
        score: Optional score 0-100
    """
    return json.dumps({
        "action": "update_progress",
        "objective_id": objective_id,
        "status": status,
        "score": score,
        "student_id": context.agent.student.get("id"),
    })


@function_tool
async def lookup_curriculum(
    context: RunContext,
    query: str,
):
    """Search the course curriculum for relevant content.

    Args:
        query: What to look up in the curriculum
    """
    chunks = await curriculum_retriever.retrieve(
        query=query,
        course_id=context.agent.course.get("id"),
        top_k=3,
    )
    return json.dumps([{
        "content": c.get("content", ""),
        "type": c.get("type", "text"),
        "source": c.get("source_file", ""),
    } for c in chunks])


async def entrypoint(ctx: JobContext):
    """Main entrypoint when a student starts a session."""
    await ctx.connect()

    room_metadata = json.loads(ctx.room.metadata or "{}")
    session_config = room_metadata.get("session_config", {})

    agent = EduAvatarAgent(session_config=session_config)

    session = AgentSession(
        vad=silero.VAD.load(),
        stt=deepgram.STT(
            model="nova-3",
            language=session_config.get("language", "en"),
        ),
        llm=openai.LLM(
            model="claude-sonnet-4-20250514",
            base_url=os.getenv("ANTHROPIC_BASE_URL", "https://api.anthropic.com/v1"),
            api_key=os.getenv("ANTHROPIC_API_KEY"),
        ),
        tts=cartesia.TTS(
            model="sonic-2",
            voice=session_config.get("persona", {}).get("voiceId", "default"),
        ),
        tools=[generate_quiz, check_understanding, show_visual,
               update_progress, lookup_curriculum],
    )

    await session.start(room=ctx.room, agent=agent)

    logger.info(f"Session started for student {session_config.get('student', {}).get('id')}")


if __name__ == "__main__":
    cli.run_app(entrypoint)
