import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import AppNav from '../components/AppNav';
import { apiPost, getStreak, saveQuizResult } from '../lib/api';

const SUBJECTS = ['गणित', 'विज्ञान', 'हिंदी', 'सामाजिक विज्ञान', 'अंग्रेज़ी'];
const CLASSES = ['9', '10', '11', '12'];

const Quiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('setup');
  const [subject, setSubject] = useState('गणित');
  const [topic, setTopic] = useState('');
  const [classLevel, setClassLevel] = useState('10');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [result, setResult] = useState(null);

  const questions = quiz?.questions || [];
  const currentQ = questions[currentIdx];

  const generateQuiz = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiPost('/quiz/generate', {
        subject,
        topic: topic.trim(),
        class_level: classLevel,
      });
      setQuiz(data);
      setStep('quiz');
      setCurrentIdx(0);
      setAnswers({});
      setSelected(null);
      setShowFeedback(false);
    } catch (e) {
      setError(e.message || 'Quiz generate nahi ho paya');
    } finally {
      setLoading(false);
    }
  };

  const pickOption = (idx) => {
    if (showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);
    setAnswers((prev) => ({ ...prev, [String(currentQ.id)]: idx }));
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setLoading(true);
    try {
      const finalAnswers = { ...answers };
      if (selected !== null && currentQ) {
        finalAnswers[String(currentQ.id)] = selected;
      }
      const data = await apiPost('/quiz/submit', {
        subject,
        questions,
        answers: finalAnswers,
      });
      setResult(data);
      saveQuizResult(data.percent, subject);
      setStep('result');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep('setup');
    setQuiz(null);
    setResult(null);
    setError('');
    setCurrentIdx(0);
    setAnswers({});
  };

  const isCorrect = selected === currentQ?.correct_index;

  return (
    <div className="min-h-screen bg-[#F0F4FA] flex flex-col">
      <AppNav />

      <main className="flex-1 px-4 py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-indigo-950">Quiz Generator</h1>
              <p className="text-xs text-gray-500">5 MCQs • UP Board • Hindi</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
              >
                <div>
                  <label className="text-sm font-semibold text-gray-700">Class</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {CLASSES.map((c) => (
                      <button
                        key={c}
                        type="button"
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

                <div>
                  <label className="text-sm font-semibold text-gray-700">Subject</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {SUBJECTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSubject(s)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          subject === s
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Topic (optional)
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Trigonometry, Photosynthesis..."
                    className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={generateQuiz}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-900 hover:bg-indigo-800 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Quiz ban raha hai...
                    </>
                  ) : (
                    <>
                      Quiz शुरू करें
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {step === 'quiz' && currentQ && (
              <motion.div
                key={`q-${currentIdx}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {subject} • Class {classLevel}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {currentIdx + 1} / {questions.length}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>

                <h2 className="text-lg font-bold text-indigo-950 mb-5 font-['Noto_Sans_Devanagari'] leading-relaxed">
                  {currentQ.question}
                </h2>

                <div className="space-y-3">
                  {currentQ.options.map((opt, idx) => {
                    let style = 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50';
                    if (showFeedback) {
                      if (idx === currentQ.correct_index) {
                        style = 'border-green-500 bg-green-50 text-green-900';
                      } else if (idx === selected && idx !== currentQ.correct_index) {
                        style = 'border-red-400 bg-red-50 text-red-900';
                      } else {
                        style = 'border-gray-100 opacity-60';
                      }
                    } else if (selected === idx) {
                      style = 'border-indigo-500 bg-indigo-50';
                    }
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => pickOption(idx)}
                        disabled={showFeedback}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${style}`}
                      >
                        <span className="font-bold text-indigo-600 mr-2">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-5 p-4 rounded-xl flex gap-3 ${
                      isCorrect ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="text-green-600 flex-shrink-0" size={22} />
                    ) : (
                      <XCircle className="text-orange-600 flex-shrink-0" size={22} />
                    )}
                    <p className="text-sm text-gray-700 font-['Noto_Sans_Devanagari']">
                      {currentQ.explanation}
                    </p>
                  </motion.div>
                )}

                {showFeedback && (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    disabled={loading}
                    className="mt-5 w-full bg-indigo-900 text-white font-bold py-3 rounded-xl hover:bg-indigo-800 transition-colors"
                  >
                    {currentIdx < questions.length - 1 ? 'अगला सवाल →' : 'परिणाम देखें'}
                  </button>
                )}
              </motion.div>
            )}

            {step === 'result' && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
                  <Trophy className="text-white w-8 h-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-indigo-950">
                  {result.percent}% Score!
                </h2>
                <p className="text-gray-500 mt-1">
                  {result.correct} / {result.total} सही
                </p>
                <p className="mt-4 text-sm text-gray-700 bg-gray-50 rounded-xl p-4 font-['Noto_Sans_Devanagari']">
                  {result.analysis}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      navigate('/motivate', {
                        state: { quizPercent: result.percent, fromQuiz: true },
                      })
                    }
                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-3 rounded-xl hover:opacity-90"
                  >
                    💪 Motivation lo
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="flex-1 flex items-center justify-center gap-2 border-2 border-indigo-200 text-indigo-900 font-bold py-3 rounded-xl hover:bg-indigo-50"
                  >
                    <RotateCcw size={18} />
                    Naya Quiz
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

export default Quiz;
