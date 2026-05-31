import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Loader2, Sparkles } from 'lucide-react';
import AppNav from '../components/AppNav';
import { apiPost } from '../lib/api';

const SUBJECTS = ['गणित', 'विज्ञान', 'अंग्रेजी', 'हिंदी', 'सामाजिक विज्ञान'];
const HOURS = ['1 घंटा', '2 घंटे', '3 घंटे', '4+ घंटे'];

const StudyPlan = () => {
  const [classLevel, setClassLevel] = useState('10');
  const [dailyHours, setDailyHours] = useState('3 घंटे');
  const [weakSubs, setWeakSubs] = useState(['विज्ञान']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState('');

  const toggleSub = (sub) => {
    setWeakSubs(prev =>
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const generatePlan = async () => {
    setLoading(true);
    setError('');
    setPlan('');
    try {
      const data = await apiPost('/study-plan/generate', {
        class_level: classLevel,
        daily_hours: dailyHours,
        weak_subjects: weakSubs.join(', '),
      });
      setPlan(data.plan);
    } catch (e) {
      setError(e.message || 'Plan generate nahi ho paya.');
    } finally {
      setLoading(false);
    }
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-200">
              <CalendarDays className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-indigo-950">Study Plan</h1>
              <p className="text-xs text-gray-500">AI-powered 7-Day Personalized Study Plan</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            {/* Class */}
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

            {/* Daily Hours */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">रोज़ की पढ़ाई</label>
              <div className="flex flex-wrap gap-2">
                {HOURS.map(h => (
                  <button
                    key={h}
                    onClick={() => setDailyHours(h)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      dailyHours === h
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-teal-50'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Weak Subjects */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Weak Subjects <span className="text-gray-400 font-normal">(multiple select)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map(sub => (
                  <button
                    key={sub}
                    onClick={() => toggleSub(sub)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      weakSubs.includes(sub)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-orange-50'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
            )}

            <button
              onClick={generatePlan}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:opacity-90 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-opacity shadow-lg shadow-teal-200/50"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={20} /> Plan बन रहा है...</>
              ) : (
                <><Sparkles size={20} /> 📅 7-Day Study Plan बनाओ</>
              )}
            </button>
          </div>

          {/* Plan Result */}
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-white rounded-2xl border border-teal-100 shadow-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 px-5 py-3 border-b border-teal-100">
                <p className="text-sm font-bold text-teal-800">📅 Your Personalized Study Plan — Class {classLevel}</p>
                <p className="text-xs text-teal-600 mt-0.5">Daily: {dailyHours} • Weak: {weakSubs.join(', ') || 'General'}</p>
              </div>
              <div
                className="p-5 guruji-response guruji-message"
                dangerouslySetInnerHTML={{ __html: plan }}
              />
              <div className="px-5 pb-4">
                <button
                  onClick={generatePlan}
                  disabled={loading}
                  className="w-full py-2.5 border-2 border-teal-300 text-teal-700 font-bold rounded-xl hover:bg-teal-50 text-sm flex items-center justify-center gap-2"
                >
                  <Loader2 size={15} className={loading ? 'animate-spin' : ''} /> Regenerate Plan
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudyPlan;
