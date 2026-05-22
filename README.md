# AI Guruji - Vernacular AI Tutor for UP Board Students

AI Guruji is a multi-agent AI system built to solve doubts, generate quizzes, and track progress for students in Class 9-12 of the UP Board. It speaks Hindi and uses local analogies from Uttar Pradesh.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, CrewAI
- **LLM**: Google Gemini 1.5 Flash

## Getting Started

### 1. Backend Setup
1. Open a terminal in the `backend` folder (or root).
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Update `.env` with your `GEMINI_API_KEY`.
4. Run the server:
   ```bash
   python main.py
   ```

### 2. Frontend Setup
1. Open a terminal in the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Workflow
1. Use the **Chat** interface to ask doubts.
2. The **Supervisor** routes your doubt to the **Doubt Solver Agent**.
3. Answers are provided in simple Hindi with local UP context (khet, mela, etc.).
