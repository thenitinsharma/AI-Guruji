from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
import uvicorn
import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agents.supervisor import supervisor
from services.quiz_service import generate_quiz, analyze_quiz
from services.motivator_service import generate_motivation

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env"))

app = FastAPI(title="AI Guruji Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


class QuizGenerateRequest(BaseModel):
    subject: str
    topic: str = ""
    class_level: str = "10"
    student_id: str = "guest_123"


class QuizQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_index: int
    explanation: str


class QuizGenerateResponse(BaseModel):
    subject: str
    class_level: str
    questions: List[QuizQuestion]


class QuizSubmitRequest(BaseModel):
    student_id: str = "guest_123"
    subject: str
    questions: List[dict]
    answers: dict


class QuizSubmitResponse(BaseModel):
    correct: int
    total: int
    percent: int
    analysis: str
    wrong_topics: List[str]


class MotivateRequest(BaseModel):
    student_id: str = "guest_123"
    streak: int = 0
    quiz_percent: Optional[int] = None
    mood: str = "neutral"
    context: str = ""


class MotivateResponse(BaseModel):
    response: str
    agent_id: str = "motivator"


@app.get("/")
async def root():
    return {"message": "AI Guruji Backend is running!"}


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        result = await supervisor.route_request(request.message)
        return ChatResponse(response=str(result), agent_id="doubt_solver")
    except Exception as e:
        print(f"ERROR in chat_endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/quiz/generate", response_model=QuizGenerateResponse)
async def quiz_generate(request: QuizGenerateRequest):
    try:
        data = await generate_quiz(
            request.subject,
            request.topic,
            request.class_level,
        )
        return QuizGenerateResponse(**data)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        print(f"ERROR quiz_generate: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/quiz/submit", response_model=QuizSubmitResponse)
async def quiz_submit(request: QuizSubmitRequest):
    stats = analyze_quiz(request.questions, request.answers)
    weak = ", ".join(stats["wrong_topics"][:3]) or "koi khaas kamzori nahi"
    if stats["percent"] >= 80:
        analysis = f"Bahut badhiya! Aapne {stats['correct']}/{stats['total']} sahi kiye. Aise hi mehnat jaari rakhein!"
    elif stats["percent"] >= 50:
        analysis = f"Theek-thak! {stats['correct']}/{stats['total']} sahi. In topics par thoda aur dhyaan dein: {weak}"
    else:
        analysis = f"Chinta mat karein — {stats['correct']}/{stats['total']} sahi. Ye topics dubara padhein: {weak}. Practice se sudhar hoga!"
    return QuizSubmitResponse(
        correct=stats["correct"],
        total=stats["total"],
        percent=stats["percent"],
        analysis=analysis,
        wrong_topics=stats["wrong_topics"],
    )


@app.post("/motivate", response_model=MotivateResponse)
async def motivate_endpoint(request: MotivateRequest):
    try:
        result = await generate_motivation(
            streak=request.streak,
            quiz_percent=request.quiz_percent,
            mood=request.mood,
            context=request.context,
        )
        return MotivateResponse(response=str(result))
    except Exception as e:
        print(f"ERROR motivate: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/dashboard")
async def get_dashboard(student_id: str):
    return {
        "stats": {
            "score": 85,
            "streak": 5,
            "weak_topics": ["Trigonometry", "Force and Laws of Motion"],
        }
    }


@app.get("/report")
async def get_report(student_id: str):
    return {"report_url": "#", "summary": "Bacha acha padh raha hai."}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
