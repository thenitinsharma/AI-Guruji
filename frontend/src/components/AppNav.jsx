import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, MessageCircle, ClipboardList, Heart } from 'lucide-react';

const links = [
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/quiz', label: 'Quiz', icon: ClipboardList },
  { to: '/motivate', label: 'Motivate', icon: Heart },
];

const AppNav = ({ compact = false }) => {
  const { pathname } = useLocation();

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
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="h-1 w-full flex">
        <span className="flex-1 bg-[#FF6B35]" />
        <span className="flex-1 bg-white" />
        <span className="flex-1 bg-[#138808]" />
      </div>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-900 to-indigo-700 flex items-center justify-center">
            <Sparkles className="text-orange-300 w-4 h-4" />
          </div>
          <span className="font-bold text-indigo-950 hidden sm:block">AI गुरुजी</span>
        </Link>
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                pathname === to
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-gray-500 hover:text-indigo-800'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AppNav;
