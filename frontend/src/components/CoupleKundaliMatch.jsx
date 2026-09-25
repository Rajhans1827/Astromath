import { useState } from 'react';
import { Heart, Compass, CheckCircle2, AlertTriangle, UserCheck, Sparkles } from 'lucide-react';

export const CoupleKundaliMatch = ({ userProfile, lang = 'mr', t }) => {
  const [boy, setBoy] = useState({
    name: 'वर (Groom)',
    dob: '1998-05-18',
    tob: '10:30',
    city: 'Pune',
  });

  const [girl, setGirl] = useState({
    name: 'वधू (Bride)',
    dob: '1999-08-22',
    tob: '14:15',
    city: 'Mumbai',
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadMyProfileAsBoy = () => {
    if (!userProfile?.dob) return;
    setBoy({
      name: userProfile.name || 'वर (Groom)',
      dob: userProfile.dob,
      tob: userProfile.tob || '12:00',
      city: userProfile.city || 'Pune',
    });
  };

  const loadMyProfileAsGirl = () => {
    if (!userProfile?.dob) return;
    setGirl({
      name: userProfile.name || 'वधू (Bride)',
      dob: userProfile.dob,
      tob: userProfile.tob || '12:00',
      city: userProfile.city || 'Pune',
    });
  };

  const handleMatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/chart/kundali-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boy, girl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to match kundalis');
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
          <Heart className="w-5 h-5 text-rose-400" />
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {t.coupleKundali.title}
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-light">
          {t.coupleKundali.subtitle}
        </p>
      </div>

      {/* Input Form Cards */}
      <form onSubmit={handleMatch} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Groom (Boy) Card */}
          <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {t.coupleKundali.groomDetails}
              </span>
              {userProfile?.dob && (
                <button
                  type="button"
                  onClick={loadMyProfileAsBoy}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 transition-colors flex items-center gap-1"
                >
                  <UserCheck className="w-3 h-3" />
                  {t.coupleKundali.loadMyProfile}
                </button>
              )}
            </div>

            <div>
              <label className="text-slate-400 uppercase tracking-wider text-[9px]">{t.coupleKundali.name}</label>
              <input
                type="text"
                required
                value={boy.name}
                onChange={(e) => setBoy({ ...boy, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 text-xs outline-none focus:border-white/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 uppercase tracking-wider text-[9px]">{t.coupleKundali.dob}</label>
                <input
                  type="date"
                  required
                  value={boy.dob}
                  onChange={(e) => setBoy({ ...boy, dob: e.target.value })}
                  className="w-full px-2 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 text-xs outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="text-slate-400 uppercase tracking-wider text-[9px]">{t.coupleKundali.tob}</label>
                <input
                  type="time"
                  required
                  value={boy.tob}
                  onChange={(e) => setBoy({ ...boy, tob: e.target.value })}
                  className="w-full px-2 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 text-xs outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 uppercase tracking-wider text-[9px]">{t.coupleKundali.city}</label>
              <input
                type="text"
                required
                value={boy.city}
                onChange={(e) => setBoy({ ...boy, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 text-xs outline-none focus:border-white/30"
              />
            </div>
          </div>

          {/* Bride (Girl) Card */}
          <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-rose-300 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                {t.coupleKundali.brideDetails}
              </span>
              {userProfile?.dob && (
                <button
                  type="button"
                  onClick={loadMyProfileAsGirl}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-300 transition-colors flex items-center gap-1"
                >
                  <UserCheck className="w-3 h-3" />
                  {t.coupleKundali.loadMyProfile}
                </button>
              )}
            </div>

            <div>
              <label className="text-slate-400 uppercase tracking-wider text-[9px]">{t.coupleKundali.name}</label>
              <input
                type="text"
                required
                value={girl.name}
                onChange={(e) => setGirl({ ...girl, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 text-xs outline-none focus:border-white/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 uppercase tracking-wider text-[9px]">{t.coupleKundali.dob}</label>
                <input
                  type="date"
                  required
                  value={girl.dob}
                  onChange={(e) => setGirl({ ...girl, dob: e.target.value })}
                  className="w-full px-2 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 text-xs outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="text-slate-400 uppercase tracking-wider text-[9px]">{t.coupleKundali.tob}</label>
                <input
                  type="time"
                  required
                  value={girl.tob}
                  onChange={(e) => setGirl({ ...girl, tob: e.target.value })}
                  className="w-full px-2 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 text-xs outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 uppercase tracking-wider text-[9px]">{t.coupleKundali.city}</label>
              <input
                type="text"
                required
                value={girl.city}
                onChange={(e) => setGirl({ ...girl, city: e.target.value })}
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
              <span>{t.coupleKundali.calculating}</span>
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>{t.coupleKundali.calculateBtn}</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Match Result Output */}
      {result && result.match && (
        <div className="space-y-6 pt-2 animate-fadeIn">
          {/* Score & Verdict Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-1">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                {t.coupleKundali.totalScoreTitle}
              </span>
              <div className="flex items-baseline justify-center md:justify-start gap-2">
                <span className="text-5xl sm:text-6xl font-extrabold text-white font-mono">
                  {result.match.totalScore}
                </span>
                <span className="text-lg text-slate-400 font-mono">/ 36</span>
              </div>
              <div className="pt-1">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    result.match.totalScore >= 24
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : result.match.totalScore >= 18
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {lang === 'mr'
                    ? result.match.verdictMr
                    : lang === 'hi'
                    ? result.match.verdictHi
                    : result.match.verdictEn}
                </span>
              </div>
            </div>

            {/* Quick Profile Summary */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto text-xs">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <div className="text-[10px] text-amber-300 font-bold uppercase">{result.boy.name}</div>
                <div className="text-white font-medium">{result.boy.moonSign}</div>
                <div className="text-slate-400 text-[11px]">{result.boy.nakshatra} ({result.boy.pada} चरण)</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <div className="text-[10px] text-rose-300 font-bold uppercase">{result.girl.name}</div>
                <div className="text-white font-medium">{result.girl.moonSign}</div>
                <div className="text-slate-400 text-[11px]">{result.girl.nakshatra} ({result.girl.pada} चरण)</div>
              </div>
            </div>
          </div>

          {/* Manglik Analysis Card */}
          <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl flex items-center gap-3.5">
            {result.match.mangalAnalysis?.boyHasMangal || result.match.mangalAnalysis?.girlHasMangal ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {t.coupleKundali.mangalHeading}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 font-light">
                {lang === 'mr'
                  ? result.match.mangalAnalysis?.statusMr
                  : lang === 'hi'
                  ? result.match.mangalAnalysis?.statusHi
                  : result.match.mangalAnalysis?.statusEn}
              </p>
            </div>
          </div>

          {/* Ashta Koota 8-fold Table */}
          <div className="p-5 sm:p-7 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl space-y-4">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              {t.coupleKundali.kootaTableTitle}
            </h4>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">{t.coupleKundali.colKoota}</th>
                    <th className="py-2.5 px-3 text-center">{t.coupleKundali.colScored}</th>
                    <th className="py-2.5 px-3 text-center">{t.coupleKundali.colMax}</th>
                    <th className="py-2.5 px-3">{t.coupleKundali.colBoyAttr}</th>
                    <th className="py-2.5 px-3">{t.coupleKundali.colGirlAttr}</th>
                    <th className="py-2.5 px-3">{t.coupleKundali.colMeaning}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-light">
                  {result.match.kootas?.map((k, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">{k.name}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-300">
                        {k.score}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                        {k.max}
                      </td>
                      <td className="py-2.5 px-3 text-slate-200 whitespace-nowrap">{k.boy}</td>
                      <td className="py-2.5 px-3 text-slate-200 whitespace-nowrap">{k.girl}</td>
                      <td className="py-2.5 px-3 text-slate-300 text-[11px] max-w-xs">
                        {lang === 'mr' ? k.descMr : lang === 'hi' ? k.descHi : k.descEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoupleKundaliMatch;
