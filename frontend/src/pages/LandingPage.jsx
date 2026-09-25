import { useState } from 'react';
import { Sparkles, Compass, ShieldCheck, ArrowRight, Zap, Stars, Star, Globe, Feather } from 'lucide-react';
import OrbitImages from '../components/OrbitImages';
import { planetsList, planetImages } from '../assets/planets';

export default function LandingPage({ onOpenAuth, onQuickCalculate }) {
  const [quickForm, setQuickForm] = useState({
    name: 'Alexander Vance',
    dob: '1998-05-15',
    tob: '08:30',
    city: 'Pune, India',
    lat: 18.5204,
    lon: 73.8567,
    tz: 5.5,
  });

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    onQuickCalculate(quickForm);
  };

  return (
    <div className="relative z-10 min-h-screen selection:bg-amber-400/20 selection:text-amber-200">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 px-6 sm:px-12 py-5 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-300 via-amber-500 to-purple-600 p-[1px] shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-[#05070D] rounded-2xl flex items-center justify-center">
                <Compass className="w-4 h-4 text-amber-300 animate-spin-slow" />
              </div>
            </div>
            <div>
              <span className="font-cinzel text-xl font-bold tracking-[0.2em] text-white">
                ASTRO<span className="text-amber-300 font-extrabold">MATH</span>
              </span>
              <span className="hidden sm:inline-block ml-3 text-[9.5px] tracking-[0.25em] uppercase px-2.5 py-0.5 rounded-full bg-white/5 text-amber-200/90 border border-white/10 font-medium">
                Celestial Observatory
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-9 text-xs uppercase tracking-widest text-slate-300 font-medium">
            <a href="#orrery" className="hover:text-amber-300 transition-colors">The Orrery</a>
            <a href="#blueprint" className="hover:text-amber-300 transition-colors">Natal Blueprint</a>
            <a href="#harmonics" className="hover:text-amber-300 transition-colors">Harmonics</a>
            <a href="#philosophy" className="hover:text-amber-300 transition-colors">Philosophy</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenAuth('login')}
              className="text-xs uppercase tracking-widest font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2 group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Dominik Koch's Cosmic Orbit Orrery */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden" id="orrery">
        <div className="max-w-7xl mx-auto text-center relative z-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-amber-400/20 text-amber-200 text-xs tracking-wider uppercase font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>True Sidereal Astrometry & Cosmic Synthesis</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-cinzel font-semibold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
            The Celestial Architecture of{' '}
            <span className="bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 bg-clip-text text-transparent italic font-normal">
              Your Destiny.
            </span>
          </h1>

          <p className="mt-7 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Transcend generic astrology. AstroMath unites pure planetary geometry with the profound philosophical depth of ancient sidereal wisdom—illuminating your vocation, relationships, and life cycles.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-xl shadow-amber-400/25 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Explore Your Blueprint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#blueprint"
              className="px-7 py-4 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/30 text-white font-medium text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Instant Chart
            </a>
          </div>
        </div>

        {/* Orbit Visualizer with Realistic Transparent Planets */}
        <div className="mt-12 max-w-6xl mx-auto relative">
          <OrbitImages
            images={planetImages}
            altPrefix="Celestial Body"
            shape="ellipse"
            baseWidth={1400}
            radiusX={630}
            radiusY={210}
            duration={36}
            itemSize={82}
            rotation={-6}
            showPath={true}
            pathColor="rgba(245, 158, 11, 0.25)"
            responsive={true}
            centerContent={
              <div className="relative group cursor-pointer text-center p-6">
                <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-amber-400/10 via-purple-500/10 to-amber-300/10 backdrop-blur-2xl border border-amber-300/30 flex flex-col items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
                  <Stars className="w-7 h-7 text-amber-300 mb-1" />
                  <span className="text-xs font-cinzel font-bold text-white tracking-[0.25em]">
                    THE ORRERY
                  </span>
                  <span className="text-[10px] text-amber-200/80 font-mono tracking-widest uppercase mt-0.5">
                    Nine Spheres
                  </span>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Planetary Cards */}
      <section className="py-10 px-6 border-y border-white/5 bg-[#05070D]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {planetsList.map((p) => (
              <div
                key={p.name}
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-400/25 flex flex-col items-center text-center transition-all hover:-translate-y-1"
              >
                <img
                  src={p.src}
                  alt={p.name}
                  className="w-12 h-12 object-contain drop-shadow-md mb-2"
                />
                <span className="text-xs font-semibold text-white tracking-wide">{p.name}</span>
                <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{p.nature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instant Natal Chart Generator */}
      <section className="py-24 px-6" id="blueprint">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 sm:p-14 rounded-3xl bg-[#080B14] border border-amber-400/20 shadow-2xl shadow-black relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="text-center mb-10">
                <span className="text-[10.5px] uppercase tracking-[0.25em] font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1 rounded-full">
                  Instant Verification
                </span>
                <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-white mt-4">
                  Generate Your Celestial Matrix
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2.5 max-w-xl mx-auto font-light">
                  Input your exact birth parameters to calculate your true ascendant, harmonic divisional matrices, and active planetary era.
                </p>
              </div>

              <form onSubmit={handleQuickSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={quickForm.name}
                    onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-300 mb-2">
                    Birth Location (City, Country)
                  </label>
                  <input
                    type="text"
                    required
                    value={quickForm.city}
                    onChange={(e) => setQuickForm({ ...quickForm, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-300 mb-2">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    required
                    value={quickForm.dob}
                    onChange={(e) => setQuickForm({ ...quickForm, dob: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-300 mb-2">
                    Exact Birth Time
                  </label>
                  <input
                    type="time"
                    required
                    value={quickForm.tob}
                    onChange={(e) => setQuickForm({ ...quickForm, tob: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2 pt-3">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 group"
                  >
                    <Zap className="w-4 h-4 text-slate-950" />
                    <span>Launch AstroMath Sanctuary</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Pillars */}
      <section className="py-24 px-6 border-t border-white/5" id="harmonics">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-300">
              Dimensional Matrices
            </span>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-white mt-2">
              Beyond the Flat Horoscope
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto font-light">
              Harmonic divisional charts unlock the hidden chambers of character, union, and destiny.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-[#080B14] border border-white/5 hover:border-amber-400/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300 mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-white mb-2 tracking-wide">
                Natal Matrix (D1)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                The primary blueprint of your physical incarnation, constitutional vitality, and life foundation, calculated with exact sidereal offsets.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#080B14] border border-white/5 hover:border-purple-400/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-300 mb-6">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-white mb-2 tracking-wide">
                Navamsha Harmonic (D9)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                The sacred 9-fold harmonic of the soul. Reveals spiritual maturity, the deeper karmic partner, and the inner trajectory of your second half of life.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#080B14] border border-white/5 hover:border-emerald-400/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-300 mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-cinzel font-bold text-white mb-2 tracking-wide">
                Dashamsha Harmonic (D10)
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                The 10-fold harmonic of public vocation, leadership authority, and enterprise excellence. Unveils optimal career pivots and status breakthroughs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 px-6 border-t border-white/5 bg-[#030712]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-amber-300" />
            <span className="font-cinzel text-lg font-bold text-white tracking-[0.2em]">
              ASTROMATH
            </span>
          </div>
          <p className="text-xs text-slate-400 font-light">
            © 2026 AstroMath Observatory. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-xs uppercase tracking-widest text-slate-400 font-medium">
            <button onClick={() => onOpenAuth('signup')} className="hover:text-amber-300">Register</button>
            <button onClick={() => onOpenAuth('login')} className="hover:text-amber-300">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
