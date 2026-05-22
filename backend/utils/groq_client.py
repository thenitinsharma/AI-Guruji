import os
from litellm import completion
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env"))

class GroqClient:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            print("Warning: GROQ_API_KEY not found in environment variables")
        self.model = "groq/llama-3.3-70b-versatile"

    def generate_response(self, prompt: str, system_instruction: str = ""):
        try:
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            
            messages.append({"role": "user", "content": prompt})
            
            response = completion(
                model=self.model,
                messages=messages,
                api_key=self.api_key
            )
            
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling Groq API: {e}")
            return f"Maaf kijiye, Groq API error aa gaya hai: {str(e)}"

# Singleton instance
groq_client = GroqClient()
