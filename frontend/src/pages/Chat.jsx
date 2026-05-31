import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mic, MicOff, User, Bot, Sparkles, Flame,
  Volume2, VolumeX, Copy, Trash2, Download, ChevronDown,
} from 'lucide-react';
import AppNav from '../components/AppNav';
import { apiPost } from '../lib/api';

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const AGENTS = [
  { id: 'doubt',      emoji: '🧑‍🏫', name: 'Doubt Solver',   hi: 'शंका समाधान' },
  { id: 'stepsolve',  emoji: '🧮',   name: 'Step Solver',    hi: 'हल करो' },
  { id: 'gap',        emoji: '🔍',   name: 'Gap Detector',   hi: 'कमज़ोरी खोजो' },
  { id: 'motivation', emoji: '🏆',   name: 'Motivation',     hi: 'प्रेरणा दो' },
  { id: 'story',      emoji: '📖',   name: 'Story Mode',     hi: 'कहानी से सीखो' },
  { id: 'parent',     emoji: '👨‍👩‍👧', name: 'Parent Report', hi: 'रिपोर्ट बनाओ' },
];

const MODES = [
  { id: 'hindi',    label: '🇮🇳 Hindi' },
  { id: 'hinglish', label: '🔀 Hinglish' },
  { id: 'simple',   label: '🧒 Simple' },
  { id: 'exam',     label: '📋 Exam' },
  { id: 'math',     label: '∑ Math' },
];

const QUICK_PROMPTS = [
  { label: '📐 Trigonometry', q: 'Trigonometry ke sin cos tan rules samjhao' },
  { label: 'x² Quadratic',   q: 'Quadratic equations solve karna sikhao step by step' },
  { label: '🌿 Photosynthesis', q: 'Photosynthesis Hindi mein simple explanation do' },
  { label: '⚙️ Newton Laws', q: 'Newton ke teen niyam batao with examples' },
  { label: '🎯 Weak Topic',  q: 'Mera weak topic batao aur ek study plan do' },
  { label: '🏆 90% kaise?',  q: 'Mujhe exam mein 90% marks kaise milenge?' },
];

const AGENT_WELCOMES = {
  doubt:      'नमस्ते! कौन सा topic समझना है? 📚',
  stepsolve:  'कोई भी Math/Science problem दो — मैं step-by-step solve करूँगा! 🧮',
  gap:        'अपनी performance के बारे में बताओ — मैं weak spots find करूँगा! 🔍',
  motivation: 'Hey superstar! आज क्या पढ़ा? चलो पढ़ाई करते हैं! 🔥',
  story:      'कौन सा concept story mode में समझना है? 📖✨',
  parent:     'Student की info दो — professional report बनाता हूँ! 📋',
};

const WELCOME_HTML = `<div class="guruji-response">
  <h3>📌 स्वागत है!</h3>
  <p>नमस्ते! मैं हूँ आपका <strong>AI गुरुजी</strong>। ऊपर Agent और Mode चुनकर शुरू करें।</p>
  <div class="example-box">
    <h4>💡 शुरू करने के लिए</h4>
    <p>नीचे दिए गए topics पर tap करें, या खुद लिखें / mic से बोलें।</p>
  </div>
  <p class="closing">Koi bhi sawal poochho — hum yahan hain! 😊</p>
</div>`;

// ── CONFETTI ──────────────────────────────────────────────────────────────────
function launchConfetti(mini = false) {
  const canvas = document.getElementById('guruji-confetti');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ['#FF6B00', '#138808', '#FFD700', '#7C3AED', '#FF4444'];
  const count = mini ? 30 : 120;
  const particles = Array.from({ length: count }, () => ({
    x: mini ? canvas.width / 2 + (Math.random() - 0.5) * 200 : Math.random() * canvas.width,
    y: mini ? canvas.height * 0.6 : -10,
    vx: (Math.random() - 0.5) * (mini ? 5 : 4),
    vy: mini ? -(Math.random() * 4 + 2) : Math.random() * 4 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: mini ? 6 : Math.random() * 8 + 4,
    angle: Math.random() * 360,
    va: (Math.random() - 0.5) * 5,
    life: 1,
  }));
  let frame = 0;
  const maxFrames = mini ? 60 : 200;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (mini) p.vy += 0.1;
      else { p.angle += p.va; p.life -= 0.012; }
      if (mini) p.life -= 0.03;
      if (p.life <= 0 || p.y > canvas.height) return;
      ctx.save();
      ctx.globalAlpha = p.life;
      if (!mini) { ctx.translate(p.x, p.y); ctx.rotate((p.angle * Math.PI) / 180); }
      ctx.fillStyle = p.color;
      ctx.fillRect(mini ? p.x : -p.size / 2, mini ? p.y : -p.size / 2, p.size, p.size / 2);
      ctx.restore();
    });
    frame++;
    if (frame < maxFrames) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  animate();
}

