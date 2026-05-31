import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, MessageCircle, ClipboardList, Heart, BookOpen, CalendarDays, BarChart3, FileText, Flame } from 'lucide-react';

const links = [
  { to: '/chat',        label: 'Chat',       icon: MessageCircle },
  { to: '/quiz',        label: 'Quiz',        icon: ClipboardList },
  { to: '/flashcards',  label: 'Flashcards',  icon: BookOpen },
  { to: '/study-plan',  label: 'Study Plan',  icon: CalendarDays },
  { to: '/dashboard',   label: 'Progress',    icon: BarChart3 },
  { to: '/report',      label: 'Report',      icon: FileText },
  { to: '/motivate',    label: 'Motivate',    icon: Heart },
];

const AppNav = ({ compact = false, streak }) => {
  const { pathname } = useLocation();

  const streakVal = streak ?? (() => {
    try { return JSON.parse(localStorage.getItem('guruji_stats') || '{}').streak ?? 7; } catch { return 7; }
  })();

  if (compact) {
    return (
      <nav className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              pathname === to
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-gray-500 hover:text-indigo-800'
            }`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 flex-shrink-0">
      {/* Tricolor bar */}
      <div className="h-1 w-full flex">
        <span className="flex-1 bg-[#FF6B35]" />
        <span className="flex-1 bg-white" />
        <span className="flex-1 bg-[#138808]" />
      </div>
      <div className="max-w-6xl mx-auto px-3 h-14 flex items-center justify-between gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-900 to-indigo-700 flex items-center justify-center">
            <Sparkles className="text-orange-300 w-4 h-4" />
          </div>
          <span className="font-bold text-indigo-950 hidden sm:block text-sm">AI गुरुजी</span>
        </Link>

        {/* Nav Links — scrollable */}
        <div className="flex items-center gap-0.5 bg-gray-100 p-1 rounded-xl overflow-x-auto max-w-full">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                pathname === to
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-gray-500 hover:text-indigo-800 hover:bg-white/60'
              }`}
            >
              <Icon size={13} />
              <span className="hidden md:inline">{label}</span>
            </Link>
          ))}
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1 bg-orange-50 text-orange-800 px-2.5 py-1 rounded-full text-xs font-bold border border-orange-200/80 flex-shrink-0">
          <Flame size={12} className="text-orange-500" />
          <span>{streakVal}</span>
          <span className="hidden sm:inline">दिन</span>
        </div>
      </div>
    </nav>
  );
};

export default AppNav;
