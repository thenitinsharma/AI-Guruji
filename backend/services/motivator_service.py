from agents.motivator_agent import MOTIVATOR_SYSTEM
from utils.groq_client import groq_client


async def generate_motivation(
    streak: int = 0,
    quiz_percent: int | None = None,
    mood: str = "neutral",
    context: str = "",
) -> str:
    score_line = ""
    if quiz_percent is not None:
        score_line = f"Abhi quiz mein score: {quiz_percent}%. "

    prompt = (
        f"Student data: streak {streak} din. Mood: {mood}. {score_line}"
        f"{f'Extra context: {context}' if context else ''} "
        "Inspire karein — 150 words se kam, HTML format mein."
    )
    return groq_client.generate_response(prompt, system_instruction=MOTIVATOR_SYSTEM)
