import { useState, useEffect } from 'react';
import {
  Compass, LayoutDashboard, Sun, Moon, Briefcase, Heart, Calendar,
  MessageSquare, Sparkles, User, RefreshCw, LogOut, CheckCircle2, AlertTriangle, ArrowLeft, Settings2
} from 'lucide-react';
import KundaliChart from '../components/KundaliChart';
import DashaTimeline from '../components/DashaTimeline';
import AIChatbot from '../components/AIChatbot';

export default function Dashboard({ user, initialBirthData, onLogout, onReturnHome }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileParams, setShowMobileParams] = useState(false);

  const [birthData, setBirthData] = useState(
    initialBirthData || {
      name: user?.name || 'Alexander Vance',
      dob: '1998-05-15',
      tob: '08:30',
      city: 'Pune, India',
      lat: 18.5204,
      lon: 73.8567,
      tz: 5.5,
    }
  );

  const [chartData, setChartData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState('D1');

  // Fetch full astronomical chart
  const fetchChart = async (dataToSubmit) => {
    setLoading(true);
    try {
      const res = await fetch('/api/chart/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit || birthData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setChartData(data);

      fetchDaily(dataToSubmit || birthData);
    } catch (err) {
      console.error('Error fetching chart:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDaily = async (dataToSubmit) => {
    try {
      const res = await fetch('/api/chart/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit || birthData),
      });
      const data = await res.json();
      if (res.ok) setDailyData(data);
    } catch (err) {
      console.error('Error fetching daily data:', err);
    }
  };

  const fetchAiReport = async (domain) => {
    if (!chartData) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domain,
          chartData: chartData,
          dailyData: dailyData,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAiReport((prev) => ({ ...prev, [domain]: data.analysis }));
      }
    } catch (err) {
      console.error('Error fetching AI report:', err);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchChart();
  }, []);

  const handleUpdateBirthData = (e) => {
    e.preventDefault();
    setShowMobileParams(false);
    fetchChart(birthData);
  };

  const tabs = [
    { id: 'overview', label: 'Matrix', icon: LayoutDashboard },
    { id: 'kundali', label: 'Harmonics', icon: Compass },
    { id: 'daily', label: 'Transits', icon: Sun },
    { id: 'career', label: 'Vocation', icon: Briefcase },
    { id: 'marriage', label: 'Union', icon: Heart },
    { id: 'dasha', label: 'Cycles', icon: Calendar },
    { id: 'chat', label: 'Oracle', icon: MessageSquare },
  ];

  return (
    <div className="relative min-h-screen flex flex-col text-slate-100">
      {/* Top Floating Glass Header */}
      <header className="sticky top-0 z-40 px-3 sm:px-8 py-2.5 sm:py-3.5 bg-black/50 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          {onReturnHome && (
            <button
              onClick={onReturnHome}
              className="p-1.5 sm:p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition-colors"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center text-white shrink-0">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            </div>
            <span className="font-bold text-sm sm:text-base tracking-tight text-white">
              AstroMath
            </span>
          </div>
          <span className="hidden sm:inline-block text-[11px] px-3 py-0.5 rounded-full bg-white/[0.05] text-slate-300 border border-white/10 font-mono">
            {chartData ? `${chartData.lagna?.sign} Ascendant` : 'Computing...'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Parameters Toggle Button */}
          <button
            onClick={() => setShowMobileParams(!showMobileParams)}
            className="md:hidden px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-200 flex items-center gap-1.5 transition-colors"
            title="Edit Birth Parameters"
          >
            <Settings2 className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[11px] font-medium">{birthData.name?.split(' ')[0]}</span>
          </button>

          {/* Desktop User Tag */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs text-slate-200">
            <User className="w-3 h-3 text-slate-400" />
            <span className="font-medium">{birthData.name}</span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Mobile Collapsible Parameters Drawer */}
      {showMobileParams && (
        <div className="md:hidden p-4 bg-[#05070D]/95 backdrop-blur-3xl border-b border-white/15 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
              Edit Birth Coordinates
            </h4>
            <button
              onClick={() => setShowMobileParams(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleUpdateBirthData} className="space-y-2.5 text-xs">
            <div>
              <label className="text-slate-400 uppercase tracking-wider text-[9px]">Full Name</label>
              <input
                type="text"
                value={birthData.name}
                onChange={(e) => setBirthData({ ...birthData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 focus:border-white/30 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 uppercase tracking-wider text-[9px]">Birth Date</label>
                <input
                  type="date"
                  value={birthData.dob}
                  onChange={(e) => setBirthData({ ...birthData, dob: e.target.value })}
                  className="w-full px-2 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 focus:border-white/30 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 uppercase tracking-wider text-[9px]">Birth Time</label>
                <input
                  type="time"
                  value={birthData.tob}
                  onChange={(e) => setBirthData({ ...birthData, tob: e.target.value })}
                  className="w-full px-2 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 focus:border-white/30 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-slate-400 uppercase tracking-wider text-[9px]">Birth City / Location</label>
              <input
                type="text"
                value={birthData.city}
                onChange={(e) => setBirthData({ ...birthData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 focus:border-white/30 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors mt-1"
            >
              Recalculate Chart
            </button>
          </form>
        </div>
      )}

      {/* Mobile Horizontal Navigation Pills */}
      <div className="md:hidden px-3 py-2.5 bg-black/40 backdrop-blur-xl border-b border-white/5 overflow-x-auto no-scrollbar flex gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'bg-white/[0.04] text-slate-300 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-3 sm:p-8 gap-6 sm:gap-8">
        {/* Left Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 space-y-5">
          {/* Birth Parameter Mini Form */}
          <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Parameters
              </h4>
              <button
                onClick={() => fetchChart()}
                className="text-slate-400 hover:text-white p-1 transition-colors"
                title="Refresh Matrix"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <form onSubmit={handleUpdateBirthData} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 uppercase tracking-wider text-[9.5px]">Name</label>
                <input
                  type="text"
                  value={birthData.name}
                  onChange={(e) => setBirthData({ ...birthData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-1 focus:border-white/30 outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 uppercase tracking-wider text-[9.5px]">Date</label>
                  <input
                    type="date"
                    value={birthData.dob}
                    onChange={(e) => setBirthData({ ...birthData, dob: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-1 focus:border-white/30 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-slate-400 uppercase tracking-wider text-[9.5px]">Time</label>
                  <input
                    type="time"
                    value={birthData.tob}
                    onChange={(e) => setBirthData({ ...birthData, tob: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-1 focus:border-white/30 outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 uppercase tracking-wider text-[9.5px]">Location</label>
                <input
                  type="text"
                  value={birthData.city}
                  onChange={(e) => setBirthData({ ...birthData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-1 focus:border-white/30 outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15 font-semibold text-[11px] uppercase tracking-wider transition-colors mt-2"
              >
                Recalculate
              </button>
            </form>
          </div>

          {/* Desktop Nav Pills */}
          <nav className="p-2 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs tracking-wide transition-all ${
                    isActive
                      ? 'bg-white text-slate-950 font-bold shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 space-y-6">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl">
              <Compass className="w-10 h-10 text-white animate-spin-slow mb-4" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Aligning Celestial Coordinates...
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-light">
                Computing harmonic divisional matrices and planetary periods.
              </p>
            </div>
          ) : !chartData ? (
            <div className="p-8 text-center text-slate-400 bg-white/[0.03] rounded-3xl border border-white/10">
              Unable to load coordinates. Please update parameters and recalculate.
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW MATRIX */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl">
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        Ascendant (Lagna)
                      </span>
                      <div className="text-lg sm:text-xl font-bold text-white font-sans mt-1">
                        {chartData.lagna?.sign}
                      </div>
                      <span className="text-[11px] sm:text-xs text-slate-300 font-mono mt-0.5 block">
                        {chartData.lagna?.degreeFormatted}
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl">
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        Moon Sign (Chandra)
                      </span>
                      <div className="text-lg sm:text-xl font-bold text-white font-sans mt-1">
                        {chartData.planets?.Moon?.sign}
                      </div>
                      <span className="text-[11px] sm:text-xs text-slate-300 font-mono mt-0.5 block truncate">
                        {chartData.planets?.Moon?.nakshatra}
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl">
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        Sun Sign (Surya)
                      </span>
                      <div className="text-lg sm:text-xl font-bold text-white font-sans mt-1">
                        {chartData.planets?.Sun?.sign}
                      </div>
                      <span className="text-[11px] sm:text-xs text-slate-300 font-mono mt-0.5 block">
                        {chartData.planets?.Sun?.degreeFormatted}
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl">
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        Active Period
                      </span>
                      <div className="text-lg sm:text-xl font-bold text-white font-sans mt-1">
                        {chartData.currentDasha?.maha} - {chartData.currentDasha?.antar}
                      </div>
                      <span className="text-[11px] sm:text-xs text-slate-300 font-mono mt-0.5 block">
                        Until {chartData.currentDasha?.until}
                      </span>
                    </div>
                  </div>

                  {/* Planetary Coordinates Table */}
                  <div className="p-4 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 sm:mb-5">
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        Planetary Coordinates & Dignities
                      </h3>
                      <span className="text-[11px] sm:text-xs font-mono text-slate-400">
                        Chitrapaksha Offset: {chartData.ayanamsa?.toFixed(2)}°
                      </span>
                    </div>

                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <table className="w-full text-left text-xs text-slate-300 min-w-[500px]">
                        <thead className="bg-white/[0.02] text-slate-400 uppercase text-[9.5px] sm:text-[10px] tracking-wider border-b border-white/10">
                          <tr>
                            <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">Body</th>
                            <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">Sign</th>
                            <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">Longitude</th>
                            <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">House</th>
                            <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">Nakshatra</th>
                            <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">Pada</th>
                            <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">Motion</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                          {Object.entries(chartData.planets || {}).map(([name, p]) => (
                            <tr key={name} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-bold text-white">{name}</td>
                              <td className="py-2.5 sm:py-3 px-3 sm:px-4">{p.sign}</td>
                              <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-mono text-white">{p.degreeFormatted}</td>
                              <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-mono">House {p.house}</td>
                              <td className="py-2.5 sm:py-3 px-3 sm:px-4">{p.nakshatra}</td>
                              <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-mono">{p.pada}</td>
                              <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                                {p.isRetrograde ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[9.5px]">
                                    Retro (℞)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[9.5px]">
                                    Direct
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HARMONIC CHARTS (Spacious, Large Kundali Centerpiece) */}
              {activeTab === 'kundali' && (
                <div className="space-y-6">
                  {/* Selector Pills */}
                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 w-fit overflow-x-auto">
                    {[
                      { id: 'D1', label: 'Natal Wheel (D1)' },
                      { id: 'D9', label: 'Navamsha (D9)' },
                      { id: 'D10', label: 'Dashamsha (D10)' },
                    ].map((chart) => (
                      <button
                        key={chart.id}
                        onClick={() => setSelectedChartType(chart.id)}
                        className={`px-3.5 sm:px-5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                          selectedChartType === chart.id
                            ? 'bg-white text-slate-950 shadow-md font-bold'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {chart.label}
                      </button>
                    ))}
                  </div>

                  {/* Large Centerpiece Layout for the Kundali Chart */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 items-start">
                    {/* Large Chart Container */}
                    <div className="xl:col-span-7 flex justify-center w-full">
                      <KundaliChart
                        chartType={selectedChartType}
                        lagnaSign={chartData.divisionalCharts?.[selectedChartType]?.lagnaSign || chartData.lagna?.signNumber || 1}
                        houses={chartData.divisionalCharts?.[selectedChartType]?.houses || {}}
                        title={`${selectedChartType} Diamond Wheel`}
                        size={540}
                      />
                    </div>

                    {/* Chart Context & Interpretation Card */}
                    <div className="xl:col-span-5 p-5 sm:p-7 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-4 shadow-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] text-amber-300 border border-white/10 text-xs font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Harmonic Insight</span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        {selectedChartType === 'D1' && 'Natal Matrix (D1 Wheel)'}
                        {selectedChartType === 'D9' && 'Navamsha Soul Harmonic (D9)'}
                        {selectedChartType === 'D10' && 'Dashamsha Vocation Harmonic (D10)'}
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        {selectedChartType === 'D1' &&
                          'The primary birth chart encapsulates your foundational physical constitution, temperament, and life baseline. The 1st house (Ascendant) sets the harmonic lens through which all transits and dashas manifest.'}
                        {selectedChartType === 'D9' &&
                          'The Navamsha is the 9-fold harmonic of the soul. In classical sidereal tradition, D9 reveals the character of the karmic partner, the quality of intimate union, and the spiritual trajectory of life past age 30.'}
                        {selectedChartType === 'D10' &&
                          'The Dashamsha is the 10-fold harmonic of vocation. It governs leadership authority, enterprise achievements, professional recognition, and public status.'}
                      </p>

                      <div className="pt-2">
                        <button
                          onClick={() => setActiveTab('chat')}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Consult Oracle on this Wheel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DAILY TRANSITS */}
              {activeTab === 'daily' && (
                <div className="space-y-6">
                  {dailyData ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        <div className="p-5 sm:p-7 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                              Lunar Harmony (Chandra Bala)
                            </span>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-bold">
                              {dailyData.chandraBala?.status}
                            </span>
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-3">
                            {dailyData.chandraBala?.score} / 10
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-300 mt-2.5 font-light leading-relaxed">
                            Today's transit Moon traverses your {dailyData.chandraBala?.houseFromMoon}th solar house. {dailyData.chandraBala?.description}
                          </p>
                        </div>

                        <div className="p-5 sm:p-7 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                              Stellar Alignment (Tara Bala)
                            </span>
                            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-bold">
                              {dailyData.taraBala?.taraName}
                            </span>
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-3">
                            {dailyData.taraBala?.auspicious ? 'Auspicious Alignment' : 'Deliberate / Caution'}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-300 mt-2.5 font-light leading-relaxed">
                            {dailyData.taraBala?.description}
                          </p>
                        </div>
                      </div>

                      {/* Daily Guidance */}
                      <div className="p-5 sm:p-7 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-4 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-white" />
                            Personalized Daily Forecast
                          </h3>
                          <button
                            onClick={() => fetchAiReport('daily')}
                            disabled={aiLoading}
                            className="px-4 py-2 rounded-full bg-white text-slate-950 font-bold text-xs disabled:opacity-50 hover:bg-slate-100 transition-all shadow-md self-start sm:self-auto"
                          >
                            {aiLoading ? 'Synthesizing...' : 'Request Synthesis'}
                          </button>
                        </div>

                        <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-light">
                          {aiReport?.daily ||
                            dailyData.summary ||
                            'Click the button above to request a personalized daily synthesis grounded in today\'s planetary transit.'}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center text-slate-400 bg-white/[0.03] rounded-3xl border border-white/10">
                      Aligning transit coordinates...
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: VOCATION */}
              {activeTab === 'career' && (
                <div className="space-y-6">
                  <div className="p-5 sm:p-9 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-5 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-white" />
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          Vocation & Public Standing (10th Harmonic)
                        </h3>
                      </div>
                      <button
                        onClick={() => fetchAiReport('career')}
                        disabled={aiLoading}
                        className="px-5 py-2 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-slate-100 disabled:opacity-50 transition-all self-start sm:self-auto"
                      >
                        {aiLoading ? 'Synthesizing...' : 'Generate Career Synthesis'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">10th House Lord</span>
                        <div className="font-bold text-white text-base mt-1">
                          {chartData.careerAnalysis?.tenthLord || 'Mercury'}
                        </div>
                        <span className="text-[11px] text-slate-300 font-mono">
                          In {chartData.careerAnalysis?.tenthLordSign || 'Gemini'}
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Natural Domains</span>
                        <div className="font-bold text-white text-base mt-1">
                          {chartData.careerAnalysis?.favorableDomains || 'Technology, Trade & Advisory'}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Orientation</span>
                        <div className="font-bold text-emerald-300 text-base mt-1">
                          {chartData.careerAnalysis?.inclination || 'Independent Practice / Advisory'}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-light mt-4">
                      {aiReport?.career ||
                        chartData.careerAnalysis?.summary ||
                        'Generate your comprehensive career synthesis to examine optimal promotion windows, leadership transitions, and strategic ventures.'}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: UNION & SYNASTRY */}
              {activeTab === 'marriage' && (
                <div className="space-y-6">
                  <div className="p-5 sm:p-9 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-5 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-white" />
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          Union, Partnership & Mars Harmonic (7th House)
                        </h3>
                      </div>
                      <button
                        onClick={() => fetchAiReport('marriage')}
                        disabled={aiLoading}
                        className="px-5 py-2 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-slate-100 disabled:opacity-50 transition-all self-start sm:self-auto"
                      >
                        {aiLoading ? 'Synthesizing...' : 'Generate Union Synthesis'}
                      </button>
                    </div>

                    <div
                      className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between ${
                        chartData.marriageAnalysis?.hasMangalDosha
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-200'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {chartData.marriageAnalysis?.hasMangalDosha ? (
                          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                        <div>
                          <div className="font-bold text-sm">
                            {chartData.marriageAnalysis?.hasMangalDosha
                              ? 'Mars Alignment Identified (Active Kuja Energy)'
                              : 'Balanced Mars Harmonic (No Affliction)'}
                          </div>
                          <div className="text-xs text-slate-300 mt-1 font-light">
                            {chartData.marriageAnalysis?.doshaDetails ||
                              'Mars is harmoniously situated outside the vulnerable relationship angles.'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-light mt-4">
                      {aiReport?.marriage ||
                        chartData.marriageAnalysis?.summary ||
                        'Generate your union synthesis to evaluate spouse characteristics, partnership timing, and energetic harmony.'}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: VIMSHOTTARI DASHA */}
              {activeTab === 'dasha' && (
                <div className="space-y-6">
                  <div className="p-5 sm:p-9 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-6 tracking-tight">
                      Planetary Progression (120-Year Vimshottari Cycle)
                    </h3>
                    <DashaTimeline dashaData={chartData.dashaTimeline || []} />
                  </div>
                </div>
              )}

              {/* TAB 7: AI ASTROLOGER ORACLE */}
              {activeTab === 'chat' && (
                <AIChatbot chartData={chartData} nativeName={birthData.name} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
