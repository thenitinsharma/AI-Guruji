from agents.doubt_agent import DOUBT_SOLVER_SYSTEM
from agents.step_solver_agent import STEP_SOLVER_SYSTEM
from agents.gap_agent import GAP_DETECTOR_SYSTEM
from agents.story_agent import STORY_AGENT_SYSTEM
from agents.parent_agent import PARENT_AGENT_SYSTEM
from agents.motivator_agent import MOTIVATOR_SYSTEM
from utils.groq_client import groq_client

# Map agent IDs to system prompts
AGENT_SYSTEMS = {
    "doubt":      DOUBT_SOLVER_SYSTEM,
    "stepsolve":  STEP_SOLVER_SYSTEM,
    "gap":        GAP_DETECTOR_SYSTEM,
    "story":      STORY_AGENT_SYSTEM,
    "parent":     PARENT_AGENT_SYSTEM,
    "motivation": MOTIVATOR_SYSTEM,
}

# Mode instruction appended to system prompt
MODE_INSTRUCTIONS = {
    "hindi":    "HAMESHA pure Devanagari Hindi mein jawab do. Simple, clear Hindi.",
    "hinglish": "Hinglish mein baat karo — Hindi + English mix, jaise dost se baat.",
    "simple":   "Bahut simple language — Class 6-8 level. Short sentences, basic words only.",
    "exam":     "Exam-focused answers: definitions, formulas, important points numbered. Board exam pattern.",
    "math":     "Maths problems ke liye DETAILED step-by-step solution do. Formulas highlight karo.",
}


class AISupervisor:
    async def route_request(
        self,
        user_input: str,
        agent: str = "doubt",
        mode: str = "hindi",
    ) -> str:
        system = AGENT_SYSTEMS.get(agent, DOUBT_SOLVER_SYSTEM)
        mode_note = MODE_INSTRUCTIONS.get(mode, MODE_INSTRUCTIONS["hindi"])
        full_system = f"{system}\n\nLANGUAGE MODE: {mode_note}"

        prompt = (
            f"Student ka sawal hai: '{user_input}'. "
            "Iska jawab upar diye gaye format aur language mein dein."
        )
        return groq_client.generate_response(
            prompt,
            system_instruction=full_system,
        )


supervisor = AISupervisor()
