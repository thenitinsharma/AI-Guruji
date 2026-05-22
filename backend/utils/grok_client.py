import os
from litellm import completion
from dotenv import load_dotenv

load_dotenv()

class GrokClient:
    def __init__(self):
        self.api_key = os.getenv("XAI_API_KEY")
        if not self.api_key:
            # Fallback check if user hasn't updated .env yet
            print("Warning: XAI_API_KEY not found in environment variables")
        self.model = "xai/grok-beta"

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
            print(f"Error calling Grok API: {e}")
            return f"Maaf kijiye, Grok API error aa gaya hai: {str(e)}"

# Singleton instance
grok_client = GrokClient()
