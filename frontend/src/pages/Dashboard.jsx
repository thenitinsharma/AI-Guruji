import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Flame, Target, BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';
import AppNav from '../components/AppNav';

const TOPIC_COLORS = ['#FF6B00', '#138808', '#7C3AED', '#1D4ED8', '#DC2626', '#F59E0B'];

const DEFAULT_TOPICS = [
  { name: 'Trigonometry',        pct: 72, color: '#FF6B00' },
  { name: 'Algebra (बीजगणित)',   pct: 55, color: '#DC2626' },
  { name: 'Photosynthesis',      pct: 88, color: '#138808' },
  { name: 'Newton Laws',         pct: 80, color: '#7C3AED' },
  { name: 'Chemical Reactions',  pct: 65, color: '#F59E0B' },
];

const MOTI_MSGS = [
  'वाह! आज आपने बहुत अच्छा किया 🔥',
  'Consistency is key! रोज़ पढ़ो! 🌟',
  'UP Board topper बनोगे! 🏆',
  'हर गलती एक सबक है! 💪',
  'Mehnat ka phal zaroor milega! 🎯',
];

const Dashboard = () => {
  const [stats, setStats] = useState({ streak: 7, questionsTotal: 23, correct: 18, topics: 4 });
  const [topicData, setTopicData] = useState(DEFAULT_TOPICS);
  const [motiMsg, setMotiMsg] = useState(MOTI_MSGS[0]);

  useEffect(() => {
    // Load from localStorage
    try {
      const raw = localStorage.getItem('guruji_stats');
      if (raw) {
        const data = JSON.parse(raw);
        const streak = data.streak ?? 7;
        const quizzes = data.quizzes ?? [];
        const questionsTotal = quizzes.length * 5;
        const correct = quizzes.reduce((acc, q) => acc + Math.round((q.percent / 100) * 5), 0);
        const topics = [...new Set(quizzes.map(q => q.subject))].length;

        // Build topic data from quizzes
        const topicMap = {};
        quizzes.forEach(q => {
          if (!topicMap[q.subject]) topicMap[q.subject] = [];
          topicMap[q.subject].push(q.percent);
        });
        const dynamicTopics = Object.entries(topicMap).map(([name, percs], i) => ({
          name,
          pct: Math.round(percs.reduce((a, b) => a + b, 0) / percs.length),
          color: TOPIC_COLORS[i % TOPIC_COLORS.length],
        }));

        setStats({ streak, questionsTotal: questionsTotal || 23, correct: correct || 18, topics: topics || 4 });
        if (dynamicTopics.length > 0) {
          setTopicData([...dynamicTopics, ...DEFAULT_TOPICS].slice(0, 6));
        }
      }
    } catch (e) { /* use defaults */ }

    setMotiMsg(MOTI_MSGS[Math.floor(Math.random() * MOTI_MSGS.length)]);
  }, []);

  const accuracy = Math.round((stats.correct / stats.questionsTotal) * 100);
  const weakTopics = topicData.filter(t => t.pct < 70);

  const statCards = [
    { label: 'Questions', sub: 'हल किए', value: stats.questionsTotal, color: 'text-orange-500' },
    { label: 'Correct', sub: 'सही जवाब', value: stats.correct, color: 'text-green-600' },
    { label: 'Topics', sub: 'विषय पढ़े', value: stats.topics, color: 'text-violet-600' },
    { label: 'Accuracy', sub: 'सटीकता', value: `${accuracy}%`, color: 'text-indigo-700' },
  ];

  const streak = stats.streak;

  return (
    <div className="min-h-screen bg-[#F0F4FA] flex flex-col">
      <AppNav streak={streak} />

      <main className="flex-1 px-4 py-6 md:py-8">
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-700 to-indigo-900 flex items-center justify-center shadow-lg shadow-indigo-200">
              <BarChart3 className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-indigo-950">Progress Dashboard</h1>
              <p className="text-xs text-gray-500">Aapki padhai ki complete progress</p>
            </div>
          </div>

          {/* Motivation Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-5 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FF5500 0%, #FF7A00 60%, #FF9500 100%)' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <p className="font-bold text-lg" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{motiMsg}</p>
            <div className="flex items-center gap-2 mt-2 text-orange-100 text-sm">
              <Flame size={16} />
              <span>Streak: <strong className="text-white">{streak} दिन</strong> लगातार</span>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center"
              >
                <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                <div className="text-xs font-bold text-gray-700 mt-1">{s.label}</div>
                <div className="text-[10px] text-gray-400" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>

          {/* Topic Progress */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-indigo-950 flex items-center gap-2 mb-4">
              <BookOpen size={18} /> 📈 Topic Progress
            </h2>
            <div className="space-y-3">
              {topicData.slice(0, 6).map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-xs font-bold text-gray-700 w-36 truncate">{t.name}</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${t.pct}%` }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.06 }}
                      className="h-full rounded-full"
                      style={{ background: t.color }}
                    />
                  </div>
                  <span className="text-xs font-bold w-9 text-right" style={{ color: t.color }}>{t.pct}%</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Weak Topics */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-indigo-950 flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-orange-500" /> ⚠️ Weak Topics
            </h2>
            {weakTopics.length > 0 ? (
              <div className="space-y-3">
                {weakTopics.map(t => (
                  <div key={t.name} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="text-sm font-bold text-orange-700">{t.name}</p>
                      <p className="text-xs text-gray-500">Score: {t.pct}% — Daily 20 min practice करो</p>
                    </div>
                    <Link
                      to="/chat"
                      className="ml-auto text-xs bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1.5 rounded-lg font-bold hover:bg-orange-100 transition-colors flex-shrink-0"
                    >
                      Ask Guruji
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-700 text-sm py-2">
                <CheckCircle2 size={18} />
                <p className="font-medium">🎉 Koi weak topic nahi — bahut badhiya!</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/quiz"
              className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="text-2xl mb-2">📝</div>
              <p className="text-sm font-bold text-indigo-950">Quiz दो</p>
              <p className="text-xs text-gray-400 mt-1">Score improve karo</p>
            </Link>
            <Link
              to="/study-plan"
              className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="text-2xl mb-2">📅</div>
              <p className="text-sm font-bold text-indigo-950">Study Plan</p>
              <p className="text-xs text-gray-400 mt-1">7-day plan banao</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