// ── MESSAGE BUBBLE ────────────────────────────────────────────────────────────
const MessageBubble = ({ text, sender, agentId, onSpeak, onCopy }) => {
  const isStudent = sender === 'student';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22 }}
      className={`flex ${isStudent ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex max-w-[88%] sm:max-w-[80%] ${isStudent ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        <div className={`flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center shadow-md ${
          isStudent
            ? 'bg-gradient-to-br from-orange-500 to-amber-500'
            : 'bg-gradient-to-br from-indigo-900 to-indigo-700 shadow-indigo-200/50'
        }`}>
          {isStudent ? <User size={17} className="text-white" /> : <Bot size={17} className="text-white" />}
        </div>

        <div className="flex flex-col min-w-0">
          {!isStudent && (
            <span className="text-[10px] text-indigo-600 font-bold mb-1 ml-1 uppercase tracking-wider">
              {AGENTS.find(a => a.id === agentId)?.emoji || '🤖'}{' '}
              {AGENTS.find(a => a.id === agentId)?.name || 'AI गुरुजी'}
            </span>
          )}
          <div className={`px-4 py-3 rounded-2xl shadow-sm ${
            isStudent
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-md'
              : 'bg-white text-gray-800 rounded-bl-md border border-gray-100/80'
          }`}>
            {isStudent ? (
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{text}</p>
            ) : (
              <div
                className="guruji-message text-sm md:text-base leading-relaxed guruji-response"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
          </div>
          {!isStudent && (
            <div className="flex gap-1 mt-1 ml-1">
              <button
                onClick={() => onSpeak(text)}
                className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                title="TTS — सुनो"
              >
                <Volume2 size={13} />
              </button>
              <button
                onClick={() => onCopy(text)}
                className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                title="Copy"
              >
                <Copy size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ── MAIN CHAT COMPONENT ───────────────────────────────────────────────────────
const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: WELCOME_HTML, sender: 'guru', agentId: 'doubt' },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentAgent, setCurrentAgent] = useState('doubt');
  const [currentMode, setCurrentMode] = useState('hindi');
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showVoiceViz, setShowVoiceViz] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const textareaRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(scrollToBottom, [messages, isTyping]);

  // ── TTS ──────────────────────────────────────────────────────────────────
  const speak = useCallback((rawHtml) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const text = rawHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 300);
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'hi-IN';
    utt.rate = 0.9;
    synthRef.current.speak(utt);
  }, []);

  const copyText = useCallback((rawHtml) => {
    const text = rawHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    navigator.clipboard.writeText(text).then(() => {
      setMessages(prev => [...prev, { id: Date.now(), text: '✅ Copied to clipboard!', sender: 'system' }]);
    });
  }, []);

  // ── VOICE INPUT ──────────────────────────────────────────────────────────
  const startVoice = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Chrome browser use karein — voice support chahiye.'); return; }
    const rec = new SR();
    rec.lang = 'hi-IN';
    rec.interimResults = true;
    rec.continuous = false;
    recognitionRef.current = rec;
    rec.onresult = (e) => {
      let transcript = '';
      for (let i = e.resultIndex; i < e.results.length; i++) transcript += e.results[i][0].transcript;
      setInput(transcript);
    };
    rec.onend = () => { setIsRecording(false); setShowVoiceViz(false); };
    rec.onerror = (e) => {
      setIsRecording(false); setShowVoiceViz(false);
      if (e.error !== 'aborted') console.error('Voice error:', e.error);
    };
    rec.start();
    setIsRecording(true);
    setShowVoiceViz(true);
  }, []);

  const stopVoice = useCallback(() => {
    try { recognitionRef.current?.stop(); } catch (_) {}
    setIsRecording(false);
    setShowVoiceViz(false);
  }, []);

  const toggleVoice = () => (isRecording ? stopVoice() : startVoice());

  // ── SEND MESSAGE ─────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isTyping) return;
    setMessages(prev => [...prev, { id: Date.now(), text: trimmed, sender: 'student' }]);
    setInput('');
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; }
    setIsTyping(true);
    try {
      const data = await apiPost('/chat', { message: trimmed, agent: currentAgent, mode: currentMode });
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.response,
        sender: 'guru',
        agentId: data.agent_id,
      }]);
      if (ttsEnabled) speak(data.response);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `<div class="guruji-response"><h3>⚠️ तकनीकी समस्या</h3><p>Backend se connect nahi ho paaya। <code>python main.py</code> se chalayein aur dobara try karein।</p></div>`,
        sender: 'guru',
        agentId: currentAgent,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ── AGENT SWITCH ─────────────────────────────────────────────────────────
  const selectAgent = (agentId) => {
    setCurrentAgent(agentId);
    setMessages([{
      id: Date.now(),
      text: `<div class="guruji-response"><p>${AGENT_WELCOMES[agentId]}</p></div>`,
      sender: 'guru',
      agentId,
    }]);
  };

  // ── EXPORT / CLEAR ───────────────────────────────────────────────────────
  const exportChat = () => {
    const text = messages
      .map(m => `[${m.sender.toUpperCase()}]: ${m.text.replace(/<[^>]+>/g, ' ').trim()}`)
      .join('\n\n');
    const a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
    a.download = 'ai-guruji-chat.txt';
    a.click();
  };

  const clearChat = () => {
    setMessages([{ id: Date.now(), text: WELCOME_HTML, sender: 'guru', agentId: currentAgent }]);
  };

  // ── AUTO-RESIZE TEXTAREA ─────────────────────────────────────────────────
  const autoResize = (el) => {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const streak = (() => {
    try { return JSON.parse(localStorage.getItem('guruji_stats') || '{}').streak ?? 7; } catch { return 7; }
  })();

  return (
    <div className="flex flex-col h-screen bg-[#F0F4FA]">
      {/* Global confetti canvas */}
      <canvas id="guruji-confetti" />

      <AppNav streak={streak} />

      {/* Chat Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-2 md:px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-900 to-indigo-700 flex items-center justify-center text-lg">
            {AGENTS.find(a => a.id === currentAgent)?.emoji || '🤖'}
          </div>
          <div>
            <h1 className="text-base font-bold text-indigo-950">
              {AGENTS.find(a => a.id === currentAgent)?.name || 'Doubt Solver'}
            </h1>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[10px] text-gray-500">ऑनलाइन • UP Board 9–12</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setTtsEnabled(p => !p); if (ttsEnabled) synthRef.current?.cancel(); }}
            className={`p-2 rounded-lg border text-xs font-bold transition-all ${
              ttsEnabled
                ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
            }`}
            title={ttsEnabled ? 'TTS ON — click to turn off' : 'TTS OFF'}
          >
            {ttsEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>
          <button
            onClick={exportChat}
            className="p-2 rounded-lg border bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 transition-all"
            title="Chat save karein"
          >
            <Download size={15} />
          </button>
          <button
            onClick={clearChat}
            className="p-2 rounded-lg border bg-gray-50 border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
            title="Chat clear karein"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </header>

      {/* Agent Selector */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex-shrink-0">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">🤖 Agent चुनो</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              onClick={() => selectAgent(agent.id)}
              className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border-2 transition-all text-center cursor-pointer ${
                currentAgent === agent.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/50'
              }`}
            >
              <span className="text-xl leading-none mb-0.5">{agent.emoji}</span>
              <span className="text-[10px] font-bold text-gray-800 whitespace-nowrap">{agent.name}</span>
              <span className="text-[9px] text-gray-400 font-medium" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{agent.hi}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Toolbar */}
      <div className="bg-gray-50 border-b border-gray-100 px-4 py-1.5 flex items-center gap-2 overflow-x-auto flex-shrink-0">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex-shrink-0">Mode:</span>
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setCurrentMode(m.id)}
            className={`flex-shrink-0 px-3 py-1 rounded-full border text-[11px] font-bold transition-all ${
              currentMode === m.id
                ? 'bg-orange-500 border-orange-500 text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Voice Visualizer */}
      <AnimatePresence>
        {showVoiceViz && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center gap-3 flex-shrink-0 overflow-hidden"
          >
            <div className="flex items-end gap-1 h-7">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="voice-bar" style={{ height: '6px' }} />
              ))}
            </div>
            <span className="text-xs font-bold text-red-600">🎙 सुन रहा हूँ... बोलो!</span>
            <button
              onClick={stopVoice}
              className="ml-auto bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-lg hover:bg-red-700"
            >
              ■ रोको
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 chat-scroll">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) =>
            msg.sender === 'system' ? (
              <div key={msg.id} className="text-center text-xs text-gray-400 py-1">{msg.text}</div>
            ) : (
              <MessageBubble
                key={msg.id}
                {...msg}
                onSpeak={speak}
                onCopy={copyText}
              />
            )
          )}

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 justify-center mb-4"
            >
              <p className="w-full text-center text-xs text-gray-400 font-medium mb-1">
                Popular topics — tap to ask
              </p>
              {QUICK_PROMPTS.map(({ label, q }) => (
                <button
                  key={label}
                  onClick={() => sendMessage(q)}
                  disabled={isTyping}
                  className="text-xs font-medium bg-white border border-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full hover:bg-indigo-50 hover:border-indigo-200 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Typing Indicator */}
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

      {/* Input Row */}
      <footer className="bg-white/95 backdrop-blur border-t border-gray-100 px-4 py-3 md:px-6 pb-6 sm:pb-3 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          <button
            type="button"
            onClick={toggleVoice}
            className={`p-3 rounded-xl border flex-shrink-0 transition-all ${
              isRecording
                ? 'bg-red-600 border-red-600 text-white recording-pulse'
                : 'bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-orange-600 border-gray-100'
            }`}
            aria-label="Voice input"
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(e.target); }}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="यहाँ सवाल लिखो... या 🎙 दबाओ"
            rows={1}
            className="flex-1 bg-gray-50 border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 rounded-2xl py-3 px-4 outline-none transition-all text-base min-w-0 resize-none"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            type="button"
            onClick={() => sendMessage()}
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
        <p className="text-center text-[10px] text-gray-400 mt-2 font-medium">
          UP Board Class 9–12 •{' '}
          <Link to="/" className="text-indigo-600 hover:underline">Home</Link>
        </p>
      </footer>
    </div>
  );
};

export default Chat;
