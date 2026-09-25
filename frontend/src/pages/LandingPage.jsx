import { useState } from 'react';
import { Sparkles, Compass, ShieldCheck, Cpu, ArrowRight, Zap, Stars, Moon, Sun, Award } from 'lucide-react';
import OrbitImages from '../components/OrbitImages';
import { planetsList, planetImages } from '../assets/planets';

export default function LandingPage({ onOpenAuth, onQuickCalculate }) {
  const [quickForm, setQuickForm] = useState({
    name: 'राजहंस (Rajhans)',
    dob: '1998-05-15',
    tob: '08:30',
    city: 'Pune, Maharashtra',
    lat: 18.5204,
    lon: 73.8567,
    tz: 5.5,
  });

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    onQuickCalculate(quickForm);
  };

  return (
    <div className="relative z-10 min-h-screen">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 px-6 py-4 cosmic-glass border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-amber-400 p-[1px] shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <Compass className="w-5 h-5 text-amber-400 animate-spin-slow" />
              </div>
            </div>
            <div>
              <span className="font-cinzel text-xl font-extrabold tracking-widest text-white">
                ASTRO<span className="text-amber-400">MATH</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium">
                Vedic AI Engine
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#features" className="hover:text-amber-400 transition-colors">वैशिष्ट्ये (Features)</a>
            <a href="#orbit-section" className="hover:text-amber-400 transition-colors">नवग्रह भ्रमण (Orbits)</a>
            <a href="#instant-calc" className="hover:text-amber-400 transition-colors">त्वरित गणना (Live Demo)</a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">SaaS आर्किटेक्चर</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2 group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Dominik Koch's Orbit Component & Realistic Planets */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden" id="orbit-section">
        <div className="max-w-7xl mx-auto text-center relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full cosmic-glass-gold border border-amber-500/30 text-amber-300 text-xs font-medium mb-6">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>100% Swiss Ephemeris Precision • Gemini 3.8 Flash Brain</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-cinzel font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            ब्रह्मांडाचे अचूक गणित,{' '}
            <span className="cosmic-text-gradient">बुद्धिमत्ता AI ची.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            ठोकळेबाज आणि रोबोटिक भविष्याला निरोप द्या. <strong className="text-amber-300">AstroMath</strong> हे NASA JPL प्रमाणित Swiss Ephemeris आणि Google Gemini AI चा संगम आहे — जे देईल तुम्हाला करिअर, विवाह आणि दैनंदिन जीवनाचे अचूक, शून्य-भ्रम (Zero Hallucination) मार्गदर्शन.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>तुमची खरी जन्मकुंडली काढा</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#instant-calc"
              className="px-7 py-3.5 rounded-2xl cosmic-glass border border-slate-700 hover:border-amber-500/50 text-white font-medium text-base hover:bg-white/5 transition-all"
            >
              लाइव्ह डेमो पहा
            </a>
          </div>
        </div>

        {/* Orbit Visualizer with Realistic Planets */}
        <div className="mt-10 max-w-6xl mx-auto relative">
          <OrbitImages
            images={planetImages}
            altPrefix="AstroMath Planet"
            shape="ellipse"
            baseWidth={1400}
            radiusX={620}
            radiusY={200}
            duration={36}
            itemSize={84}
            rotation={-6}
            showPath={true}
            pathColor="rgba(245, 158, 11, 0.2)"
            responsive={true}
            centerContent={
              <div className="relative group cursor-pointer text-center p-6 rounded-full">
                <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-xl border border-amber-500/40 flex flex-col items-center justify-center shadow-2xl cosmic-glow group-hover:scale-110 transition-transform">
                  <Stars className="w-8 h-8 text-amber-400 animate-pulse mb-1" />
                  <span className="text-xs font-cinzel font-bold text-white tracking-widest">
                    NAVAGRAHA
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono">
                    ९ ग्रह चक्र
                  </span>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Planetary Legend Showcase */}
      <section className="py-8 px-6 border-y border-white/5 bg-slate-950/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {planetsList.map((p) => (
              <div
                key={p.name}
                className="p-3 rounded-2xl cosmic-glass border border-white/5 hover:border-amber-500/30 flex flex-col items-center text-center transition-all hover:-translate-y-1"
              >
                <img
                  src={p.src}
                  alt={p.name}
                  className="w-12 h-12 object-contain drop-shadow-md mb-2"
                />
                <span className="text-xs font-semibold text-white">{p.name}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{p.nature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instant Calculator Section (Live Preview) */}
      <section className="py-20 px-6" id="instant-calc">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl cosmic-glass border border-amber-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="text-center mb-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
                  Live Engine Test
                </span>
                <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-white mt-3">
                  तुमचे जन्म तपशील भरा आणि प्रत्यक्ष पहा
                </h2>
                <p className="text-sm text-slate-300 mt-2 max-w-xl mx-auto">
                  Swiss Ephemeris च्या अचूक गणिताने तुमची D1, D9, D10 आणि महादशा ताबडतोब तयार होईल.
                </p>
              </div>

              <form onSubmit={handleQuickSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    पूर्ण नाव (Full Name)
                  </label>
                  <input
                    type="text"
                    required
                    value={quickForm.name}
                    onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    जन्म स्थान (Birth City)
                  </label>
                  <input
                    type="text"
                    required
                    value={quickForm.city}
                    onChange={(e) => setQuickForm({ ...quickForm, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    जन्मतारीख (Birth Date)
                  </label>
                  <input
                    type="date"
                    required
                    value={quickForm.dob}
                    onChange={(e) => setQuickForm({ ...quickForm, dob: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    जन्मवेळ (Birth Time - 24 Hr)
                  </label>
                  <input
                    type="time"
                    required
                    value={quickForm.tob}
                    onChange={(e) => setQuickForm({ ...quickForm, tob: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-base transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 group"
                  >
                    <Zap className="w-5 h-5 text-slate-950" />
                    <span>AstroMath डॅशबोर्ड उघडा (Open Dashboard)</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Core SaaS Features */}
      <section className="py-20 px-6 border-t border-white/5" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-white">
              AstroMath चे सामर्थ्य (Core Features)
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
              गणित + AI + क्लाउड आर्किटेक्चरचे परिपूर्ण मिश्रण
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl cosmic-glass border border-white/5 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-cinzel font-bold text-white mb-2">
                Swiss Ephemeris अचूकता
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                NASA JPL DE431 खगोलीय गणितावर आधारित. ०.००१° पर्यंत सूक्ष्म राशी, भाव, नक्षत्र चरण आणि लाहिरी अयनांश स्पष्ट.
              </p>
            </div>

            <div className="p-8 rounded-3xl cosmic-glass border border-white/5 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-cinzel font-bold text-white mb-2">
                Zero Hallucination AI Brain
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                AI स्वतः खोटे ग्रह तयार करत नाही. स्विस इंजिनकडून मिळालेल्या अचूक तथ्यांवर Gemini 3.8 Flash खोलवर मानवी विश्लेषण करते.
              </p>
            </div>

            <div className="p-8 rounded-3xl cosmic-glass border border-white/5 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-cinzel font-bold text-white mb-2">
                Nodemailer OTP & SQL DB
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                ईमेलवर 6-अंकी OTP पाठवून संपूर्ण सुरक्षितता. Cloudflare D1 आणि SQLite शी १००% सुसंगत मॉड्युलर डेटाबेस.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <span className="font-cinzel text-lg font-bold text-white tracking-wider">
              ASTROMATH
            </span>
          </div>
          <p className="text-xs text-slate-400">
            © 2026 AstroMath. Swiss Ephemeris & Gemini AI Vedic Intelligence. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <button onClick={() => onOpenAuth('signup')} className="hover:text-amber-400">Sign Up</button>
            <button onClick={() => onOpenAuth('login')} className="hover:text-amber-400">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
