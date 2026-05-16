import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-sm mr-2 mt-1 flex-shrink-0 shadow-lg shadow-primary-500/30">
          🤖
        </div>
      )}
      <div
        className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-primary-600 text-white rounded-br-sm'
            : 'glass text-gray-200 rounded-bl-sm border border-primary-500/20'
        }`}
      >
        {message.content.split('\n').map((line, i) => {
          if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={i} className="font-semibold text-primary-300 mb-1">{line.replace(/\*\*/g, '')}</p>;
          }
          if (line.startsWith('•') || line.startsWith('-')) {
            return <p key={i} className="ml-2 mb-0.5">{line}</p>;
          }
          if (line.startsWith('✅') || line.startsWith('🌾') || line.startsWith('💰') || line.startsWith('❄️') || line.startsWith('🌱') || line.startsWith('📊')) {
            return <p key={i} className="mb-0.5">{line}</p>;
          }
          return line ? <p key={i} className="mb-0.5">{line}</p> : <br key={i} />;
        })}
        <span className="text-xs opacity-50 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '🌿 Namaste! I\'m AgriBot, your AI agricultural assistant.\n\nI can help you with crop recommendations, price predictions, storage tips, and much more!\n\nWhat would you like to know today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    'Best crops for this season?',
    'Wheat price prediction',
    'Cold storage tips for onions',
    'Government schemes for farmers'
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (messageText) => {
    const text = messageText || input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setSuggestions([]);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      const res = await api.post('/api/chatbot/chat', { message: text, history });
      
      const botMsg = {
        role: 'assistant',
        content: res.data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        role: 'assistant',
        content: '❌ Sorry, I\'m having trouble connecting right now. Please check your connection and try again. In the meantime, you can use the AI Prediction Dashboard for crop insights!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary-600 to-emerald-500 rounded-2xl shadow-xl shadow-primary-500/40 flex items-center justify-center text-2xl hover:shadow-primary-500/60 transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 0 } : { rotate: 0 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>✕</motion.span>
          ) : (
            <motion.span key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>🤖</motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Unread badge */}
      {!isOpen && (
        <div className="fixed bottom-[68px] right-6 z-50 w-5 h-5 bg-primary-500 rounded-full border-2 border-dark-900 flex items-center justify-center">
          <span className="text-white text-xs font-bold">1</span>
        </div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] h-[520px] flex flex-col glass rounded-2xl border border-primary-500/20 shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Header */}
            <div className="glass-green px-4 py-3 flex items-center gap-3 border-b border-primary-500/20">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-lg shadow-lg shadow-primary-500/40">
                🤖
              </div>
              <div className="flex-1">
                <h3 className="text-white font-display font-semibold text-sm">AgriBot AI</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-pulse" />
                  <span className="text-primary-400 text-xs">Online · Agricultural Expert</span>
                </div>
              </div>
              <button
                onClick={() => setMessages([messages[0]])}
                className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
                title="Clear chat"
              >
                Clear
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start mb-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-sm mr-2 mt-1">🤖</div>
                  <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm border border-primary-500/20">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && messages.length <= 1 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 glass border border-primary-500/20 text-primary-300 rounded-full hover:border-primary-400/40 hover:text-primary-200 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-white/5">
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about crops, prices, storage..."
                  rows={1}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500/50 resize-none transition-all"
                  style={{ maxHeight: '100px', overflowY: 'auto' }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all hover:shadow-lg hover:shadow-primary-500/30 flex-shrink-0"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
