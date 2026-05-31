from utils.groq_client import groq_client

STUDY_PLAN_SYSTEM = """Aap ek expert Education Counselor hain UP Board students ke liye.
Ek practical, day-wise 7-day study plan banao.

FORMATTING RULES (React renders HTML):
1. Use HTML only. NO markdown, NO (**) bold.
2. STRUCTURE:
   <div class="guruji-response">
     <h3>📅 Aapka 7-Day Study Plan — [Class]</h3>
     <p>[1-line intro about the plan]</p>

     <div class="example-box">
       <h4>📋 Weekly Schedule</h4>
       <ol>
         <li><strong>Day 1 (Monday):</strong> [Subject — Topic (time)] • [quick tip]</li>
         ...repeat for all 7 days...
       </ol>
     </div>

     <h4>💡 General Tips</h4>
     <ul>
       <li>[Practical study tip 1]</li>
       <li>[Practical study tip 2]</li>
     </ul>

     <p class="closing">Ek din ek step — UP Board topper zaroor banoge! 🏆</p>
   </div>

3. LANGUAGE: Hinglish — friendly but informative.
4. Each day: specify morning/evening, subject, exact topic, practice type.
5. Give more time to weak subjects.
6. Include one revision/rest day."""

DEMO_PLAN = """<div class="guruji-response">
<h3>📅 Aapka 7-Day Study Plan — Class 10</h3>
<p>Yeh plan aapke weak subjects aur daily time ke hisaab se banaya gaya hai.</p>
<div class="example-box">
  <h4>📋 Weekly Schedule</h4>
  <ol>
    <li><strong>Day 1 (Monday):</strong> गणित — Algebra (2 hr) • Practice 10 equations daily</li>
    <li><strong>Day 2 (Tuesday):</strong> विज्ञान — Physics Chapter 1 (2 hr) • Formulas yaad karo</li>
    <li><strong>Day 3 (Wednesday):</strong> गणित — Geometry (2 hr) • Diagrams banao</li>
    <li><strong>Day 4 (Thursday):</strong> अंग्रेजी — Grammar + Reading (1.5 hr) • Vocabulary notebook</li>
    <li><strong>Day 5 (Friday):</strong> विज्ञान — Chemistry (2 hr) • Equations balance karo</li>
    <li><strong>Day 6 (Saturday):</strong> Revision + Mock Test (3 hr) • Sabhi subjects revise</li>
    <li><strong>Day 7 (Sunday):</strong> Rest + Light Reading (1 hr) • Previous year papers dekho</li>
  </ol>
</div>
<h4>💡 General Tips</h4>
<ul>
  <li>Roz subah 6-7 baje padho — dimag fresh hota hai</li>
  <li>Phone band karo padhai ke time — focus badhega</li>
  <li>Har chapter ke baad short notes banao</li>
</ul>
<p class="closing">Ek din ek step — UP Board topper zaroor banoge! 🏆</p>
</div>"""


async def generate_study_plan(
    class_level: str,
    daily_hours: str,
    weak_subjects: str,
) -> str:
    prompt = (
        f"Create a detailed 7-day study plan for UP Board Class {class_level} student. "
        f"Daily study time: {daily_hours}. Weak subjects: {weak_subjects or 'General revision'}. "
        "Include morning/evening schedule, specific topics per day, practice tips. "
        "More time for weak subjects. One revision day. Keep motivating."
    )
    try:
        result = groq_client.generate_response(prompt, system_instruction=STUDY_PLAN_SYSTEM)
        if result and len(result) > 100:
            return result
        return DEMO_PLAN
    except Exception as e:
        print(f"Study plan error: {e}")
        return DEMO_PLAN
