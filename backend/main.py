from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
import sys
from dotenv import load_dotenv

# Ensure the backend directory is in the path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our agents and supervisor
from agents.supervisor import supervisor
from utils.groq_client import groq_client

load_dotenv()

app = FastAPI(title="AI Guruji Backend")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    student_id: str = "guest_123"

class ChatResponse(BaseModel):
    response: str
    agent_id: str

@app.get("/")
async def root():
    return {"message": "AI Guruji Backend is running!"}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Call the supervisor to route and execute agent tasks
        result = await supervisor.route_request(request.message)
        return ChatResponse(response=str(result), agent_id="doubt_solver")
    except Exception as e:
        print(f"ERROR in chat_endpoint: {str(e)}") # Add logging
        import traceback
        traceback.print_exc() # Show full stack trace
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/quiz/generate")
async def generate_quiz(student_id: str, subject: str):
    # Placeholder for Quiz Agent
    prompt = f"Class 10 UP Board ke liye {subject} par 5 MCQs generate karein Hindi mein."
    response = groq_client.generate_response(prompt)
    return {"quiz": response}

@app.post("/quiz/submit")
async def submit_quiz(student_id: str, answers: dict):
    # Placeholder for Gap Detection Agent
    return {"status": "success", "analysis": "Aapka Trigonometry thoda kamzor hai."}

@app.get("/dashboard")
async def get_dashboard(student_id: str):
    # Placeholder for Dashboard data
    return {
        "stats": {
            "score": 85,
            "streak": 5,
            "weak_topics": ["Trigonometry", "Force and Laws of Motion"]
        }
    }

@app.get("/report")
async def get_report(student_id: str):
    # Placeholder for Parent Report Agent
    return {"report_url": "#", "summary": "Bacha acha padh raha hai."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
