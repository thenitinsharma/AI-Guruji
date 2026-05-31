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
from services.flashcard_service import generate_flashcards
from services.study_plan_service import generate_study_plan
from services.report_service import generate_parent_report

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env"))

app = FastAPI(title="AI Guruji Backend", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── CHAT ─────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    student_id: str = "guest_123"
    agent: str = "doubt"       # doubt | stepsolve | gap | story | parent | motivation
    mode: str = "hindi"        # hindi | hinglish | simple | exam | math


class ChatResponse(BaseModel):
    response: str
    agent_id: str


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        result = await supervisor.route_request(
            request.message,
            agent=request.agent,
            mode=request.mode,
        )
        return ChatResponse(response=str(result), agent_id=request.agent)
    except Exception as e:
        print(f"ERROR in chat_endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ─── QUIZ ─────────────────────────────────────────────────────────────────────

class QuizGenerateRequest(BaseModel):
    subject: str
    topic: str = ""
    class_level: str = "10"
    student_id: str = "guest_123"
    difficulty: str = "medium"   # easy | medium | hard


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


# ─── MOTIVATE ─────────────────────────────────────────────────────────────────

class MotivateRequest(BaseModel):
    student_id: str = "guest_123"
    streak: int = 0
    quiz_percent: Optional[int] = None
    mood: str = "neutral"
    context: str = ""


class MotivateResponse(BaseModel):
    response: str
    agent_id: str = "motivator"


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


# ─── FLASHCARDS ───────────────────────────────────────────────────────────────

class FlashcardRequest(BaseModel):
    topic: str
    class_level: str = "10"
    student_id: str = "guest_123"


class FlashcardItem(BaseModel):
    front: str
    back: str


class FlashcardResponse(BaseModel):
    topic: str
    cards: List[FlashcardItem]


@app.post("/flashcards/generate", response_model=FlashcardResponse)
async def flashcards_generate(request: FlashcardRequest):
    try:
        cards = await generate_flashcards(request.topic, request.class_level)
        return FlashcardResponse(
            topic=request.topic,
            cards=[FlashcardItem(**c) for c in cards],
        )
    except Exception as e:
        print(f"ERROR flashcards: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── STUDY PLAN ───────────────────────────────────────────────────────────────

class StudyPlanRequest(BaseModel):
    class_level: str = "10"
    daily_hours: str = "3 घंटे"
    weak_subjects: str = ""
    student_id: str = "guest_123"


class StudyPlanResponse(BaseModel):
    plan: str


@app.post("/study-plan/generate", response_model=StudyPlanResponse)
async def study_plan_generate(request: StudyPlanRequest):
    try:
        plan = await generate_study_plan(
            request.class_level,
            request.daily_hours,
            request.weak_subjects,
        )
        return StudyPlanResponse(plan=plan)
    except Exception as e:
        print(f"ERROR study plan: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── PARENT REPORT ────────────────────────────────────────────────────────────

class ReportRequest(BaseModel):
    student_id: str = "guest_123"
    questions_solved: int = 0
    correct: int = 0
    streak: int = 7
    topics: List[str] = []
    weak_topics: List[str] = []


class ReportResponse(BaseModel):
    report: str


@app.post("/report/generate", response_model=ReportResponse)
async def report_generate(request: ReportRequest):
    try:
        report = await generate_parent_report(
            questions_solved=request.questions_solved,
            correct=request.correct,
            streak=request.streak,
            topics=request.topics,
            weak_topics=request.weak_topics,
        )
        return ReportResponse(report=report)
    except Exception as e:
        print(f"ERROR report: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ─── DASHBOARD ────────────────────────────────────────────────────────────────

@app.get("/dashboard")
async def get_dashboard(student_id: str = "guest_123"):
    return {
        "stats": {
            "score": 85,
            "streak": 5,
            "weak_topics": ["Trigonometry", "Force and Laws of Motion"],
        }
    }


# ─── ROOT ─────────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"message": "AI Guruji Backend v2.0 is running!", "endpoints": [
        "/chat", "/quiz/generate", "/quiz/submit", "/motivate",
        "/flashcards/generate", "/study-plan/generate", "/report/generate", "/dashboard"
    ]}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
