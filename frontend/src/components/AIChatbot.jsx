import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function AIChatbot({ chartData, nativeName = 'Seeker', lang = 'mr', t }) {
  const getInitialGreeting = () => {
    if (lang === 'mr') {
      return `नमस्कार ${nativeName || ''}! तुमच्या पत्रिकेचा अभ्यास करून मी थेट, साध्या आणि स्पष्ट शब्दांत मार्गदर्शन करण्यास तयार आहे. तुम्हाला करिअर, विवाह किंवा आजच्या दिवसाबद्दल काय विचारायचे आहे?`;
    }
    if (lang === 'hi') {
      return `नमस्ते ${nativeName || ''}! आपकी कुंडली के आधार पर सरल और सटीक मार्गदर्शन देने के लिए मैं तैयार हूँ। आप अपने करियर, विवाह या आज के दिन के बारे में कोई भी प्रश्न पूछ सकते हैं।`;
    }
    return `Hello ${nativeName || ''}! I am here to share direct, friendly astrological advice based on your verified birth chart. What would you like to know about your career, relationships, or today's horoscope?`;
  };

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: getInitialGreeting(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Update greeting when language changes if there is only 1 message
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([{ role: 'assistant', content: getInitialGreeting() }]);
    }
  }, [lang]);

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
          history: messages.slice(-4),
          lang: lang || 'mr',
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
          content: lang === 'mr'
            ? 'माफ करा, सध्या संपर्क होऊ शकला नाही. कृपया थोड्या वेळाने पुन्हा विचारून पहा.'
            : lang === 'hi'
            ? 'क्षमा करें, अभी संपर्क नहीं हो सका। कृपया कुछ समय बाद पुनः प्रयास करें।'
            : 'Apologies, could not connect right now. Please try asking again shortly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = t?.chat?.samplePrompts || [
    'माझ्या करिअरमध्ये पुढील ६ महिन्यांत काय प्रगती दिसेल?',
    'माझे वैवाहिक जीवन कसे राहील?',
    'माझी सध्या कोणती महादशा चालू आहे आणि तिचा काय परिणाम होईल?',
    'आजचा दिवस माझ्यासाठी कसा आहे?',
  ];

  return (
    <div className="flex flex-col h-[650px] rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 sm:p-5 px-6 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-white shadow-inner">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base tracking-tight flex items-center gap-2">
              {t?.chat?.title || 'AI ज्योतिषी सल्ला'}
            </h3>
            <p className="text-xs text-slate-400 font-light">
              {t?.chat?.subtitle || 'थेट तुमच्या कुंडलीवर आधारित साध्या शब्दांत मार्गदर्शन'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
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
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'bg-white/[0.08] border border-white/15 text-slate-200'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-white text-slate-950 font-semibold rounded-tr-none shadow-lg'
                  : 'bg-white/[0.04] backdrop-blur-xl border border-white/10 text-slate-200 rounded-tl-none font-light'
              }`}
              style={{ whiteSpace: 'pre-line' }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/15 text-slate-200 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-white/[0.04] border border-white/10 text-slate-300 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              {t?.chat?.typing || 'ज्योतिषी तुमच्या पत्रिकेचा अभ्यास करत आहेत...'}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="px-4 sm:px-6 py-2.5 bg-white/[0.01] border-t border-white/5 flex gap-2 overflow-x-auto text-xs no-scrollbar">
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => setInput(q)}
            className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-all shrink-0 font-medium text-[11px]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white/[0.02] border-t border-white/10 flex gap-2 sm:gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t?.chat?.placeholder || 'तुमचा प्रश्न येथे विचारा...'}
          className="flex-1 px-4 py-2.5 sm:py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-white/30 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-40 flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{t?.chat?.sendBtn || 'विचार'}</span>
        </button>
      </form>
    </div>
  );
}
