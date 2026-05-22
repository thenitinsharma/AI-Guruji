from agents.doubt_agent import DOUBT_SOLVER_SYSTEM
from utils.groq_client import groq_client


class AISupervisor:
    async def route_request(self, user_input: str) -> str:
        prompt = (
            f"Student ka sawal hai: '{user_input}'. "
            "Iska saral Hindi mein vistaar se, step-by-step jawab dein."
        )
        return groq_client.generate_response(
            prompt,
            system_instruction=DOUBT_SOLVER_SYSTEM,
        )


supervisor = AISupervisor()
