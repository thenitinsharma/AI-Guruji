# AI Guruji — Architecture & Planning Document

## 1. System Overview

AI Guruji is a client-side single-page application (SPA) that uses the Google Gemini API as its AI backbone. There is no custom backend server — all AI calls are made directly from the browser to Gemini's REST endpoint. This keeps the project lightweight and freely deployable.

```
┌─────────────────────────────────────────────────────┐
│                    Browser (Client)                  │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Chat UI │  │ Quiz UI  │  │ Dashboard/Report │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       │              │                 │             │
│  ┌────▼──────────────▼─────────────────▼──────────┐ │
│  │            Agent Router (JS)                   │ │
│  │  doubtSolver | quizGen | gapDetector |          │ │
│  │  motivator | parentReport                      │ │
│  └────────────────────┬───────────────────────────┘ │
│                       │                             │
│  ┌────────────────────▼───────────────────────────┐ │
│  │         Gemini API Wrapper (gemini.js)         │ │
│  └────────────────────┬───────────────────────────┘ │
└───────────────────────┼─────────────────────────────┘
                        │ HTTPS (REST)
              ┌─────────▼──────────┐
              │  Google Gemini API │
              │  gemini-2.0-flash  │
              └────────────────────┘
```

---

## 2. Agent Design

Each "agent" is a different persona of Gemini, activated by swapping the `system_instruction` sent with each API call. All agents respond in Hindi/Hinglish.

| Agent              | System Role             | Key Behavior                                     |
| ------------------ | ----------------------- | ------------------------------------------------ |
| **Doubt Solver**   | Expert UP Board teacher | Step-by-step explanations, 150–200 words, emojis |
| **Quiz Generator** | MCQ creator             | Returns strict JSON array of 5 questions         |
| **Gap Detector**   | Learning analyst        | Identifies weak topics, gives study plan         |
| **Motivation**     | Friendly mentor         | Celebrates streaks, uplifting tone               |
| **Parent Report**  | Report writer           | Professional summary for parents                 |

### Conversation Memory

- Chat history is maintained as an array of `{role, parts}` objects.
- The last 10 turns are sent with each request to stay within Gemini's context limits.
- History resets when the user switches agents (clean slate per agent session).

---

## 3. Quiz Pipeline

````
User selects topic
      │
      ▼
callGeminiQuiz(topic)
  → Prompt: "Return ONLY a JSON array of 5 MCQs..."
      │
      ▼
Parse JSON response
  → Strip markdown fences (```json blocks)
  → JSON.parse()
      │
      ▼
renderQuestion(idx)
  → Show question + 4 options
  → On answer: highlight correct/wrong, show explanation
  → After 1.8s delay → next question
      │
      ▼
showQuizResult()
  → Calculate percentage
  → Update stat counters
  → Update answeredTopics{} map for gap detection
````

---

## 4. State Management

All state lives in JS module-level variables (in-memory, resets on page reload):

```javascript
apiKey; // Gemini API key (entered by user)
currentAgent; // Active agent string id
chatHistory; // [{role, parts}] — last N turns
quizData; // Parsed quiz questions array
quizScore; // Current quiz correct count
answeredTopics; // { topicName: { right: N, wrong: N } }
```

**Future:** Persist state to `localStorage` or Firebase Firestore for cross-session continuity and streak tracking.

---

## 5. Data Flow — Parent Report

```
User clicks "Generate Report"
      │
      ▼
Read stats from DOM (answered, correct)
+ Read answeredTopics{}
      │
      ▼
Build prompt string with student data
      │
      ▼
callGeminiReport(prompt)
  → system_instruction: parentReport agent
      │
      ▼
Render formatted text in report card div
```

---

## 6. UI Architecture

The UI is a **tab-based SPA** with 4 sections, toggled by CSS `display:none` / `display:block`. No routing library is used.

```
Tabs: Chat | Quiz | Dashboard | Report
         ↓       ↓       ↓         ↓
   #tab-content-* divs toggled via showTab()
```

CSS design tokens (CSS variables) centralize the color palette — saffron (`#FF6B00`), green (`#138808`), navy (`#000080`) — reflecting the Indian tricolour theme.

---

## 7. Key Technical Decisions

| Decision                  | Rationale                                                  |
| ------------------------- | ---------------------------------------------------------- |
| Vanilla JS over React     | Zero build tooling, instant deploy, easy for collaborators |
| Gemini `gemini-2.0-flash` | Fast, cheap, supports Hindi well                           |
| Client-side API key       | Prototype simplicity; production needs a backend proxy     |
| No backend server         | Reduces infrastructure cost; static hosting is sufficient  |
| Hindi/Hinglish output     | Core differentiator for Tier 2/3 city UP Board students    |

---

## 8. Known Limitations & Roadmap

| Limitation                   | Planned Fix                                                         |
| ---------------------------- | ------------------------------------------------------------------- |
| API key exposed in browser   | Add a lightweight backend proxy (Node/Express or Cloudflare Worker) |
| No data persistence          | Integrate Firebase Firestore + Auth                                 |
| No voice input               | Add Web Speech API for mic-based questions                          |
| Single student profile       | Multi-student support with login                                    |
| Static motivational messages | Make motivator agent fully dynamic via API                          |

---

## 👥 Team

| #   | Name                   | Role                       |
| --- | ---------------------- | -------------------------- |
| 1   | **Nitin Kumar Sharma** | Team Lead / AI Integration |
| 2   | **Vansh Maurya**       | Backend Development       |
| 3   | **Yuthika Mishra**     | UI/UX & Content Design     |
| 4   | **Sanskriti Sahu**     | Testing & Documentation    |

| Field     | Detail                 |
| --------- | ---------------------- |
| Team Name | **Team Zenith**        |
| Domain    | EdTech / AI for Bharat |
