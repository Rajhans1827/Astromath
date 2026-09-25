import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';

export default function AIChatbot({ chartData, nativeName = 'User' }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `नमस्कार ${nativeName}! मी तुमचा वैदिक AI ज्योतिषी (AstroMath Brain). तुमची कुंडली, चालू महादशा आणि आजचे गोचर माझ्याकडे अचूक उपलब्ध आहेत. करिअर, विवाह, साडेसाती किंवा आजच्या दिवसाविषयी तुम्हाला काय विचारायचे आहे?`,
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
          history: messages.slice(-6), // Send last 6 messages for conversation context
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'AI response failed');
      }

      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.message);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'क्षमस्व, उत्तर मिळवण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा किंवा तुमचा प्रश्न स्पष्ट विचारा.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'माझ्या करिअरमध्ये पुढील ६ महिन्यांत काय बदल होतील?',
    'माझ्या कुंडलीत मंगळ दोष आहे का? विवाहाचा काळ कधी आहे?',
    'सध्याच्या महादशेत मला कोणती काळजी घेतली पाहिजे?',
    'आजचा दिवस माझ्यासाठी कोणत्या कामांसाठी सर्वोत्तम आहे?',
  ];

  return (
    <div className="flex flex-col h-[650px] rounded-3xl cosmic-glass border border-amber-500/25 overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="p-4 px-6 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cinzel font-bold text-white text-base flex items-center gap-2">
              AstroMath AI Brain
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Gemini 3.8 Flash • Zero Hallucination
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic Swiss Ephemeris data + Vedic Interpretation
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
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
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-purple-600/30 border border-purple-500/40 text-purple-300'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none prose prose-invert max-w-none'
              }`}
              style={{ whiteSpace: 'pre-line' }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-slate-900/90 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              ग्रहांचे गणित आणि दशा तपासून अचूक विश्लेषण तयार करत आहे...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-6 py-2 bg-slate-950/60 border-t border-slate-900 flex gap-2 overflow-x-auto text-xs no-scrollbar">
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => setInput(q)}
            className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-amber-500/40 shrink-0 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 bg-slate-900/90 border-t border-slate-800 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="कुंडलीबद्दल कोणताही प्रश्न विचारा (उदा. नोकरी, लग्न, चालू दशा, व्यवसाय)..."
          className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>विचारा</span>
        </button>
      </form>
    </div>
  );
}
