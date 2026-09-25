import { useState, useEffect } from 'react';
import {
  Compass, LayoutDashboard, Sun, Moon, Briefcase, Heart, Calendar,
  MessageSquare, Sparkles, User, RefreshCw, LogOut, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import KundaliChart from '../components/KundaliChart';
import DashaTimeline from '../components/DashaTimeline';
import AIChatbot from '../components/AIChatbot';

export default function Dashboard({ user, initialBirthData, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  // 'overview' | 'kundali' | 'daily' | 'career' | 'marriage' | 'dasha' | 'chat'

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

  // Fetch daily transits
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

  // Request domain analysis
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
    fetchChart(birthData);
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col bg-[#030712] selection:bg-amber-400/20 selection:text-amber-200">
      {/* Top Header */}
      <header className="sticky top-0 z-30 px-6 sm:px-10 py-4 bg-[#05070D]/85 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-300 via-amber-500 to-purple-600 p-[1px]">
            <div className="w-full h-full bg-[#05070D] rounded-2xl flex items-center justify-center">
              <Compass className="w-4 h-4 text-amber-300" />
            </div>
          </div>
          <span className="font-cinzel text-lg font-bold text-white tracking-[0.2em]">
            ASTRO<span className="text-amber-300">MATH</span>
          </span>
          <span className="hidden sm:inline-block text-[11px] px-3 py-0.5 rounded-full bg-white/5 text-amber-200/90 border border-white/10 font-mono">
            {chartData ? `${chartData.lagna?.sign} Ascendant` : 'Computing...'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/5 text-xs text-slate-300">
            <User className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-medium text-white">{birthData.name}</span>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-8 gap-8">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-5">
          {/* Birth Profile Editor */}
          <div className="p-5 rounded-3xl bg-[#080B14] border border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Birth Parameters
              </h4>
              <button
                onClick={() => fetchChart()}
                className="text-amber-300 hover:text-amber-200 p-1 transition-colors"
                title="Refresh Matrix"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <form onSubmit={handleUpdateBirthData} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 uppercase tracking-wider text-[10px]">Name</label>
                <input
                  type="text"
                  value={birthData.name}
                  onChange={(e) => setBirthData({ ...birthData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white mt-1 focus:border-amber-400 outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 uppercase tracking-wider text-[10px]">Date</label>
                  <input
                    type="date"
                    value={birthData.dob}
                    onChange={(e) => setBirthData({ ...birthData, dob: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white mt-1 focus:border-amber-400 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-slate-400 uppercase tracking-wider text-[10px]">Time</label>
                  <input
                    type="time"
                    value={birthData.tob}
                    onChange={(e) => setBirthData({ ...birthData, tob: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white mt-1 focus:border-amber-400 outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 uppercase tracking-wider text-[10px]">Location</label>
                <input
                  type="text"
                  value={birthData.city}
                  onChange={(e) => setBirthData({ ...birthData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white mt-1 focus:border-amber-400 outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 font-medium tracking-wide uppercase text-[10.5px] transition-colors mt-2"
              >
                Update Parameters
              </button>
            </form>
          </div>

          {/* Navigation Tabs */}
          <nav className="p-2 rounded-3xl bg-[#080B14] border border-white/5 space-y-1">
            {[
              { id: 'overview', label: 'Celestial Matrix', icon: LayoutDashboard },
              { id: 'kundali', label: 'Harmonic Charts (D1, D9, D10)', icon: Compass },
              { id: 'daily', label: 'Daily Transits & Luna', icon: Sun },
              { id: 'career', label: 'Vocation & Mastery (D10)', icon: Briefcase },
              { id: 'marriage', label: 'Union & Synastry (D9)', icon: Heart },
              { id: 'dasha', label: 'Planetary Eras (Vimshottari)', icon: Calendar },
              { id: 'chat', label: 'Oracle Consultation', icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-400/20'
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
            <div className="h-96 flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-[#080B14] border border-white/5">
              <Compass className="w-12 h-12 text-amber-300 animate-spin-slow mb-4" />
              <h3 className="text-lg font-cinzel font-bold text-white">
                Aligning Celestial Coordinates...
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 font-light">
                Computing sidereal degrees, harmonic divisions, and planetary periods.
              </p>
            </div>
          ) : !chartData ? (
            <div className="p-8 text-center text-slate-400 bg-[#080B14] rounded-3xl border border-white/5">
              Unable to align celestial matrix. Please check parameters and try again.
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-5 rounded-3xl bg-[#080B14] border border-amber-400/20 shadow-lg">
                      <span className="text-[10.5px] uppercase tracking-wider text-slate-400 font-medium">
                        Ascendant (Lagna)
                      </span>
                      <div className="text-xl font-bold text-white font-cinzel mt-1.5">
                        {chartData.lagna?.sign}
                      </div>
                      <span className="text-xs text-amber-300 font-mono mt-0.5 block">
                        {chartData.lagna?.degreeFormatted}
                      </span>
                    </div>

                    <div className="p-5 rounded-3xl bg-[#080B14] border border-purple-400/20 shadow-lg">
                      <span className="text-[10.5px] uppercase tracking-wider text-slate-400 font-medium">
                        Moon Sign (Chandra)
                      </span>
                      <div className="text-xl font-bold text-white font-cinzel mt-1.5">
                        {chartData.planets?.Moon?.sign}
                      </div>
                      <span className="text-xs text-purple-300 font-mono mt-0.5 block">
                        {chartData.planets?.Moon?.nakshatra}
                      </span>
                    </div>

                    <div className="p-5 rounded-3xl bg-[#080B14] border border-yellow-400/20 shadow-lg">
                      <span className="text-[10.5px] uppercase tracking-wider text-slate-400 font-medium">
                        Sun Sign (Surya)
                      </span>
                      <div className="text-xl font-bold text-white font-cinzel mt-1.5">
                        {chartData.planets?.Sun?.sign}
                      </div>
                      <span className="text-xs text-yellow-300 font-mono mt-0.5 block">
                        {chartData.planets?.Sun?.degreeFormatted}
                      </span>
                    </div>

                    <div className="p-5 rounded-3xl bg-[#080B14] border border-emerald-400/20 shadow-lg">
                      <span className="text-[10.5px] uppercase tracking-wider text-slate-400 font-medium">
                        Active Planetary Era
                      </span>
                      <div className="text-xl font-bold text-white font-cinzel mt-1.5">
                        {chartData.currentDasha?.maha} - {chartData.currentDasha?.antar}
                      </div>
                      <span className="text-xs text-emerald-300 font-mono mt-0.5 block">
                        Until {chartData.currentDasha?.until}
                      </span>
                    </div>
                  </div>

                  {/* Planetary Positions Table */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#080B14] border border-white/5 overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-cinzel text-base font-bold text-white tracking-wide">
                        Planetary Coordinates & Dignities
                      </h3>
                      <span className="text-xs font-mono text-slate-400">
                        Chitrapaksha Offset: {chartData.ayanamsa?.toFixed(2)}°
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/5">
                          <tr>
                            <th className="py-3 px-4 font-semibold">Body</th>
                            <th className="py-3 px-4 font-semibold">Sign</th>
                            <th className="py-3 px-4 font-semibold">Longitude</th>
                            <th className="py-3 px-4 font-semibold">House</th>
                            <th className="py-3 px-4 font-semibold">Nakshatra</th>
                            <th className="py-3 px-4 font-semibold">Pada</th>
                            <th className="py-3 px-4 font-semibold">Motion</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                          {Object.entries(chartData.planets || {}).map(([name, p]) => (
                            <tr key={name} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                                <span>{name}</span>
                              </td>
                              <td className="py-3 px-4">{p.sign}</td>
                              <td className="py-3 px-4 font-mono text-amber-300">{p.degreeFormatted}</td>
                              <td className="py-3 px-4 font-mono">House {p.house}</td>
                              <td className="py-3 px-4">{p.nakshatra}</td>
                              <td className="py-3 px-4 font-mono">{p.pada}</td>
                              <td className="py-3 px-4">
                                {p.isRetrograde ? (
                                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px]">
                                    Retrograde (℞)
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px]">
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

              {/* TAB 2: KUNDALI CHARTS (D1, D9, D10) */}
              {activeTab === 'kundali' && (
                <div className="space-y-6">
                  {/* Selector Buttons */}
                  <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#080B14] border border-white/5 w-fit">
                    {[
                      { id: 'D1', label: 'Natal Wheel (D1)', desc: 'Constitutional Matrix' },
                      { id: 'D9', label: 'Navamsha (D9)', desc: 'Soul & Partnership' },
                      { id: 'D10', label: 'Dashamsha (D10)', desc: 'Vocation & Mastery' },
                    ].map((chart) => (
                      <button
                        key={chart.id}
                        onClick={() => setSelectedChartType(chart.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                          selectedChartType === chart.id
                            ? 'bg-amber-400 text-slate-950 shadow-md'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {chart.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <KundaliChart
                      chartType={selectedChartType}
                      lagnaSign={chartData.divisionalCharts?.[selectedChartType]?.lagnaSign || chartData.lagna?.signNumber || 1}
                      houses={chartData.divisionalCharts?.[selectedChartType]?.houses || {}}
                      title={`${selectedChartType} Diamond Wheel (${
                        selectedChartType === 'D1' ? 'Natal' : selectedChartType === 'D9' ? 'Navamsha' : 'Dashamsha'
                      })`}
                    />

                    {/* Chart Context Card */}
                    <div className="p-7 rounded-3xl bg-[#080B14] border border-white/5 space-y-4 shadow-xl">
                      <h4 className="font-cinzel text-lg font-bold text-amber-200">
                        {selectedChartType === 'D1' && 'The Natal Matrix (D1)'}
                        {selectedChartType === 'D9' && 'The Navamsha Soul Harmonic (D9)'}
                        {selectedChartType === 'D10' && 'The Dashamsha Vocation Harmonic (D10)'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        {selectedChartType === 'D1' &&
                          'The primary birth chart encapsulates your foundational physical constitution, temperament, and life baseline. The 1st house (Ascendant) sets the harmonic lens for all life events.'}
                        {selectedChartType === 'D9' &&
                          'The Navamsha is the 9-fold harmonic of the soul. In classical Vedic tradition, D9 reveals the character of the karmic partner, the quality of intimate union, and the spiritual trajectory of life past age 30.'}
                        {selectedChartType === 'D10' &&
                          'The Dashamsha is the 10-fold harmonic of vocation. It governs leadership authority, enterprise achievements, professional recognition, and public status.'}
                      </p>

                      <div className="pt-3">
                        <button
                          onClick={() => setActiveTab('chat')}
                          className="px-5 py-3 rounded-2xl bg-amber-400/10 text-amber-300 border border-amber-400/25 text-xs font-semibold hover:bg-amber-400/20 transition-colors flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Consult the Oracle on this Chart</span>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="p-7 rounded-3xl bg-[#080B14] border border-emerald-500/20">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                              Lunar Harmony (Chandra Bala)
                            </span>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-bold">
                              {dailyData.chandraBala?.status}
                            </span>
                          </div>
                          <h3 className="text-3xl font-bold font-cinzel text-white mt-3">
                            {dailyData.chandraBala?.score} / 10
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-300 mt-2.5 font-light leading-relaxed">
                            Today's transit Moon traverses your {dailyData.chandraBala?.houseFromMoon}th solar house. {dailyData.chandraBala?.description}
                          </p>
                        </div>

                        <div className="p-7 rounded-3xl bg-[#080B14] border border-purple-500/20">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                              Stellar Alignment (Tara Bala)
                            </span>
                            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-bold">
                              {dailyData.taraBala?.taraName}
                            </span>
                          </div>
                          <h3 className="text-3xl font-bold font-cinzel text-white mt-3">
                            {dailyData.taraBala?.auspicious ? 'Auspicious Alignment' : 'Deliberate / Caution'}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-300 mt-2.5 font-light leading-relaxed">
                            {dailyData.taraBala?.description}
                          </p>
                        </div>
                      </div>

                      {/* Daily Guidance */}
                      <div className="p-7 rounded-3xl bg-[#080B14] border border-amber-400/20 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            Personalized Daily Forecast
                          </h3>
                          <button
                            onClick={() => fetchAiReport('daily')}
                            disabled={aiLoading}
                            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs disabled:opacity-50 transition-colors"
                          >
                            {aiLoading ? 'Synthesizing...' : 'Request Synthesis'}
                          </button>
                        </div>

                        <div className="p-5 rounded-2xl bg-slate-950 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-light">
                          {aiReport?.daily ||
                            dailyData.summary ||
                            'Click the button above to request a personalized daily synthesis grounded in today\'s planetary transit.'}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center text-slate-400 bg-[#080B14] rounded-3xl border border-white/5">
                      Aligning transit ephemerides...
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CAREER & WEALTH */}
              {activeTab === 'career' && (
                <div className="space-y-6">
                  <div className="p-7 sm:p-9 rounded-3xl bg-[#080B14] border border-amber-400/20 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-amber-300">
                        <Briefcase className="w-5 h-5" />
                        <h3 className="font-cinzel text-xl font-bold text-white">
                          Vocation, Mastery & Public Standing (10th Harmonic)
                        </h3>
                      </div>
                      <button
                        onClick={() => fetchAiReport('career')}
                        disabled={aiLoading}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md disabled:opacity-50"
                      >
                        {aiLoading ? 'Synthesizing...' : 'Generate Career Synthesis'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-2xl bg-slate-950 border border-white/5">
                        <span className="text-[10.5px] uppercase tracking-wider text-slate-400">10th House Lord</span>
                        <div className="font-bold text-white text-base mt-1.5 font-cinzel">
                          {chartData.careerAnalysis?.tenthLord || 'Mercury'}
                        </div>
                        <span className="text-[11px] text-amber-300 font-mono">
                          In {chartData.careerAnalysis?.tenthLordSign || 'Gemini'}
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-white/5">
                        <span className="text-[10.5px] uppercase tracking-wider text-slate-400">Natural Domains</span>
                        <div className="font-bold text-white text-base mt-1.5">
                          {chartData.careerAnalysis?.favorableDomains || 'Technology, Trade & Advisory'}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950 border border-white/5">
                        <span className="text-[10.5px] uppercase tracking-wider text-slate-400">Vocation Orientation</span>
                        <div className="font-bold text-emerald-300 text-base mt-1.5">
                          {chartData.careerAnalysis?.inclination || 'Independent Practice / Advisory'}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-light mt-4">
                      {aiReport?.career ||
                        chartData.careerAnalysis?.summary ||
                        'Generate your comprehensive career synthesis to examine optimal promotion windows, leadership transitions, and strategic ventures.'}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: MARRIAGE & SYNASTRY */}
              {activeTab === 'marriage' && (
                <div className="space-y-6">
                  <div className="p-7 sm:p-9 rounded-3xl bg-[#080B14] border border-pink-400/20 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-pink-300">
                        <Heart className="w-5 h-5" />
                        <h3 className="font-cinzel text-xl font-bold text-white">
                          Union, Partnership & Mars Harmonic (7th House)
                        </h3>
                      </div>
                      <button
                        onClick={() => fetchAiReport('marriage')}
                        disabled={aiLoading}
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md disabled:opacity-50"
                      >
                        {aiLoading ? 'Synthesizing...' : 'Generate Union Synthesis'}
                      </button>
                    </div>

                    <div
                      className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between ${
                        chartData.marriageAnalysis?.hasMangalDosha
                          ? 'bg-rose-500/10 border-rose-500/25 text-rose-200'
                          : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200'
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

                    <div className="p-5 rounded-2xl bg-slate-950 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-light mt-4">
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
                  <div className="p-7 sm:p-9 rounded-3xl bg-[#080B14] border border-white/5 shadow-2xl">
                    <h3 className="font-cinzel text-xl font-bold text-white mb-6">
                      Planetary Progression (120-Year Vimshottari Cycle)
                    </h3>
                    <DashaTimeline dashaData={chartData.dashaTimeline || []} />
                  </div>
                </div>
              )}

              {/* TAB 7: AI ASTROLOGER CHATBOT */}
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
