import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, RotateCcw, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import AppNav from '../components/AppNav';
import { apiPost } from '../lib/api';

const TOPICS = [
  { value: 'Trigonometry formulas',           label: '📐 Trigonometry Formulas' },
  { value: 'Physics laws and definitions',     label: '⚙️ Physics Laws' },
  { value: 'Chemistry periodic table basics',  label: '🧪 Chemistry Basics' },
  { value: 'Biology definitions and concepts', label: '🌿 Biology Concepts' },
  { value: 'Indian History important dates',   label: '🏛️ Indian History' },
  { value: 'English grammar rules',            label: '📝 English Grammar' },
  { value: 'Quadratic equations and algebra',  label: 'x² Algebra' },
  { value: 'Geography rivers and capitals',    label: '🗺️ Geography' },
];

const Flashcards = () => {
  const [topic, setTopic] = useState(TOPICS[0].value);
  const [classLevel, setClassLevel] = useState('10');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cards, setCards] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knew, setKnew] = useState(0);
  const [review, setReview] = useState(0);
  const [done, setDone] = useState(false);

  const generateCards = async () => {
    setLoading(true);
    setError('');
    setCards([]);
    setIdx(0);
    setFlipped(false);
    setKnew(0);
    setReview(0);
    setDone(false);
    try {
      const data = await apiPost('/flashcards/generate', { topic, class_level: classLevel });
      if (data.cards && data.cards.length > 0) {
        setCards(data.cards);
      } else {
        setError('Koi cards nahi mile. Dobara try karein.');
      }
    } catch (e) {
      setError(e.message || 'Cards generate nahi ho paye.');
    } finally {
      setLoading(false);
    }
  };

  const handleKnew = () => {
    setKnew(k => k + 1);
    next();
  };

  const handleReview = () => {
    setReview(r => r + 1);
    next();
  };

  const next = () => {
    if (idx + 1 >= cards.length) {
      setDone(true);
    } else {
      setIdx(i => i + 1);
      setFlipped(false);
    }
  };

  const restart = () => {
    setIdx(0);
    setFlipped(false);
    setKnew(0);
    setReview(0);
    setDone(false);
  };

  const streak = (() => {
    try { return JSON.parse(localStorage.getItem('guruji_stats') || '{}').streak ?? 7; } catch { return 7; }
  })();

  return (
    <div className="min-h-screen bg-[#F0F4FA] flex flex-col">
      <AppNav streak={streak} />

      <main className="flex-1 px-4 py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-200">
              <span className="text-2xl">🃏</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-indigo-950">Flashcards</h1>
              <p className="text-xs text-gray-500">AI-generated flip cards — Click to reveal answer</p>
            </div>
          </div>

          {/* Setup */}
          {cards.length === 0 && !done && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
            >
              {/* Topic Select */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Topic चुनो</label>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setTopic(t.value)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        topic === t.value
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-violet-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Class Level */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Class</label>
                <div className="flex gap-2">
                  {['9', '10', '11', '12'].map(c => (
                    <button
                      key={c}
                      onClick={() => setClassLevel(c)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                        classLevel === c
                          ? 'bg-indigo-900 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-indigo-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
              )}

              <button
                onClick={generateCards}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 hover:opacity-90 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-opacity shadow-lg shadow-purple-200/50"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={20} /> Flashcards बन रहे हैं...</>
                ) : (
                  <><Sparkles size={20} /> ⚡ 10 Flashcards Generate करो</>
                )}
              </button>
            </motion.div>
          )}

          {/* Flashcard */}
          <AnimatePresence mode="wait">
            {cards.length > 0 && !done && (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-4"
              >
                {/* Progress */}
                <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                  <span>Card {idx + 1} / {cards.length}</span>
                  <div className="flex gap-3">
                    <span className="text-green-600 font-bold">✅ {knew}</span>
                    <span className="text-orange-600 font-bold">🔄 {review}</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${((idx + 1) / cards.length) * 100}%` }}
                  />
                </div>

                {/* Card */}
                <div className="flashcard-scene" style={{ height: '240px' }}>
                  <div
                    className={`flashcard-inner cursor-pointer ${flipped ? 'flipped' : ''}`}
                    onClick={() => setFlipped(f => !f)}
                    style={{ height: '240px' }}
                  >
                    {/* Front */}
                    <div className="flashcard-face bg-white rounded-2xl shadow-lg border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">📋 Question</span>
                      <p className="text-xl font-bold text-indigo-950 text-center leading-relaxed" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                        {cards[idx]?.front}
                      </p>
                      <span className="text-xs text-gray-400 mt-4">👆 Tap to reveal answer</span>
                    </div>
                    {/* Back */}
                    <div className="flashcard-face flashcard-back bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl shadow-lg border border-violet-100">
                      <span className="text-[10px] text-violet-500 font-bold uppercase tracking-widest mb-4">✅ Answer</span>
                      <p className="text-xl font-bold text-violet-800 text-center leading-relaxed" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                        {cards[idx]?.back}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleReview}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-orange-300 text-orange-700 font-bold hover:bg-orange-50 transition-colors"
                  >
                    <ThumbsDown size={18} /> Review Again
                  </button>
                  <button
                    onClick={handleKnew}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-green-400 text-green-700 font-bold hover:bg-green-50 transition-colors"
                  >
                    <ThumbsUp size={18} /> I Knew It! ✅
                  </button>
                </div>

                <button
                  onClick={() => { setCards([]); setDone(false); }}
                  className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1"
                >
                  <RotateCcw size={13} /> New Topic
                </button>
              </motion.div>
            )}

            {/* Done Screen */}
            {done && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 text-center"
              >
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-2xl font-extrabold text-indigo-950">सभी cards complete!</h2>
                <p className="text-gray-500 mt-2">
                  Knew: <strong className="text-green-600">{knew}</strong> / {cards.length} (
                  {Math.round((knew / cards.length) * 100)}%)
                </p>
                {knew / cards.length >= 0.8 && (
                  <p className="mt-2 text-orange-600 font-bold">🔥 Excellent! लगे रहो!</p>
                )}
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={restart}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl"
                  >
                    <RefreshCw size={18} /> फिर से Practice करो
                  </button>
                  <button
                    onClick={() => { setCards([]); setDone(false); }}
                    className="w-full py-3 border-2 border-indigo-200 text-indigo-800 font-bold rounded-xl hover:bg-indigo-50"
                  >
                    New Topic चुनो
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Flashcards;
