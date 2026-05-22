import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import AppNav from '../components/AppNav';
import { apiPost, getStreak } from '../lib/api';

const MOODS = [
  { id: 'happy', label: '😊 Khush', emoji: '😊' },
  { id: 'tired', label: '😴 Thake hue', emoji: '😴' },
  { id: 'nervous', label: '😰 Exam tension', emoji: '😰' },
  { id: 'neutral', label: '🙂 Normal', emoji: '🙂' },
  { id: 'low_score', label: '📉 Score kam', emoji: '📉' },
];

const Motivator = () => {
  const location = useLocation();
  const fromQuiz = location.state?.fromQuiz;
  const quizPercent = location.state?.quizPercent;

  const [mood, setMood] = useState(fromQuiz && quizPercent < 60 ? 'low_score' : 'neutral');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const fetchMotivation = async (auto = false) => {
    setLoading(true);
    setError('');
    if (!auto) setResponse('');
    try {
      const data = await apiPost('/motivate', {
        streak: getStreak(),
        quiz_percent: quizPercent ?? undefined,
        mood: quizPercent !== undefined && quizPercent < 50 ? 'low_score' : mood,
        context: context.trim() || (fromQuiz ? `Abhi quiz complete kiya, score ${quizPercent}%` : ''),
      });
      setResponse(data.response);
    } catch (e) {
      setError(e.message || 'Motivation load nahi ho payi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromQuiz && quizPercent !== undefined) {
      fetchMotivation(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/80 via-[#F0F4FA] to-indigo-50/50 flex flex-col">
      <AppNav />

      <main className="flex-1 px-4 py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-200">
              <Heart className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-indigo-950">Motivator</h1>
              <p className="text-xs text-gray-500">
                AI Guruji aapko encourage karega — mehnat ke liye ready?
              </p>
            </div>
          </div>

          {fromQuiz && quizPercent !== undefined && (
            <div className="mb-4 p-3 bg-white/80 border border-rose-100 rounded-xl text-sm text-rose-800 font-medium">
              Quiz score: <strong>{quizPercent}%</strong> — neeche personalized motivation milegi
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700">Aapka mood?</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(m.id)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      mood === m.id
                        ? 'bg-rose-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-rose-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Kuch batana chahte hain? (optional)
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. Kal exam hai, thoda dar lag raha hai..."
                rows={3}
                className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none resize-none"
              />
            </div>

            <button
              type="button"
              onClick={() => fetchMotivation(false)}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-opacity"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Guruji soch rahe hain...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Motivation paao
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {response && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-white rounded-2xl border border-rose-100 shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  💪 AI Guruji bol rahe hain
                </span>
                <button
                  type="button"
                  onClick={() => fetchMotivation(false)}
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Refresh"
                >
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
              <div
                className="guruji-message guruji-response text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: response }}
              />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Motivator;
