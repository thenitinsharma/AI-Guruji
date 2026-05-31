import json
from utils.groq_client import groq_client

FLASHCARD_SYSTEM = """You are a flashcard generator for UP Board Class 9-12 students.
Return ONLY a valid JSON array of flashcard objects. No markdown, no code fences, no explanation.
Format: [{"front": "question or term in Hindi/Hinglish", "back": "answer or definition in Hindi/Hinglish"}]
Generate exactly 10 flashcards. Mix: definitions, formulas, key facts, mnemonics."""

DEMO_FLASHCARDS = [
    {"front": "Pythagoras theorem kya hai?", "back": "a² + b² = c²\nRight triangle mein hypotenuse²= baki do bhujaon ke varg ka yog"},
    {"front": "sin(90°) = ?", "back": "1"},
    {"front": "cos(0°) = ?", "back": "1"},
    {"front": "tan θ = ?", "back": "sin θ / cos θ"},
    {"front": "sin(30°) = ?", "back": "1/2 = 0.5"},
    {"front": "cos(60°) = ?", "back": "1/2 = 0.5"},
    {"front": "sin(45°) = cos(45°) = ?", "back": "1/√2 ≈ 0.707"},
    {"front": "tan(45°) = ?", "back": "1"},
    {"front": "sin²θ + cos²θ = ?", "back": "1 — Pythagorean Identity"},
    {"front": "Hypotenuse kya hoti hai?", "back": "Right triangle ki sabse badi side — right angle ke saamne"},
]


async def generate_flashcards(topic: str, class_level: str = "10") -> list:
    prompt = (
        f"Create exactly 10 flashcards about \"{topic}\" for UP Board Class {class_level} students. "
        "Mix definitions, formulas, and key facts. Questions in Hindi/Hinglish, answers clear and concise. "
        "Return ONLY valid JSON array with 'front' and 'back' fields."
    )
    try:
        raw = groq_client.generate_response(prompt, system_instruction=FLASHCARD_SYSTEM)
        # Strip markdown fences if any
        clean = raw.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        clean = clean.strip()
        cards = json.loads(clean)
        if isinstance(cards, list) and len(cards) > 0:
            return cards
        return DEMO_FLASHCARDS
    except Exception as e:
        print(f"Flashcard generation error: {e}")
        return DEMO_FLASHCARDS
