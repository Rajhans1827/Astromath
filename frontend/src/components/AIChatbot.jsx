import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function AIChatbot({ chartData, nativeName = 'Seeker' }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Greetings, ${nativeName}. Your planetary coordinates, divisional matrices, and current planetary periods are active. What celestial guidance do you seek today? You may ask about your career trajectory, relationships, favorable timing, or the nature of your current planetary cycle.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setError('');

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage,
          chartData: chartData,
          history: messages.slice(-6),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Consultation unavailable');

      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.message);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'I apologize; I could not connect with the celestial matrix at this moment. Please rephrase your question or try again shortly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'What shifts are indicated in my career over the next 6 months?',
    'What insights does my 7th house and Venus placement reveal about partnership?',
    'How does my currently active planetary era influence my life direction?',
    'What focus or disciplines are most auspicious for today?',
  ];

  return (
    <div className="flex flex-col h-[660px] rounded-3xl bg-[#080B14] border border-amber-500/20 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-5 px-6 bg-slate-950/80 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-purple-500 to-amber-200 p-[1px] shadow-lg shadow-amber-500/10">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
          </div>
          <div>
            <h3 className="font-cinzel font-bold text-white text-base tracking-wide flex items-center gap-2">
              AstroMath Oracle
              <span className="text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                Vedic Synthesis
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Personalized consultation grounded in your verified celestial coordinates
            </p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs ${
                msg.role === 'user'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-purple-500/15 border border-purple-500/30 text-purple-300'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-semibold rounded-tr-none'
                  : 'bg-slate-900/90 border border-white/5 text-slate-200 rounded-tl-none font-normal'
              }`}
              style={{ whiteSpace: 'pre-line' }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-900/90 border border-white/5 text-slate-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Consulting your planetary alignment and harmonic matrices...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="px-6 py-2.5 bg-slate-950/60 border-t border-white/5 flex gap-2 overflow-x-auto text-xs no-scrollbar">
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => setInput(q)}
            className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/5 hover:border-amber-400/40 shrink-0 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-white/5 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask regarding your destiny, career timing, marriage, or daily transit..."
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Consult</span>
        </button>
      </form>
    </div>
  );
}
