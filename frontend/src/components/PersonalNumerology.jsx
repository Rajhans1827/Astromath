import { useState, useEffect } from 'react';
import { Sparkles, Hash, Star, Compass, RefreshCw } from 'lucide-react';

export const PersonalNumerology = ({ birthData, lang = 'mr', t }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNumerology = async () => {
    if (!birthData?.dob) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/chart/numerology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: birthData.name || '',
          dob: birthData.dob,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to load numerology');
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNumerology();
  }, [birthData?.dob, birthData?.name]);

  if (loading) {
    return (
      <div className="p-10 text-center rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center">
        <Compass className="w-8 h-8 text-amber-300 animate-spin mb-3" />
        <p className="text-sm font-medium text-white">अंकशास्त्र गणना चालू आहे...</p>
        <p className="text-xs text-slate-400 mt-1">मूलांक, भाग्यांक आणि नामांक तपासत आहोत.</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center rounded-3xl bg-white/[0.03] border border-white/10">
        <p className="text-xs text-rose-300">{error || 'अंकशास्त्र माहिती लोड होऊ शकली नाही.'}</p>
        <button
          onClick={fetchNumerology}
          className="mt-3 px-4 py-1.5 rounded-full bg-white text-slate-950 font-bold text-xs"
        >
          पुन्हा प्रयत्न करा
        </button>
      </div>
    );
  }

  const personalityText =
    lang === 'mr' ? data.personalitySummary : lang === 'hi' ? data.personalityHi : data.personalityEn;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-amber-300" />
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {t.numerology.title}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-light">
            {t.numerology.subtitle}
          </p>
        </div>
        <button
          onClick={fetchNumerology}
          className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition-colors self-start md:self-auto"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Core Numbers Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Mulank */}
        <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            {t.numerology.mulankTitle}
          </span>
          <div className="text-4xl font-extrabold text-amber-300 font-mono mt-2">
            {data.mulank}
          </div>
          <div className="mt-2 text-xs text-slate-300 font-medium">
            <span className="text-slate-400">{t.numerology.rulingPlanet}: </span>
            <span className="text-white font-bold">{data.mulankLord}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-light">
            जन्म दिनांकाची बेरीज (स्वभाव आणि मूळ प्रवृत्ती).
          </p>
        </div>

        {/* Bhagyank */}
        <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            {t.numerology.bhagyankTitle}
          </span>
          <div className="text-4xl font-extrabold text-purple-300 font-mono mt-2">
            {data.bhagyank}
          </div>
          <div className="mt-2 text-xs text-slate-300 font-medium">
            <span className="text-slate-400">{t.numerology.rulingPlanet}: </span>
            <span className="text-white font-bold">{data.bhagyankLord}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-light">
            संपूर्ण जन्मतारखेची बेरीज (जीवनाचा मुख्य मार्ग व भविष्य).
          </p>
        </div>

        {/* Namank */}
        <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            {t.numerology.namankTitle}
          </span>
          <div className="text-4xl font-extrabold text-emerald-300 font-mono mt-2">
            {data.namank}
          </div>
          <div className="mt-2 text-xs text-slate-300 font-medium">
            <span className="text-slate-400">नावाचे कंपन: </span>
            <span className="text-white font-bold">{data.name}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-light">
            चाल्डियन अंकशास्त्रानुसार नावाची शक्ती.
          </p>
        </div>
      </div>

      {/* Lucky Attributes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            {t.numerology.luckyDays}
          </span>
          <div className="font-bold text-white text-xs sm:text-sm mt-1">
            {data.luckyDays?.join(', ')}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            {t.numerology.luckyColors}
          </span>
          <div className="font-bold text-amber-200 text-xs sm:text-sm mt-1">
            {data.luckyColors?.join(', ')}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            {t.numerology.luckyGem}
          </span>
          <div className="font-bold text-emerald-300 text-xs sm:text-sm mt-1">
            {data.gemstone}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
            {t.numerology.friendlyNums}
          </span>
          <div className="font-bold text-white font-mono text-xs sm:text-sm mt-1">
            {data.friendlyNumbers?.join(', ')}
          </div>
        </div>
      </div>

      {/* Personality & Strengths */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl space-y-3">
        <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          {t.numerology.personalityHeading}
        </h4>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
          {personalityText}
        </p>
      </div>
    </div>
  );
};

export default PersonalNumerology;
