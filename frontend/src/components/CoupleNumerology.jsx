import { useState } from 'react';
import { Heart, Hash, Sparkles, UserCheck, Compass } from 'lucide-react';

export const CoupleNumerology = ({ userProfile, lang = 'mr', t }) => {
  const [partner1, setPartner1] = useState({
    name: userProfile?.name || 'Partner 1',
    dob: userProfile?.dob || '1998-05-18',
  });

  const [partner2, setPartner2] = useState({
    name: 'Partner 2',
    dob: '1999-08-22',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadMyProfile = () => {
    if (!userProfile?.dob) return;
    setPartner1({
      name: userProfile.name || 'Partner 1',
      dob: userProfile.dob,
    });
  };

  const handleMatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/chart/couple-numerology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partner1, partner2 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to match numerology');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {t.coupleNumerology.title}
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-light">
          {t.coupleNumerology.subtitle}
        </p>
      </div>

      {/* Input Form Cards */}
      <form onSubmit={handleMatch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Partner 1 Card */}
          <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {t.coupleNumerology.partner1}
              </span>
              {userProfile?.dob && (
                <button
                  type="button"
                  onClick={loadMyProfile}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 transition-colors flex items-center gap-1"
                >
                  <UserCheck className="w-3 h-3" />
                  माझे तपशील भरा
                </button>
              )}
            </div>

            <div>
              <label className="text-slate-400 uppercase tracking-wider text-[9px]">नाव (Name)</label>
              <input
                type="text"
                required
                value={partner1.name}
                onChange={(e) => setPartner1({ ...partner1, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 text-xs outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-slate-400 uppercase tracking-wider text-[9px]">जन्म तारीख (DOB)</label>
              <input
                type="date"
                required
                value={partner1.dob}
                onChange={(e) => setPartner1({ ...partner1, dob: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 text-xs outline-none focus:border-white/30"
              />
            </div>
          </div>

          {/* Partner 2 Card */}
          <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                {t.coupleNumerology.partner2}
              </span>
            </div>

            <div>
              <label className="text-slate-400 uppercase tracking-wider text-[9px]">नाव (Name)</label>
              <input
                type="text"
                required
                value={partner2.name}
                onChange={(e) => setPartner2({ ...partner2, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 text-xs outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="text-slate-400 uppercase tracking-wider text-[9px]">जन्म तारीख (DOB)</label>
              <input
                type="date"
                required
                value={partner2.dob}
                onChange={(e) => setPartner2({ ...partner2, dob: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 text-xs outline-none focus:border-white/30"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Compass className="w-4 h-4 animate-spin" />
              <span>तपासणी चालू आहे...</span>
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 text-purple-500 fill-purple-500" />
              <span>{t.coupleNumerology.checkMatchBtn}</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Results Output */}
      {result && (
        <div className="space-y-6 pt-2 animate-fadeIn">
          {/* Compatibility Score Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-1">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                {t.coupleNumerology.scoreTitle}
              </span>
              <div className="flex items-baseline justify-center md:justify-start gap-1">
                <span className="text-5xl sm:text-6xl font-extrabold text-white font-mono">
                  {result.compatibilityScore}
                </span>
                <span className="text-2xl text-purple-400 font-bold">%</span>
              </div>
              <div className="pt-1">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    result.compatibilityScore >= 80
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : result.compatibilityScore >= 65
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {lang === 'mr'
                    ? result.verdictMr
                    : lang === 'hi'
                    ? result.verdictHi
                    : result.verdictEn}
                </span>
              </div>
            </div>

            {/* Partner 1 & 2 Numbers Breakdown */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto text-xs">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="text-[10px] text-amber-300 font-bold uppercase">{result.partner1.name}</div>
                <div className="text-white font-bold text-sm">
                  मूलांक: {result.partner1.mulank} <span className="text-[11px] text-slate-400 font-normal">({result.partner1.mulankLord})</span>
                </div>
                <div className="text-slate-300 text-xs">
                  भाग्यांक: {result.partner1.bhagyank}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="text-[10px] text-purple-300 font-bold uppercase">{result.partner2.name}</div>
                <div className="text-white font-bold text-sm">
                  मूलांक: {result.partner2.mulank} <span className="text-[11px] text-slate-400 font-normal">({result.partner2.mulankLord})</span>
                </div>
                <div className="text-slate-300 text-xs">
                  भाग्यांक: {result.partner2.bhagyank}
                </div>
              </div>
            </div>
          </div>

          {/* Synergy Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                {t.coupleNumerology.mentalHarmony}
              </span>
              <div className="text-base font-bold text-emerald-300">
                {result.mentalHarmony}
              </div>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                मूलांकावरून दोघांच्या दैनंदिन स्वभावातील आकर्षण आणि विचारांची देवाणघेवाण ठरते.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                {t.coupleNumerology.destinyHarmony}
              </span>
              <div className="text-base font-bold text-purple-300">
                {result.destinyHarmony}
              </div>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                भाग्यांकावरून दीर्घकालीन आयुष्याचे उद्दिष्ट, सहकार्य आणि कौटुंबिक प्रगती निश्चित होते.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoupleNumerology;
