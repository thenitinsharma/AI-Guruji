export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || data.message || 'Request failed');
  }
  return data;
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || 'Request failed');
  return data;
}

export function getStreak() {
  try {
    const raw = localStorage.getItem('guruji_stats');
    if (!raw) return 1;
    return JSON.parse(raw).streak ?? 1;
  } catch {
    return 1;
  }
}

export function saveQuizResult(percent, subject) {
  try {
    const raw = localStorage.getItem('guruji_stats');
    const stats = raw ? JSON.parse(raw) : { streak: 1, quizzes: [], lastDate: null };

    // Update streak based on date
    const today = new Date().toDateString();
    if (stats.lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      stats.streak = stats.lastDate === yesterday ? (stats.streak ?? 1) + 1 : 1;
      stats.lastDate = today;
    }

    stats.quizzes = [
      { subject, percent, date: new Date().toISOString() },
      ...(stats.quizzes || []),
    ].slice(0, 20);

    localStorage.setItem('guruji_stats', JSON.stringify(stats));
  } catch {
    /* ignore */
  }
}

