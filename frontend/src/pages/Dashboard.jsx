import { useState, useEffect } from 'react';
import {
  Compass, LayoutDashboard, Sun, Moon, Briefcase, Heart, Calendar,
  MessageSquare, Sparkles, User, RefreshCw, LogOut, CheckCircle2, AlertTriangle, ArrowLeft, Settings2,
  Orbit, Activity, Hash
} from 'lucide-react';
import KundaliChart from '../components/KundaliChart';
import DashaTimeline from '../components/DashaTimeline';
import AIChatbot from '../components/AIChatbot';
import BirthCoordinatesModal from '../components/BirthCoordinatesModal';
import PersonalNumerology from '../components/PersonalNumerology';
import CoupleKundaliMatch from '../components/CoupleKundaliMatch';
import CoupleNumerology from '../components/CoupleNumerology';
import { translations } from '../data/translations';

export default function Dashboard({ user, initialBirthData, onLogout, onReturnHome }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('astromath_lang') || 'mr';
  });
  const t = translations[lang] || translations.mr;

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('astromath_lang', newLang);
  };

  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileParams, setShowMobileParams] = useState(false);
  const [birthModalOpen, setBirthModalOpen] = useState(false);

  // Pure Database-Driven State (Zero Cross-User Pollution)
  const [birthData, setBirthData] = useState(() => {
    if (initialBirthData && initialBirthData.dob && initialBirthData.tob) {
      return initialBirthData;
    }
    return null;
  });

  const [chartData, setChartData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [aiReport, setAiReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState('D1');

  // Load user-specific profile strictly from SQLite Database & Python Ephemeris
  useEffect(() => {
    const token = localStorage.getItem('astromath_token');
    if (token) {
      setLoading(true);
      fetch('/api/chart/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data?.profile?.dob && data?.profile?.tob) {
            setBirthData(data.profile);
            setChartData(data.chart);
            fetchDaily(data.profile);
          } else if (initialBirthData?.dob && initialBirthData?.tob) {
            setBirthData(initialBirthData);
            fetchChart(initialBirthData);
          } else {
            setBirthData(null);
            setChartData(null);
            setBirthModalOpen(true);
          }
        })
        .catch((err) => {
          console.error('Failed to load profile for user:', err);
        })
        .finally(() => setLoading(false));
    } else if (initialBirthData?.dob && initialBirthData?.tob) {
      setBirthData(initialBirthData);
      fetchChart(initialBirthData);
    } else {
      setBirthData(null);
      setChartData(null);
      setBirthModalOpen(true);
    }
  }, [user?.id]);

  // Fetch full astronomical chart from database / engine
  const fetchChart = async (dataToSubmit) => {
    const target = dataToSubmit || birthData;
    if (!target || !target.dob || !target.tob) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('astromath_token');
      const res = await fetch('/api/chart/save-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...target,
          userId: user?.id || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setChartData(data.chart);
      setBirthData(data.profile);
      fetchDaily(data.profile);
    } catch (err) {
      console.error('Error fetching chart:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDaily = async (dataToSubmit) => {
    const target = dataToSubmit || birthData;
    if (!target) return;
    try {
      const res = await fetch('/api/chart/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target),
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
          lang: lang,
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
    if (birthData && !chartData) {
      fetchChart(birthData);
    } else if (birthData && chartData && !dailyData) {
      fetchDaily(birthData);
    }
  }, [birthData]);

  const handleUpdateBirthData = (e) => {
    e.preventDefault();
    setShowMobileParams(false);
    fetchChart(birthData);
  };

  const handleProfileCreated = (newProfile, newChart) => {
    setBirthData(newProfile);
    setChartData(newChart);
    setBirthModalOpen(false);
    fetchDaily(newProfile);
  };

  // If user has not yet entered compulsory birth coordinates, display compulsory setup screen
  if (!birthData || !birthData.dob || !birthData.tob) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-20">
        <BirthCoordinatesModal
          isOpen={true}
          onProfileSaved={handleProfileCreated}
          onClose={() => {
            if (onReturnHome) onReturnHome();
          }}
        />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: t.tabs.overview, icon: LayoutDashboard },
    { id: 'kundali', label: t.tabs.kundali, icon: Compass },
    { id: 'daily', label: t.tabs.daily, icon: Sun },
    { id: 'numerology', label: t.tabs.numerology, icon: Hash },
    { id: 'couple_kundali', label: t.tabs.couple_kundali, icon: Heart },
    { id: 'couple_numerology', label: t.tabs.couple_numerology, icon: Sparkles },
    { id: 'career', label: t.tabs.career, icon: Briefcase },
    { id: 'marriage', label: t.tabs.marriage, icon: Moon },
    { id: 'dasha', label: t.tabs.dasha, icon: Calendar },
    { id: 'chat', label: t.tabs.chat, icon: MessageSquare },
  ];

  return (
    <div className="relative min-h-screen flex flex-col text-slate-100">
      {/* Top Floating Glass Header */}
      <header className="sticky top-0 z-40 px-3 sm:px-8 py-2.5 sm:py-3.5 bg-black/60 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          {activeTab !== 'overview' && (
            <button
              onClick={() => setActiveTab('overview')}
              className="p-1.5 sm:p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              title={t.header.backToOverview}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-xs text-slate-300 pr-1">{t.header.backToOverview}</span>
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
          <span className="hidden lg:inline-block text-[11px] px-3 py-0.5 rounded-full bg-white/[0.05] text-slate-300 border border-white/10 font-mono">
            {chartData ? `${chartData.lagna?.sign} ${t.header.ascendant}` : 'Aligning...'}
          </span>
        </div>

        {/* Right Header: Language Switcher, User Details, Coordinates */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Trilingual Switcher (मराठी / हिंदी / English) */}
          <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-full bg-white/[0.06] border border-white/10 text-xs">
            {[
              { id: 'mr', label: 'मराठी' },
              { id: 'hi', label: 'हिंदी' },
              { id: 'en', label: 'EN' },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => handleLanguageChange(l.id)}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all ${
                  lang === l.id
                    ? 'bg-white text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Mobile Parameters Edit Button */}
          <button
            onClick={() => setShowMobileParams(!showMobileParams)}
            className="md:hidden px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs text-slate-200 flex items-center gap-1.5 transition-colors"
            title={t.header.editCoordinates}
          >
            <Settings2 className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[11px] font-medium">{birthData.name?.split(' ')[0]}</span>
          </button>

          {/* Desktop User Tag */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs text-slate-200">
            <User className="w-3 h-3 text-slate-400" />
            <span className="font-medium">{birthData.name}</span>
          </div>

          {/* Edit Coordinates Desktop Button */}
          <button
            onClick={() => setBirthModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs text-slate-200 transition-colors"
            title={t.header.editCoordinates}
          >
            <Settings2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.header.coordinatesTitle}</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title={t.header.signOut}
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
              {t.header.editCoordinates}
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
              <label className="text-slate-400 uppercase tracking-wider text-[9px]">पूर्ण नाव (Full Name)</label>
              <input
                type="text"
                required
                value={birthData.name}
                onChange={(e) => setBirthData({ ...birthData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 focus:border-white/30 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 uppercase tracking-wider text-[9px]">जन्म तारीख (DOB)</label>
                <input
                  type="date"
                  required
                  value={birthData.dob}
                  onChange={(e) => setBirthData({ ...birthData, dob: e.target.value })}
                  className="w-full px-2 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 focus:border-white/30 outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 uppercase tracking-wider text-[9px]">जन्म वेळ (TOB)</label>
                <input
                  type="time"
                  required
                  value={birthData.tob}
                  onChange={(e) => setBirthData({ ...birthData, tob: e.target.value })}
                  className="w-full px-2 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 focus:border-white/30 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-slate-400 uppercase tracking-wider text-[9px]">जन्म ठिकाण (City)</label>
              <input
                type="text"
                required
                value={birthData.city}
                onChange={(e) => setBirthData({ ...birthData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-0.5 focus:border-white/30 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors mt-1"
            >
              जतन करा (Save & Recalculate)
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
                {t.header.coordinatesTitle}
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
                <label className="text-slate-400 uppercase tracking-wider text-[9.5px]">नाव (Name)</label>
                <input
                  type="text"
                  required
                  value={birthData.name}
                  onChange={(e) => setBirthData({ ...birthData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-1 focus:border-white/30 outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 uppercase tracking-wider text-[9.5px]">तारीख (Date)</label>
                  <input
                    type="date"
                    required
                    value={birthData.dob}
                    onChange={(e) => setBirthData({ ...birthData, dob: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-1 focus:border-white/30 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-slate-400 uppercase tracking-wider text-[9.5px]">वेळ (Time)</label>
                  <input
                    type="time"
                    required
                    value={birthData.tob}
                    onChange={(e) => setBirthData({ ...birthData, tob: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-1 focus:border-white/30 outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 uppercase tracking-wider text-[9.5px]">ठिकाण (City)</label>
                <input
                  type="text"
                  required
                  value={birthData.city}
                  onChange={(e) => setBirthData({ ...birthData, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-white mt-1 focus:border-white/30 outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/15 font-semibold text-[11px] uppercase tracking-wider transition-colors mt-2"
              >
                जतन करा (Save)
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
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs tracking-wide transition-all ${
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
                कुंडली तयार होत आहे...
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-light">
                पायथन खगोलीय इंजिनद्वारे सर्व ग्रहांची अचूक स्थिती काढली जात आहे.
              </p>
            </div>
          ) : !chartData ? (
            <div className="p-8 text-center text-slate-400 bg-white/[0.03] rounded-3xl border border-white/10">
              <p>जन्म माहिती लोड होऊ शकली नाही.</p>
              <button
                onClick={() => setBirthModalOpen(true)}
                className="mt-3 px-4 py-2 rounded-full bg-white text-slate-950 font-bold text-xs"
              >
                {t.header.editCoordinates}
              </button>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW SUMMARY */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl">
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        {t.overview.lagnaCard}
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
                        {t.overview.moonCard}
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
                        {t.overview.sunCard}
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
                        {t.overview.dashaCard}
                      </span>
                      <div className="text-lg sm:text-xl font-bold text-white font-sans mt-1">
                        {chartData.currentDasha?.maha} - {chartData.currentDasha?.antar}
                      </div>
                      <span className="text-[11px] sm:text-xs text-slate-300 font-mono mt-0.5 block">
                        {t.overview.until} {chartData.currentDasha?.until}
                      </span>
                    </div>
                  </div>

                  {/* Planetary Coordinates Table */}
                  <div className="p-4 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 sm:mb-5">
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        {t.overview.planetTableTitle}
                      </h3>
                      <span className="text-[11px] sm:text-xs font-mono text-slate-400">
                        {t.overview.ayanamsaOffset}: {chartData.ayanamsa?.toFixed(2)}°
                      </span>
                    </div>

                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <table className="w-full text-left text-xs text-slate-300 min-w-[500px]">
                        <thead className="bg-white/[0.02] text-slate-400 uppercase text-[9.5px] sm:text-[10px] tracking-wider border-b border-white/10">
                          <tr>
                            <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">{t.overview.colPlanet}</th>
                            <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">{t.overview.colSign}</th>
                            <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">{t.overview.colDeg}</th>
                            <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">{t.overview.colHouse}</th>
                            <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">{t.overview.colNak}</th>
                            <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">{t.overview.colPada}</th>
                            <th className="py-2.5 sm:py-3 px-3 sm:px-4 font-semibold">{t.overview.colSpeed}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-medium">
                          {Object.entries(chartData.planets || {}).map(([name, p]) => (
                            <tr key={name} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-bold text-white">
                                {p.nameMr || name} <span className="text-slate-400 font-normal">({name})</span>
                              </td>
                              <td className="py-2.5 sm:py-3 px-3 sm:px-4">{p.sign}</td>
                              <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-mono text-white">{p.degreeFormatted}</td>
                              <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-mono">{t.overview.housePrefix} {p.house}</td>
                              <td className="py-2.5 sm:py-3 px-3 sm:px-4">{p.nakshatra}</td>
                              <td className="py-2.5 sm:py-3 px-3 sm:px-4 font-mono">{p.pada}</td>
                              <td className="py-2.5 sm:py-3 px-3 sm:px-4">
                                {p.isRetrograde ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[9.5px]">
                                    {t.overview.retro}
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[9.5px]">
                                    {t.overview.direct}
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

              {/* TAB 2: KUNDALI CHARTS */}
              {activeTab === 'kundali' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Selector Pills */}
                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 w-fit overflow-x-auto">
                    {[
                      { id: 'D1', label: t.kundali.d1Wheel },
                      { id: 'D9', label: t.kundali.d9Wheel },
                      { id: 'D10', label: t.kundali.d10Wheel },
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

                  {/* Centerpiece Layout for the Kundali Chart */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 items-start">
                    <div className="xl:col-span-7 flex justify-center w-full">
                      <KundaliChart
                        chartType={selectedChartType}
                        lagnaSign={chartData.divisionalCharts?.[selectedChartType]?.lagnaSign || chartData.lagna?.signNumber || 1}
                        houses={chartData.divisionalCharts?.[selectedChartType]?.houses || {}}
                        title={
                          selectedChartType === 'D1'
                            ? t.kundali.d1Wheel
                            : selectedChartType === 'D9'
                            ? t.kundali.d9Wheel
                            : t.kundali.d10Wheel
                        }
                        size={540}
                      />
                    </div>

                    <div className="xl:col-span-5 p-5 sm:p-7 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-4 shadow-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] text-amber-300 border border-white/10 text-xs font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>कुंडली स्पष्टीकरण</span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        {selectedChartType === 'D1' && t.kundali.d1Wheel}
                        {selectedChartType === 'D9' && t.kundali.d9Wheel}
                        {selectedChartType === 'D10' && t.kundali.d10Wheel}
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        {selectedChartType === 'D1' && t.kundali.d1Desc}
                        {selectedChartType === 'D9' && t.kundali.d9Desc}
                        {selectedChartType === 'D10' && t.kundali.d10Desc}
                      </p>

                      <div className="pt-2">
                        <button
                          onClick={() => setActiveTab('chat')}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{t.kundali.consultOracle}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DAILY TRANSITS & TODAY'S DAY */}
              {activeTab === 'daily' && (
                <div className="space-y-6 animate-fadeIn">
                  {dailyData ? (
                    <>
                      {/* Live Gochar Header & Panchanga Bar */}
                      <div className="p-5 sm:p-7 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <Orbit className="w-5 h-5 text-amber-300 animate-spin-slow" />
                              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                                {t.daily.title}
                              </h3>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 font-light">
                              {t.daily.subtitle}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 self-start md:self-auto">
                            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                              {t.daily.transitForce}:
                            </span>
                            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.08] text-amber-300 border border-white/15 text-sm font-bold font-mono">
                              {dailyData.overallScore || '7.5'} / 10
                            </span>
                          </div>
                        </div>

                        {/* Live Panchanga Quick Bar */}
                        {dailyData.panchang && (
                          <div className="pt-2 flex flex-wrap gap-2 text-xs">
                            <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300">
                              <span className="text-slate-400 font-medium">{t.daily.tithi}: </span>
                              <strong className="text-white">{dailyData.panchang.tithi}</strong>
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300">
                              <span className="text-slate-400 font-medium">{t.daily.vaar}: </span>
                              <strong className="text-white">{dailyData.panchang.vaar}</strong>
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300">
                              <span className="text-slate-400 font-medium">{t.daily.moonNak}: </span>
                              <strong className="text-white">{dailyData.panchang.nakshatra}</strong>
                            </span>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] ml-auto">
                              Python Ephem Real-Time
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 4 Key Planetary Influences Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 1. Shani Sade Sati */}
                        <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                {t.daily.sadeSatiTitle}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                dailyData.sadeSati?.hasSadeSati
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              }`}>
                                {dailyData.sadeSati?.hasSadeSati ? 'प्रभाव सक्रिय' : 'साडेसाती नाही'}
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-white mt-2">
                              {dailyData.sadeSati?.status || 'साडेसाती विश्लेषण'}
                            </h4>
                            <p className="text-[11px] text-slate-300 mt-2 font-light leading-relaxed">
                              {dailyData.sadeSati?.description}
                            </p>
                          </div>
                        </div>

                        {/* 2. Guru Gochar */}
                        <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                {t.daily.guruTitle}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                dailyData.guruGochar?.isFavorable
                                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-white/10 text-slate-300 border border-white/15'
                              }`}>
                                {dailyData.guruGochar?.isFavorable ? t.daily.favorable : t.daily.moderate}
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-white mt-2">
                              {dailyData.guruGochar?.status || 'गुरू भ्रमण'}
                            </h4>
                            <p className="text-[11px] text-slate-300 mt-2 font-light leading-relaxed">
                              {dailyData.guruGochar?.description}
                            </p>
                          </div>
                        </div>

                        {/* 3. Chandra Bala */}
                        <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                {t.daily.chandraTitle}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                                {dailyData.chandraBala?.status}
                              </span>
                            </div>
                            <h4 className="text-xl font-bold text-white mt-2 font-mono">
                              {dailyData.chandraBala?.score} / 10
                            </h4>
                            <p className="text-[11px] text-slate-300 mt-2 font-light leading-relaxed">
                              {dailyData.chandraBala?.description}
                            </p>
                          </div>
                        </div>

                        {/* 4. Tara Bala */}
                        <div className="p-5 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                {t.daily.taraTitle}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                dailyData.taraBala?.auspicious
                                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              }`}>
                                {dailyData.taraBala?.auspicious ? t.daily.favorable : t.daily.moderate}
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-white mt-2">
                              {dailyData.taraBala?.taraName || 'तारा चक्र'}
                            </h4>
                            <p className="text-[11px] text-slate-300 mt-2 font-light leading-relaxed">
                              {dailyData.taraBala?.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Live 9-Graha Real-Time Planetary Transit Table */}
                      {dailyData.transitPlanets && (
                        <div className="p-5 sm:p-7 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-xl space-y-4">
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                              <Activity className="w-4 h-4 text-amber-300" />
                              {t.daily.live9PlanetsTitle}
                            </h3>
                            <p className="text-xs text-slate-400 font-light mt-0.5">
                              {t.daily.live9PlanetsSubtitle}
                            </p>
                          </div>

                          <div className="overflow-x-auto no-scrollbar pt-2">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-white/10 text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                                  <th className="py-3 px-3">{t.overview.colPlanet}</th>
                                  <th className="py-3 px-3">{t.overview.colSign} &amp; {t.overview.colDeg}</th>
                                  <th className="py-3 px-3">{t.overview.colNak}</th>
                                  <th className="py-3 px-3 text-center">{t.daily.colMotion}</th>
                                  <th className="py-3 px-3 text-center">{t.daily.colFromLagna}</th>
                                  <th className="py-3 px-3 text-center">{t.daily.colFromMoon}</th>
                                  <th className="py-3 px-3 text-center">{t.daily.colResult}</th>
                                  <th className="py-3 px-3">{t.daily.colEffect}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 font-light">
                                {Object.values(dailyData.transitPlanets).map((p) => (
                                  <tr key={p.name} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="py-3 px-3 whitespace-nowrap font-medium text-white flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                                      <span>{p.nameMr || p.name}</span>
                                      <span className="text-slate-400 font-normal">({p.name})</span>
                                    </td>
                                    <td className="py-3 px-3 whitespace-nowrap">
                                      <span className="font-semibold text-slate-200">{p.sign}</span>
                                      <span className="block text-[10px] text-slate-400 font-mono">{p.degreeFormatted}</span>
                                    </td>
                                    <td className="py-3 px-3 whitespace-nowrap text-slate-300 text-[11px]">
                                      {p.nakshatra} <span className="text-slate-400">({p.pada} चरण)</span>
                                    </td>
                                    <td className="py-3 px-3 text-center whitespace-nowrap">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                        p.isRetrograde
                                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                      }`}>
                                        {p.isRetrograde ? t.overview.retro : t.overview.direct}
                                      </span>
                                    </td>
                                    <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-slate-200">
                                      {p.houseFromLagna} वे स्थान
                                    </td>
                                    <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-slate-200">
                                      {p.houseFromMoon} वे स्थान
                                    </td>
                                    <td className="py-3 px-3 text-center whitespace-nowrap">
                                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        p.isFavorable
                                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                          : 'bg-white/10 text-slate-300 border border-white/15'
                                      }`}>
                                        {p.isFavorable ? t.daily.favorable : t.daily.moderate}
                                      </span>
                                    </td>
                                    <td className="py-3 px-3 text-[11px] text-slate-300 max-w-xs leading-relaxed">
                                      {p.effectSummary}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Daily Guidance & Forecast */}
                      <div className="p-5 sm:p-7 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-4 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-300" />
                              दैनिक गोचर मार्गदर्शन (Daily Synthesis)
                            </h3>
                            <p className="text-xs text-slate-400 font-light mt-0.5">
                              आजच्या ग्रहमानानुसार तुमच्या पत्रिकेसाठी विशेष सल्ला.
                            </p>
                          </div>
                          <button
                            onClick={() => fetchAiReport('daily')}
                            disabled={aiLoading}
                            className="px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs disabled:opacity-50 hover:bg-slate-100 transition-all shadow-md self-start sm:self-auto"
                          >
                            {aiLoading ? t.daily.aiReportLoading : t.daily.aiReportBtn}
                          </button>
                        </div>

                        <div className="p-4 sm:p-6 rounded-2xl bg-black/40 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-light">
                          {aiReport?.daily ||
                            dailyData.summary ||
                            'आजच्या दिवसाचे सविस्तर मार्गदर्शन मिळवण्यासाठी वरील बटण दाबा.'}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-12 text-center text-slate-400 bg-white/[0.03] rounded-3xl border border-white/10 flex flex-col items-center justify-center">
                      <Compass className="w-8 h-8 text-white animate-spin-slow mb-3" />
                      <p className="text-sm font-medium text-white">ग्रह गोचर तपासत आहोत...</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PERSONAL NUMEROLOGY */}
              {activeTab === 'numerology' && (
                <PersonalNumerology birthData={birthData} lang={lang} t={t} />
              )}

              {/* TAB 5: COUPLE KUNDALI MATCH (36 GUNAS) */}
              {activeTab === 'couple_kundali' && (
                <CoupleKundaliMatch userProfile={birthData} lang={lang} t={t} />
              )}

              {/* TAB 6: COUPLE NUMEROLOGY */}
              {activeTab === 'couple_numerology' && (
                <CoupleNumerology userProfile={birthData} lang={lang} t={t} />
              )}

              {/* TAB 7: CAREER & JOB */}
              {activeTab === 'career' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-5 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-5 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-white" />
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                            {t.career.title}
                          </h3>
                          <p className="text-xs text-slate-400 font-light mt-0.5">
                            {t.career.subtitle}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => fetchAiReport('career')}
                        disabled={aiLoading}
                        className="px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-slate-100 disabled:opacity-50 transition-all self-start sm:self-auto"
                      >
                        {aiLoading ? t.career.generating : t.career.generateBtn}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">{t.career.tenthLord}</span>
                        <div className="font-bold text-white text-base mt-1">
                          {chartData.careerAnalysis?.tenthLord || 'शुभ ग्रह'}
                        </div>
                        <span className="text-[11px] text-slate-300 font-mono">
                          {chartData.careerAnalysis?.tenthHouseSign || 'दशम भाव'}
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">{t.career.domains}</span>
                        <div className="font-bold text-white text-sm sm:text-base mt-1">
                          {chartData.careerAnalysis?.favorableDomains || 'Technology, Leadership & Consulting'}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">{t.career.inclination}</span>
                        <div className="font-bold text-emerald-300 text-sm sm:text-base mt-1">
                          {chartData.careerAnalysis?.inclination || 'प्रगती व अधिकार पद'}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-light mt-4">
                      {aiReport?.career ||
                        chartData.careerAnalysis?.summary ||
                        'करिअरमधील प्रगती, नोकरीचे योग आणि व्यवसाय संधी जाणून घेण्यासाठी वरील बटण दाबा.'}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: MARRIAGE & LOVE */}
              {activeTab === 'marriage' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-5 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 space-y-5 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-rose-400" />
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                            {t.marriage.title}
                          </h3>
                          <p className="text-xs text-slate-400 font-light mt-0.5">
                            {t.marriage.subtitle}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => fetchAiReport('marriage')}
                        disabled={aiLoading}
                        className="px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-slate-100 disabled:opacity-50 transition-all self-start sm:self-auto"
                      >
                        {aiLoading ? t.marriage.generating : t.marriage.generateBtn}
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
                              ? 'मंगळ प्रभाव (Kuja Energy Active)'
                              : 'मंगळ दोष नाही (No Mangal Dosha)'}
                          </div>
                          <div className="text-xs text-slate-300 mt-1 font-light">
                            {chartData.marriageAnalysis?.doshaDetails}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/5 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-light mt-4">
                      {aiReport?.marriage ||
                        chartData.marriageAnalysis?.summary ||
                        'विवाह योग, जोडीदाराचे गुणधर्म आणि वैवाहिक सौख्याबद्दल सविस्तर माहिती मिळवण्यासाठी वरील बटण दाबा.'}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: VIMSHOTTARI DASHA */}
              {activeTab === 'dasha' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-5 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight">
                      {t.dasha.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-light mb-6">
                      {t.dasha.subtitle}
                    </p>
                    <DashaTimeline dashaData={chartData.dashaTimeline || []} />
                  </div>
                </div>
              )}

              {/* TAB 10: AI ASTROLOGER CHAT */}
              {activeTab === 'chat' && (
                <AIChatbot
                  chartData={chartData}
                  nativeName={birthData.name}
                  lang={lang}
                  t={t}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Edit Coordinates Modal */}
      <BirthCoordinatesModal
        isOpen={birthModalOpen}
        onClose={() => setBirthModalOpen(false)}
        currentProfile={birthData}
        onProfileSaved={handleProfileCreated}
      />
    </div>
  );
}
