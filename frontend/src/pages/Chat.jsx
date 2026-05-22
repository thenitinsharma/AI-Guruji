import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Send,
  Mic,
  User,
  Bot,
  Sparkles,
  ChevronLeft,
  Home,
  Flame,
} from 'lucide-react';

const QUICK_PROMPTS = [
  'Pythagoras theorem samjhao',
  'Photosynthesis kya hai?',
  'भारत की नदियाँ',
  'Quadratic equation solve karo',
];

const WELCOME_HTML = `<div class="guruji-response">
  <h3>📌 स्वागत है!</h3>
  <p>नमस्ते! मैं हूँ आपका <strong>AI गुरुजी</strong>। गणित, विज्ञान या किसी भी विषय में अपना doubt पूछें।</p>
  <div class="example-box">
    <h4>💡 शुरू करने के लिए</h4>
    <p>नीचे दिए गए topics पर tap करें, या अपना सवाल लिखें / mic से बोलें।</p>
  </div>
  <p class="closing">Koi aur sawal ho toh zaroor poochho! 😊</p>
</div>`;

const MessageBubble = ({ text, sender, agentId }) => {
  const isStudent = sender === 'student';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isStudent ? 'justify-end' : 'justify-start'} mb-5`}
    >
      <div
        className={`flex max-w-[88%] sm:max-w-[80%] ${
          isStudent ? 'flex-row-reverse' : 'flex-row'
        } items-end gap-2`}
      >
        <div
          className={`flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center shadow-md ${
            isStudent
              ? 'bg-gradient-to-br from-orange-500 to-amber-500'
              : 'bg-gradient-to-br from-indigo-900 to-indigo-700 shadow-indigo-200/50'
          }`}
        >
          {isStudent ? (
            <User size={17} className="text-white" />
          ) : (
            <Bot size={17} className="text-white" />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          {!isStudent && (
            <span className="text-[10px] text-indigo-600 font-bold mb-1 ml-1 uppercase tracking-wider">
              {agentId === 'doubt_solver' ? '🛡️ AI गुरुजी' : '🤖 AI सहायक'}
            </span>
          )}
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm ${
              isStudent
                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-md'
                : 'bg-white text-gray-800 rounded-bl-md border border-gray-100/80'
            }`}
          >
            {isStudent ? (
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{text}</p>
            ) : (
              <div
                className="guruji-message text-sm md:text-base leading-relaxed guruji-response"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: WELCOME_HTML,
      sender: 'guru',
      agentId: 'doubt_solver',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const studentMessage = {
      id: Date.now(),
      text: trimmed,
      sender: 'student',
    };

    setMessages((prev) => [...prev, studentMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) throw new Error('Backend link error');

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: data.response,
          sender: 'guru',
          agentId: data.agent_id,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `<div class="guruji-response"><h3>⚠️ तकनीकी समस्या</h3><p>माफ़ कीजिये — backend se connect nahi ho paaya। Backend <code>python main.py</code> se chalayein aur dubara try karein।</p></div>`,
          sender: 'guru',
          agentId: 'doubt_solver',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => sendMessage(input);

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Browser voice recognition support nahi karta.');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
    recognition.start();
  };

  const showQuickPrompts = messages.length <= 1;

  return (
    <div className="flex flex-col h-screen bg-[#F0F4FA]">
      <div className="h-1 w-full flex flex-shrink-0">
        <span className="flex-1 bg-[#FF6B35]" />
        <span className="flex-1 bg-white" />
        <span className="flex-1 bg-[#138808]" />
      </div>

      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 hover:text-indigo-900 transition-colors"
            title="Home"
          >
            <ChevronLeft size={22} className="sm:hidden" />
            <Home size={20} className="hidden sm:block" />
          </Link>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-900 to-indigo-700 flex items-center justify-center shadow-md">
            <Sparkles className="text-orange-300" size={20} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-indigo-950 leading-tight">
              AI गुरुजी
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[11px] text-gray-500 font-medium">ऑनलाइन • Doubt Solver</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-800 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-orange-200/80">
          <Flame size={14} className="text-orange-500" />
          5 Day Streak
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-6">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} {...msg} />
          ))}

          {showQuickPrompts && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 justify-center mb-6 px-1"
            >
              <p className="w-full text-center text-xs text-gray-400 font-medium mb-1">
                Popular topics — tap to ask
              </p>
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={isTyping}
                  className="text-xs sm:text-sm font-medium bg-white border border-indigo-100 text-indigo-800 px-4 py-2 rounded-full hover:bg-indigo-50 hover:border-indigo-200 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </motion.div>
          )}

          {isTyping && (
            <div className="flex justify-start mb-4 pl-11">
              <div className="bg-white px-5 py-3.5 rounded-2xl rounded-bl-md border border-gray-100 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <span className="text-xs text-gray-400 mr-2 font-medium">Guruji soch rahe hain</span>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white/95 backdrop-blur border-t border-gray-100 px-4 py-4 md:px-6 md:py-5 pb-6 sm:pb-5">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={startVoice}
              className="p-3 bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-orange-600 rounded-xl border border-gray-100 transition-colors flex-shrink-0"
              aria-label="Voice input"
            >
              <Mic size={22} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="अपना सवाल यहाँ लिखें..."
              className="flex-1 bg-gray-50 border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 rounded-2xl py-3 px-4 outline-none transition-all text-base min-w-0"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                input.trim() && !isTyping
                  ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-200/60 hover:bg-indigo-800'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={22} />
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
            UP Board Class 9–12 •{' '}
            <Link to="/" className="text-indigo-600 hover:underline">
              Home
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
