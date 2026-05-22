from agents.quiz_agent import QUIZ_GENERATOR_SYSTEM
from utils.groq_client import groq_client
from utils.json_parse import extract_json


async def generate_quiz(subject: str, topic: str, class_level: str) -> dict:
    topic_part = f" topic: '{topic}'" if topic.strip() else ""
    prompt = (
        f"Class {class_level} UP Board — subject: {subject}.{topic_part} "
        "5 MCQs banaein. JSON schema follow karein strictly."
    )
    raw = groq_client.generate_response(prompt, system_instruction=QUIZ_GENERATOR_SYSTEM)
    try:
        data = extract_json(raw)
        questions = data.get("questions", data if isinstance(data, list) else [])
        if not questions:
            raise ValueError("No questions in response")
        normalized = []
        for i, q in enumerate(questions[:5]):
            normalized.append({
                "id": q.get("id", i + 1),
                "question": q.get("question", ""),
                "options": (q.get("options") or [])[:4],
                "correct_index": int(q.get("correct_index", 0)),
                "explanation": q.get("explanation", ""),
            })
        return {"subject": subject, "class_level": class_level, "questions": normalized}
    except Exception as e:
        raise ValueError(f"Quiz parse error: {e}") from e


def analyze_quiz(questions: list, answers: dict) -> dict:
    correct = 0
    wrong_topics = []
    for q in questions:
        qid = str(q.get("id"))
        selected = answers.get(qid)
        if selected is None:
            selected = answers.get(int(qid))
        try:
            selected_idx = int(selected)
        except (TypeError, ValueError):
            selected_idx = -1
        if selected_idx == q.get("correct_index"):
            correct += 1
        else:
            wrong_topics.append(q.get("question", "")[:40])
    total = len(questions) or 1
    percent = round((correct / total) * 100)
    return {
        "correct": correct,
        "total": total,
        "percent": percent,
        "wrong_topics": wrong_topics,
    }
