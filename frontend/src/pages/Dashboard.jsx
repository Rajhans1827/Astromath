import { useState, useEffect } from 'react';
import {
  Compass, LayoutDashboard, Sun, Moon, Briefcase, Heart, Calendar,
  MessageSquare, Sparkles, User, RefreshCw, ChevronRight, LogOut, CheckCircle2, AlertTriangle
} from 'lucide-react';
import KundaliChart from '../components/KundaliChart';
import DashaTimeline from '../components/DashaTimeline';
import AIChatbot from '../components/AIChatbot';
import { planetsList } from '../assets/planets';

export default function Dashboard({ user, initialBirthData, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  // 'overview' | 'kundali' | 'daily' | 'career' | 'marriage' | 'dasha' | 'chat'
  
  const [birthData, setBirthData] = useState(
    initialBirthData || {
      name: user?.name || 'राजहंस (Rajhans)',
      dob: '1998-05-15',
      tob: '08:30',
      city: 'Pune, Maharashtra, India',
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

  // Fetch full astronomical chart from backend
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

      // Also fetch today's daily transit analysis
      fetchDaily(dataToSubmit || birthData);
    } catch (err) {
      console.error('Error fetching chart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Daily Gochar Analysis
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

  // Request AI Deep Interpretation for specific domain (career, marriage, daily)
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
    <div className="relative z-10 min-h-screen flex flex-col bg-[#030712]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 px-6 py-3.5 cosmic-glass border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <Compass className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <span className="font-cinzel text-lg font-bold text-white tracking-widest">
            ASTRO<span className="text-amber-400">MATH</span>
          </span>
          <span className="hidden sm:inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {chartData ? `${chartData.lagna?.sign} Lagna` : 'Calculating...'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-white">{birthData.name}</span>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-4">
          {/* Birth Profile Mini-Editor */}
          <div className="p-4 rounded-2xl cosmic-glass border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                जन्म तपशील (Birth Profile)
              </h4>
              <button
                onClick={() => fetchChart()}
                className="text-amber-400 hover:text-amber-300 p-1"
                title="Recalculate Chart"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <form onSubmit={handleUpdateBirthData} className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-400">नाव:</label>
                <input
                  type="text"
                  value={birthData.name}
                  onChange={(e) => setBirthData({ ...birthData, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white mt-0.5 focus:border-amber-400 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="text-slate-400">तारीख:</label>
                  <input
                    type="date"
                    value={birthData.dob}
                    onChange={(e) => setBirthData({ ...birthData, dob: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white mt-0.5 focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400">वेळ:</label>
                  <input
                    type="time"
                    value={birthData.tob}
                    onChange={(e) => setBirthData({ ...birthData, tob: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white mt-0.5 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400">गाव / शहर:</label>
                <input
                  type="text"
                  value={birthData.city}
                  onChange={(e) => setBirthData({ ...birthData, city: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white mt-0.5 focus:border-amber-400 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-medium transition-colors"
              >
                तपशील अपडेट करा
              </button>
            </form>
          </div>

          {/* Navigation Tabs */}
          <nav className="p-2 rounded-2xl cosmic-glass border border-slate-800 space-y-1">
            {[
              { id: 'overview', label: 'सर्वसाधारण आढावा', icon: LayoutDashboard },
              { id: 'kundali', label: 'जन्मकुंडली (D1, D9, D10)', icon: Compass },
              { id: 'daily', label: 'आजचा दिवस कसा असेल?', icon: Sun },
              { id: 'career', label: 'करिअर व व्यवसाय (D10)', icon: Briefcase },
              { id: 'marriage', label: 'विवाह व संबंध (D9)', icon: Heart },
              { id: 'dasha', label: 'विंशोत्तरी दशा (१२० वर्षे)', icon: Calendar },
              { id: 'chat', label: 'AI ज्योतिषी विचारमंथन', icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Dynamic Content Pane */}
        <main className="flex-1 space-y-6">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center text-center p-8 rounded-3xl cosmic-glass border border-slate-800">
              <Compass className="w-12 h-12 text-amber-400 animate-spin-slow mb-4" />
              <h3 className="text-lg font-cinzel font-bold text-white">
                Swiss Ephemeris गणिताची प्रक्रिया सुरू आहे...
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                लाहिरी अयनांश, लग्न भाव आणि विंशोत्तरी दशा अचूक काढत आहे
              </p>
            </div>
          ) : !chartData ? (
            <div className="p-8 text-center text-slate-400 cosmic-glass rounded-2xl">
              डेटा लोड करण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Cosmic Summary Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl cosmic-glass border border-amber-500/20">
                      <span className="text-xs text-slate-400">लग्न (Ascendant)</span>
                      <div className="text-lg font-bold text-white font-cinzel mt-1">
                        {chartData.lagna?.sign}
                      </div>
                      <span className="text-[11px] text-amber-400">
                        {chartData.lagna?.degreeFormatted}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl cosmic-glass border border-blue-500/20">
                      <span className="text-xs text-slate-400">चंद्र रास (Moon Sign)</span>
                      <div className="text-lg font-bold text-white font-cinzel mt-1">
                        {chartData.planets?.Moon?.sign}
                      </div>
                      <span className="text-[11px] text-blue-400">
                        {chartData.planets?.Moon?.nakshatra}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl cosmic-glass border border-yellow-500/20">
                      <span className="text-xs text-slate-400">सूर्य रास (Sun Sign)</span>
                      <div className="text-lg font-bold text-white font-cinzel mt-1">
                        {chartData.planets?.Sun?.sign}
                      </div>
                      <span className="text-[11px] text-yellow-400">
                        {chartData.planets?.Sun?.degreeFormatted}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl cosmic-glass border border-purple-500/20">
                      <span className="text-xs text-slate-400">चालू महादशा (Current Dasha)</span>
                      <div className="text-lg font-bold text-white font-cinzel mt-1">
                        {chartData.currentDasha?.maha} - {chartData.currentDasha?.antar}
                      </div>
                      <span className="text-[11px] text-purple-400">
                        {chartData.currentDasha?.until} पर्यंत
                      </span>
                    </div>
                  </div>

                  {/* Planetary Positions Table */}
                  <div className="p-6 rounded-3xl cosmic-glass border border-slate-800 overflow-hidden">
                    <h3 className="font-cinzel text-base font-bold text-white mb-4 flex items-center justify-between">
                      <span>नवग्रह स्पष्ट स्थिती (Planetary Longitudes & Dignity)</span>
                      <span className="text-xs font-mono text-slate-400">
                        Ayanamsa: Lahiri ({chartData.ayanamsa?.toFixed(2)}°)
                      </span>
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                          <tr>
                            <th className="py-2.5 px-3">ग्रह (Planet)</th>
                            <th className="py-2.5 px-3">राशी (Sign)</th>
                            <th className="py-2.5 px-3">अंश (Degree)</th>
                            <th className="py-2.5 px-3">भाव (House)</th>
                            <th className="py-2.5 px-3">नक्षत्र (Nakshatra)</th>
                            <th className="py-2.5 px-3">चरण (Pada)</th>
                            <th className="py-2.5 px-3">गती / स्थिती</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-medium">
                          {Object.entries(chartData.planets || {}).map(([name, p]) => (
                            <tr key={name} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-2.5 px-3 flex items-center gap-2 font-bold text-white">
                                <span>{name}</span>
                              </td>
                              <td className="py-2.5 px-3">{p.sign}</td>
                              <td className="py-2.5 px-3 font-mono text-amber-300">{p.degreeFormatted}</td>
                              <td className="py-2.5 px-3 font-mono">{p.house} वा भाव</td>
                              <td className="py-2.5 px-3">{p.nakshatra}</td>
                              <td className="py-2.5 px-3 font-mono">{p.pada}</td>
                              <td className="py-2.5 px-3">
                                {p.isRetrograde ? (
                                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px]">
                                    वक्री (Retrograde)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">
                                    मार्गी (Direct)
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
                  <div className="flex items-center gap-2 p-1.5 rounded-2xl cosmic-glass border border-slate-800 w-fit">
                    {[
                      { id: 'D1', label: 'लग्न कुंडली (D1)', desc: 'मुख्य जीवन व शरीर' },
                      { id: 'D9', label: 'नवांश कुंडली (D9)', desc: 'विवाह व भाग्योदय' },
                      { id: 'D10', label: 'दशांश कुंडली (D10)', desc: 'करिअर व प्रतिष्ठा' },
                    ].map((chart) => (
                      <button
                        key={chart.id}
                        onClick={() => setSelectedChartType(chart.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                          selectedChartType === chart.id
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {chart.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                    <KundaliChart
                      chartType={selectedChartType}
                      lagnaSign={chartData.divisionalCharts?.[selectedChartType]?.lagnaSign || chartData.lagna?.signNumber || 1}
                      houses={chartData.divisionalCharts?.[selectedChartType]?.houses || {}}
                      title={`${selectedChartType} चक्र (${
                        selectedChartType === 'D1' ? 'Lagna' : selectedChartType === 'D9' ? 'Navamsha' : 'Dashamsha'
                      })`}
                    />

                    {/* Chart Meaning Card */}
                    <div className="p-6 rounded-3xl cosmic-glass border border-slate-800 space-y-4">
                      <h4 className="font-cinzel text-lg font-bold text-amber-400">
                        {selectedChartType === 'D1' && 'D1 लग्न कुंडलीचे महत्त्व'}
                        {selectedChartType === 'D9' && 'D9 नवांश कुंडलीचे महत्त्व (विवाह व आंतरिक बल)'}
                        {selectedChartType === 'D10' && 'D10 दशांश कुंडलीचे महत्त्व (करिअर व पद प्रतिष्ठा)'}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedChartType === 'D1' &&
                          'D1 ही तुमची मूळ जन्मकुंडली आहे. यावरून तुमचे व्यक्तिमत्त्व, आरोग्य, विचारसरणी आणि संपूर्ण जीवनाचा पाया समजतो. १ ले घर (लग्न) आत्म्याचे प्रतिनिधित्व करते.'}
                        {selectedChartType === 'D9' &&
                          'नवांश कुंडली ही राशीचक्राचा नववा भाग असते. वैदिक ज्योतिषात लग्नानंतरचे आयुष्य, जोडीदाराचा स्वभाव, विवाहाचे सुख आणि भाग्योदय पाहण्यासाठी D9 सर्वात अनिवार्य मानली जाते.'}
                        {selectedChartType === 'D10' &&
                          'दशांश कुंडली ही १० व्या भावाची सूक्ष्म कुंडली आहे. नोकरीत बढती, व्यवसायात नफा, अधिकार, समाजातील प्रतिष्ठा आणि करिअरमधील मोठे बदल तपासण्यासाठी D10 चा वापर होतो.'}
                      </p>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setActiveTab('chat');
                          }}
                          className="px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30 transition-colors flex items-center gap-2"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI ला या कुंडलीबद्दल सविस्तर विचारा</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DAILY HOROSCOPE (आजचा दिवस) */}
              {activeTab === 'daily' && (
                <div className="space-y-6">
                  {dailyData ? (
                    <>
                      {/* Chandra Bala & Tara Bala Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl cosmic-glass border border-emerald-500/30 bg-emerald-500/5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-semibold uppercase">
                              चंद्रबल (Chandra Bala)
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                              {dailyData.chandraBala?.status}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold font-cinzel text-white mt-2">
                            {dailyData.chandraBala?.score}/10
                          </h3>
                          <p className="text-xs text-slate-300 mt-2">
                            आज गोचर चंद्र तुमच्या जन्मराशीपासून {dailyData.chandraBala?.houseFromMoon} व्या भावातून जात आहे. {dailyData.chandraBala?.description}
                          </p>
                        </div>

                        <div className="p-6 rounded-3xl cosmic-glass border border-purple-500/30 bg-purple-500/5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-semibold uppercase">
                              ताराबल (Tara Bala)
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold">
                              {dailyData.taraBala?.taraName} तारा
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold font-cinzel text-white mt-2">
                            {dailyData.taraBala?.auspicious ? 'शुभ (Favorable)' : 'मध्यम/सावध'}
                          </h3>
                          <p className="text-xs text-slate-300 mt-2">
                            {dailyData.taraBala?.description}
                          </p>
                        </div>
                      </div>

                      {/* AI Daily Guidance */}
                      <div className="p-6 rounded-3xl cosmic-glass border border-amber-500/25 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            आजच्या दिवसाचे वैयक्तिक AI विश्लेषण (Daily Deep Dive)
                          </h3>
                          <button
                            onClick={() => fetchAiReport('daily')}
                            disabled={aiLoading}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs disabled:opacity-50"
                          >
                            {aiLoading ? 'विश्लेषण चालू...' : 'नवीन विश्लेषण मिळवा'}
                          </button>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                          {aiReport?.daily ||
                            dailyData.summary ||
                            'आजच्या दिवसाचे विशेष विश्लेषण मिळवण्यासाठी वरील बटनावर क्लिक करा.'}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center text-slate-400 cosmic-glass rounded-2xl">
                      गोचर डेटा लोड होत आहे...
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CAREER & WEALTH (D10) */}
              {activeTab === 'career' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl cosmic-glass border border-amber-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-400">
                        <Briefcase className="w-5 h-5" />
                        <h3 className="font-cinzel text-lg font-bold text-white">
                          करिअर व व्यवसाय विश्लेषण (10th House & Dashamsha)
                        </h3>
                      </div>
                      <button
                        onClick={() => fetchAiReport('career')}
                        disabled={aiLoading}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md disabled:opacity-50"
                      >
                        {aiLoading ? 'AI तपासत आहे...' : 'AI करिअर ब्लूप्रिंट मिळवा'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[11px] text-slate-400">१० व्या घराचा स्वामी (10th Lord)</span>
                        <div className="font-bold text-white text-sm mt-1">
                          {chartData.careerAnalysis?.tenthLord || 'Mercury'}
                        </div>
                        <span className="text-[10px] text-amber-400">
                          {chartData.careerAnalysis?.tenthLordSign || 'Gemini'} राशीत
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[11px] text-slate-400">अनुकूल क्षेत्रे (Favorable Fields)</span>
                        <div className="font-bold text-white text-sm mt-1">
                          {chartData.careerAnalysis?.favorableDomains || 'Technology, Trade & Finance'}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[11px] text-slate-400">नोकरी की व्यवसाय?</span>
                        <div className="font-bold text-emerald-400 text-sm mt-1">
                          {chartData.careerAnalysis?.inclination || 'Business / Independent Profession'}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line mt-4">
                      {aiReport?.career ||
                        chartData.careerAnalysis?.summary ||
                        'सध्याच्या महादशेत नोकरी बदल, पदोन्नती किंवा नवीन व्यवसायाची वेळ अनुकूल आहे का हे तपासण्यासाठी वरील AI करिअर ब्लूप्रिंट बटनावर क्लिक करा.'}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: MARRIAGE & MANGAL DOSHA (D9) */}
              {activeTab === 'marriage' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl cosmic-glass border border-pink-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-pink-400">
                        <Heart className="w-5 h-5" />
                        <h3 className="font-cinzel text-lg font-bold text-white">
                          विवाह, जोडीदार व मंगळ दोष तपासणी (7th House & Navamsha)
                        </h3>
                      </div>
                      <button
                        onClick={() => fetchAiReport('marriage')}
                        disabled={aiLoading}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs shadow-md disabled:opacity-50"
                      >
                        {aiLoading ? 'AI तपासत आहे...' : 'AI विवाह विश्लेषण मिळवा'}
                      </button>
                    </div>

                    {/* Mangal Dosha Status Banner */}
                    <div
                      className={`p-4 rounded-2xl border flex items-center justify-between ${
                        chartData.marriageAnalysis?.hasMangalDosha
                          ? 'bg-red-500/10 border-red-500/30 text-red-300'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {chartData.marriageAnalysis?.hasMangalDosha ? (
                          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                        <div>
                          <div className="font-bold text-sm">
                            {chartData.marriageAnalysis?.hasMangalDosha
                              ? 'मंगळ दोष उपस्थित (Mangal Dosha Present)'
                              : 'मंगळ दोष नाही (No Mangal Dosha)'}
                          </div>
                          <div className="text-xs text-slate-300 mt-0.5">
                            {chartData.marriageAnalysis?.doshaDetails ||
                              'मंगळ १, २, ४, ७, ८ किंवा १२ व्या भावात नसल्याने दोष नाही.'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line mt-4">
                      {aiReport?.marriage ||
                        chartData.marriageAnalysis?.summary ||
                        'विवाहाचा अनुकूल काळ, जोडीदाराचे स्वरूप आणि वैवाहिक सुखाचे तपशील मिळवण्यासाठी वरील AI विवाह विश्लेषण बटनावर क्लिक करा.'}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: VIMSHOTTARI DASHA */}
              {activeTab === 'dasha' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl cosmic-glass border border-slate-800">
                    <h3 className="font-cinzel text-lg font-bold text-white mb-6">
                      विंशोत्तरी महादशा व अंतर्दशा टाइमलाईन (१२० वर्षे)
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
