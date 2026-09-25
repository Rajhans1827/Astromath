import { useState } from 'react';
import { Calendar, ChevronDown, ChevronRight, Clock, Star } from 'lucide-react';

const dashaColors = {
  Ketu: '#F97316',
  Venus: '#EC4899',
  Sun: '#F59E0B',
  Moon: '#94A3B8',
  Mars: '#EF4444',
  Rahu: '#8B5CF6',
  Jupiter: '#EAB308',
  Saturn: '#6366F1',
  Mercury: '#10B981',
};

export default function DashaTimeline({ dashaData = [] }) {
  const [expandedMaha, setExpandedMaha] = useState(null);

  if (!dashaData || dashaData.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 cosmic-glass rounded-2xl">
        दशा माहिती उपलब्ध नाही. कृपया जन्म तपशील भरा.
      </div>
    );
  }

  const toggleMaha = (lord) => {
    setExpandedMaha(expandedMaha === lord ? null : lord);
  };

  const currentDasha = dashaData.find((d) => d.isCurrent) || dashaData[0];

  return (
    <div className="space-y-6">
      {/* Current Active Dasha Highlight Card */}
      {currentDasha && (
        <div className="relative overflow-hidden rounded-2xl cosmic-glass-gold p-6 border border-amber-500/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <Clock className="w-4 h-4" />
                सध्या चालू असलेली विंशोत्तरी महादशा (Current Active Period)
              </div>
              <h3 className="text-2xl font-cinzel font-bold text-white mt-1">
                {currentDasha.lord} महादशा
                {currentDasha.currentAntar && (
                  <span className="text-amber-400 text-lg font-sans ml-2">
                    ({currentDasha.currentAntar} अंतर्दशा)
                  </span>
                )}
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                कालावधी: {currentDasha.startDate} ते {currentDasha.endDate}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                style={{ backgroundColor: dashaColors[currentDasha.lord] || '#F59E0B' }}
              >
                {currentDasha.lord.substring(0, 2)}
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium">
                  <Star className="w-3 h-3 fill-current" /> Active Now
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Timeline Bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>१२० वर्षांची विंशोत्तरी दशा टाइमलाईन</span>
          <span>जन्म ते १२० वर्षे</span>
        </div>
        <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-900 border border-slate-800 p-0.5">
          {dashaData.map((d) => (
            <div
              key={d.lord}
              className={`h-full relative group transition-all cursor-pointer ${
                d.isCurrent ? 'ring-2 ring-white z-10' : 'opacity-85 hover:opacity-100'
              }`}
              style={{
                width: `${(d.years / 120) * 100}%`,
                backgroundColor: dashaColors[d.lord] || '#94A3B8',
              }}
              onClick={() => toggleMaha(d.lord)}
              title={`${d.lord} (${d.years} yrs): ${d.startDate} - ${d.endDate}`}
            >
              <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[11px] rounded px-2 py-1 whitespace-nowrap z-30 shadow-xl pointer-events-none">
                {d.lord} ({d.years} yrs) • {d.startDate} - {d.endDate}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Dasha Breakdown List */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          सर्व ९ महादशा तपशील (Click to view Antardasha breakdown)
        </h4>

        {dashaData.map((d) => {
          const isExpanded = expandedMaha === d.lord;
          return (
            <div
              key={d.lord}
              className={`rounded-xl border transition-all ${
                d.isCurrent
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => toggleMaha(d.lord)}
                className="w-full flex items-center justify-between p-3.5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: dashaColors[d.lord] || '#F59E0B' }}
                  />
                  <div>
                    <span className="font-semibold text-white mr-2">{d.lord} महादशा</span>
                    <span className="text-xs text-slate-400">({d.years} वर्षे)</span>
                    {d.isCurrent && (
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
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

              {/* Sub-periods / Antardashas */}
              {isExpanded && d.antardashas && d.antardashas.length > 0 && (
                <div className="p-3 pt-0 border-t border-slate-800/80 mt-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                    {d.antardashas.map((antar) => (
                      <div
                        key={antar.lord}
                        className={`p-2.5 rounded-lg text-xs ${
                          antar.isCurrent
                            ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200'
                            : 'bg-slate-800/50 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-medium">
                          <span>{d.lord} - {antar.lord}</span>
                          {antar.isCurrent && (
                            <span className="text-[10px] text-amber-400">Current</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {antar.startDate} ते {antar.endDate}
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
