import { useState } from 'react';
import { Calendar, ChevronDown, ChevronRight, Clock, Sparkles } from 'lucide-react';

const dashaColors = {
  Ketu: '#F97316',
  Venus: '#F472B6',
  Sun: '#F59E0B',
  Moon: '#CBD5E1',
  Mars: '#EF4444',
  Rahu: '#A78BFA',
  Jupiter: '#FBBF24',
  Saturn: '#818CF8',
  Mercury: '#34D399',
};

export default function DashaTimeline({ dashaData = [] }) {
  const [expandedMaha, setExpandedMaha] = useState(null);

  if (!dashaData || dashaData.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10">
        No planetary cycle data available. Please generate your birth matrix.
      </div>
    );
  }

  const toggleMaha = (lord) => {
    setExpandedMaha(expandedMaha === lord ? null : lord);
  };

  const currentDasha = dashaData.find((d) => d.isCurrent) || dashaData[0];

  return (
    <div className="space-y-6">
      {/* Active Planetary Era */}
      {currentDasha && (
        <div className="relative overflow-hidden rounded-3xl bg-white/[0.03] backdrop-blur-2xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                <Clock className="w-3.5 h-3.5 text-white" />
                Active Planetary Era (Vimshottari Major Cycle)
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 tracking-tight">
                {currentDasha.lord} Era
                {currentDasha.currentAntar && (
                  <span className="text-slate-300 text-xl font-normal ml-3">
                    — {currentDasha.currentAntar} Sub-Period
                  </span>
                )}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 font-mono">
                Duration: {currentDasha.startDate} to {currentDasha.endDate}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-slate-950 font-bold text-xl shadow-xl shadow-black/40"
                style={{ backgroundColor: dashaColors[currentDasha.lord] || '#F59E0B' }}
              >
                {currentDasha.lord.substring(0, 2)}
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium">
                  <Sparkles className="w-3 h-3" /> Active Now
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 120-Year Horizon Bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5 font-mono">
          <span>120-Year Vimshottari Progression</span>
          <span>Birth to 120 Years</span>
        </div>
        <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-950 border border-white/10 p-0.5 shadow-inner">
          {dashaData.map((d) => (
            <div
              key={d.lord}
              className={`h-full relative group transition-all cursor-pointer ${
                d.isCurrent ? 'ring-2 ring-white z-10' : 'opacity-80 hover:opacity-100'
              }`}
              style={{
                width: `${(d.years / 120) * 100}%`,
                backgroundColor: dashaColors[d.lord] || '#94A3B8',
              }}
              onClick={() => toggleMaha(d.lord)}
              title={`${d.lord} (${d.years} yrs): ${d.startDate} - ${d.endDate}`}
            >
              <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[11px] rounded-lg px-2.5 py-1 whitespace-nowrap z-30 shadow-xl pointer-events-none font-mono">
                {d.lord} ({d.years}y) • {d.startDate} to {d.endDate}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Planetary Eras List */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white" />
          The Nine Planetary Eras (Click to inspect sub-cycles)
        </h4>

        {dashaData.map((d) => {
          const isExpanded = expandedMaha === d.lord;
          return (
            <div
              key={d.lord}
              className={`rounded-2xl border transition-all ${
                d.isCurrent
                  ? 'border-white/30 bg-white/[0.06] shadow-lg'
                  : 'border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
              }`}
            >
              <button
                onClick={() => toggleMaha(d.lord)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dashaColors[d.lord] || '#F59E0B' }}
                  />
                  <div>
                    <span className="font-semibold text-white mr-2 text-sm">{d.lord} Era</span>
                    <span className="text-xs text-slate-400">({d.years} Years)</span>
                    {d.isCurrent && (
                      <span className="ml-2.5 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                        Current
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                  <span>
                    {d.startDate} — {d.endDate}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Sub-cycles */}
              {isExpanded && d.antardashas && d.antardashas.length > 0 && (
                <div className="p-4 pt-1 border-t border-white/5 mt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
                    {d.antardashas.map((antar) => (
                      <div
                        key={antar.lord}
                        className={`p-3 rounded-xl text-xs border ${
                          antar.isCurrent
                            ? 'bg-white/[0.08] border-white/25 text-white font-medium shadow-sm'
                            : 'bg-black/30 border-white/5 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-medium">
                          <span>{d.lord} • {antar.lord}</span>
                          {antar.isCurrent && (
                            <span className="text-[10px] text-emerald-300 font-bold">Active</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-mono">
                          {antar.startDate} to {antar.endDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
