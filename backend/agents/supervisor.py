from crewai import Task, Crew, Process
from agents.doubt_agent import doubt_solver_agent, llm
import os

class AISupervisor:
    def __init__(self):
        # We will add other agents here as we build them
        self.agents = {
            "doubt": doubt_solver_agent
        }

    async def route_request(self, user_input):
        # In a full flow, we might use an LLM pick the agent. 
        # For Phase 1, we focus on the Doubt Solver.
        
        doubt_task = Task(
            description=f"Student ka sawal hai: '{user_input}'. Iska saral Hindi mein vistaar se jawab dein.",
            expected_output="Step-by-step Hindi explanation with local UP analogies.",
            agent=doubt_solver_agent
        )

        crew = Crew(
            agents=[doubt_solver_agent],
            tasks=[doubt_task],
            process=Process.sequential
        )

        result = await crew.kickoff_async()
        return result

supervisor = AISupervisor()
