import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, User, Bot, Sparkles, ChevronLeft } from 'lucide-react';

const MessageBubble = ({ text, sender, agentId }) => {
  const isStudent = sender === 'student';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isStudent ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex max-w-[80%] ${isStudent ? 'flex-row-reverse' : 'flex-row'} items-end`}>
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isStudent ? 'bg-orange-500 ml-2' : 'bg-indigo-800 mr-2 shadow-lg shadow-indigo-200'}`}>
          {isStudent ? <User size={18} className="text-white" /> : <Bot size={18} className="text-white" />}
        </div>
        
        <div className="flex flex-col">
          {!isStudent && (
            <span className="text-[10px] text-indigo-600 font-bold mb-1 ml-1 uppercase tracking-wider">
               {agentId === 'doubt_solver' ? '🛡️ AI गुरुजी (Doubt Solver)' : '🤖 AI सहायक'}
            </span>
          )}
          <div className={`px-4 py-3 rounded-2xl shadow-sm ${
            isStudent 
              ? 'bg-orange-500 text-white rounded-br-none' 
              : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
          }`}>
            {isStudent ? (
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{text}</p>
            ) : (
              <div
                className="guruji-message text-sm md:text-base leading-relaxed"
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
      text: "नमस्ते! मैं हूँ आपका AI गुरुजी। आज आप क्या पढ़ना चाहते हैं? आप मुझसे गणित, विज्ञान या किसी भी विषय में अपना Doubt पूछ सकते हैं।",
      sender: 'guru',
      agentId: 'doubt_solver'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const studentMessage = {
      id: Date.now(),
      text: input,
      sender: 'student'
    };

    setMessages(prev => [...prev, studentMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      if (!response.ok) throw new Error('Backend link error');
      
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: data.response,
        sender: 'guru',
        agentId: data.agent_id
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "माफ़ कीजिये, तकनीकी खराबी के कारण मैं जवाब नहीं दे पा रहा हूँ। कृपया इंटरनेट चेक करें।",
        sender: 'guru',
        agentId: 'doubt_solver'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Browser voice recognition support nahi karta.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInput(text);
    };
    recognition.start();
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F7FB] font-['Noto_Sans_Devanagari']">
      {/* Header */}
      <header className="bg-white border-b px-4 py-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-full md:hidden">
            <ChevronLeft size={20} />
          </button>
          <div className="bg-indigo-900 p-2 rounded-xl">
             <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-indigo-900">AI गुरुजी</h1>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-gray-500 font-medium tracking-wide">ऑनलाइन • आपकी सेवा में</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold border border-orange-200">
           🔥 5 Days Streak
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} {...msg} />
          ))}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t p-4 md:p-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center gap-2">
            <button 
              onClick={startVoice}
              className="p-3 bg-gray-100 hover:bg-orange-100 text-gray-500 hover:text-orange-600 rounded-xl transition-colors"
            >
              <Mic size={24} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="अपना सवाल यहाँ लिखें..."
              className="flex-1 bg-gray-50 border border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-2xl py-3 px-4 outline-none transition-all text-base"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`p-3 rounded-xl transition-all ${
                input.trim() 
                  ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-100 scale-100' 
                  : 'bg-gray-200 text-gray-400 scale-95 opacity-50'
              }`}
            >
              <Send size={24} />
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-3 font-medium tracking-wide">
            UP Board Class 9-12 के लिए विशेष रूप से निर्मित • AI गुरुजी
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
