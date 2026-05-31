from utils.groq_client import groq_client

REPORT_SYSTEM = """Aap ek Professional Parent Report Agent hain.
Parents ke liye ek detailed, caring aur professional Hindi report banao.

FORMATTING RULES (React renders HTML):
1. Use HTML only. NO markdown, NO (**) bold.
2. STRUCTURE same as parent_agent.py system prompt.
3. Be PROFESSIONAL but WARM — parents ki chinta ko samjho.
4. Always end with encouragement for parents AND child.

Return ONLY the HTML inside guruji-response div."""

DEMO_REPORT = """<div class="guruji-response">
<h3>📋 Aapke Bachche ki Progress Report</h3>
<p style="color:#6B7280; font-size:12px;">AI Guruji — Aaj ka Session Summary</p>

<h4>📊 Performance Summary</h4>
<ul>
  <li><strong>Questions Solved:</strong> 23 sawaal</li>
  <li><strong>Accuracy:</strong> 78%</li>
  <li><strong>Study Streak:</strong> 7 din lagataar</li>
  <li><strong>Best Subject:</strong> विज्ञान 🔬</li>
</ul>

<h4>✅ Strengths (Khaasiyat)</h4>
<ul>
  <li>Regular padhai ki bahut achhi aadat hai — 7 din streak!</li>
  <li>विज्ञान mein bahut achhe hain — concepts clear hain</li>
</ul>

<h4>⚠️ Areas for Improvement</h4>
<ul>
  <li><strong>बीजगणित (Algebra):</strong> Equations solve karne mein time lag raha hai — daily 20 min practice chahiye</li>
  <li><strong>Trigonometry:</strong> Formulas yaad karo — flashcards se help milegi</li>
</ul>

<div class="example-box">
  <h4>💡 Ghar pe Kaise Help Karein?</h4>
  <ol>
    <li>Raat 8-9 baje quiet study time dein — distraction kam ho</li>
    <li>Har hafte ek mock test dilwayen — confidence badhega</li>
    <li>Galtiyon par daanten mat — encourage karein, woh seekhenge</li>
    <li>Board exam ke liye previous year papers practice karwayen</li>
  </ol>
</div>

<h4>🎯 Is Hafte ka Goal</h4>
<p>Algebra ke 10 equations roz solve karein aur Trigonometry formulas yaad karein.</p>

<p class="closing">Aapka support is bachche ki sabse badi shakti hai! Mehnat rang layegi 🙏 — AI Guruji</p>
</div>"""


async def generate_parent_report(
    questions_solved: int,
    correct: int,
    streak: int,
    topics: list,
    weak_topics: list,
) -> str:
    accuracy = round((correct / questions_solved * 100) if questions_solved > 0 else 0)
    strong = [t for t in topics if t not in weak_topics][:3]
    weak = weak_topics[:3]

    prompt = (
        f"Generate a professional parent report for a UP Board student. "
        f"Stats: {questions_solved} questions solved, {correct} correct ({accuracy}% accuracy), "
        f"streak: {streak} days. "
        f"Strong topics: {', '.join(strong) or 'General'}. "
        f"Weak topics: {', '.join(weak) or 'None identified yet'}. "
        "Write a warm, professional Hindi parent report with performance summary, strengths, "
        "improvement areas, home support tips, and weekly goal."
    )
    try:
        result = groq_client.generate_response(prompt, system_instruction=REPORT_SYSTEM)
        if result and len(result) > 100:
            return result
        return DEMO_REPORT
    except Exception as e:
        print(f"Report generation error: {e}")
        return DEMO_REPORT
