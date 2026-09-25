import { Sparkles, Compass, ArrowRight, Zap, Stars, ChevronRight, Shield, Flame } from 'lucide-react';
import OrbitImages from '../components/OrbitImages';
import { planetsList, planetImages } from '../assets/planets';

export default function LandingPage({ onOpenAuth, onLaunchDashboard }) {
  return (
    <div className="relative min-h-screen text-white">
      {/* 1. Floating Glassmorphism Pill Navbar (Matching Uploaded Image) */}
      <div className="fixed top-6 inset-x-0 z-50 px-4 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-3xl rounded-full bg-white/[0.04] backdrop-blur-2xl border border-white/10 px-5 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl shadow-black/80">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center text-white">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <span className="font-sans font-bold text-base tracking-tight text-white">
              AstroMath
            </span>
          </div>

          {/* Links */}
          <div className="hidden sm:flex items-center gap-7 text-xs font-medium text-slate-300">
            <a href="#spheres" className="hover:text-white transition-colors">Spheres</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('login')}
              className="text-xs font-semibold text-slate-300 hover:text-white px-2 py-1 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => onLaunchDashboard()}
              className="px-5 py-2 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-all shadow-lg shadow-white/10 hover:scale-105"
            >
              Get started
            </button>
          </div>
        </nav>
      </div>

      {/* 2. Hero Section (Matching Uploaded Image Layout & Fluid Silk Background) */}
      <section className="relative pt-36 sm:pt-44 pb-20 px-6 max-w-5xl mx-auto text-center">
        {/* Centered Pill Badge (Matching "NEW Creative Components" Badge) */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/15 text-xs text-white/90 shadow-inner mb-8">
          <span className="px-2 py-0.5 rounded-full bg-white text-slate-950 font-black text-[9.5px] uppercase tracking-wider">
            NEW
          </span>
          <span className="text-slate-200 font-medium tracking-wide">
            Harmonic Celestial Matrices
          </span>
        </div>

        {/* Big Bold Clean Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto">
          Become emboldened by the rhythm of the cosmos
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Pure sidereal planetary geometry meets enlightened celestial synthesis. Discover your true ascendant, harmonic divisional soul charts, and 120-year cycles.
        </p>

        {/* Two Clean Action Buttons (Solid White + Glass Pill) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onLaunchDashboard()}
            className="px-8 py-3.5 rounded-2xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-all shadow-2xl shadow-white/15 hover:scale-105"
          >
            Get started
          </button>
          <a
            href="#features"
            className="px-8 py-3.5 rounded-2xl bg-white/[0.05] border border-white/15 text-white font-medium text-sm hover:bg-white/10 backdrop-blur-xl transition-all"
          >
            Learn more
          </a>
        </div>

        {/* 3. The Orrery - Dominik Koch's Orbit Component on the Silk Canvas */}
        <div className="mt-16 sm:mt-20 relative" id="spheres">
          <OrbitImages
            images={planetImages}
            altPrefix="Planetary Sphere"
            shape="ellipse"
            baseWidth={1400}
            radiusX={620}
            radiusY={200}
            duration={36}
            itemSize={82}
            rotation={-6}
            showPath={true}
            pathColor="rgba(255, 255, 255, 0.18)"
            pathWidth={1.5}
            responsive={true}
            centerContent={
              <div className="relative group cursor-pointer text-center p-6">
                <div className="w-36 h-36 rounded-full bg-white/[0.04] backdrop-blur-2xl border border-white/20 flex flex-col items-center justify-center shadow-2xl shadow-purple-500/10 group-hover:scale-105 transition-transform">
                  <Flame className="w-6 h-6 text-amber-300 mb-1" />
                  <span className="text-xs font-bold text-white tracking-[0.2em] uppercase">
                    AstroMath
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-0.5">
                    Nine Spheres
                  </span>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* 4. Planetary Spheres Showcase */}
      <section className="py-12 px-6 border-y border-white/5 bg-[#05070D]/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {planetsList.map((p) => (
              <div
                key={p.name}
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 flex flex-col items-center text-center transition-all hover:-translate-y-1"
              >
                <img
                  src={p.src}
                  alt={p.name}
                  className="w-11 h-11 object-contain drop-shadow-lg mb-2"
                />
                <span className="text-xs font-semibold text-white tracking-wide">{p.name}</span>
                <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{p.nature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Minimalist Glassmorphism Pillars (Zero Demo Clutter) */}
      <section className="py-24 px-6 max-w-6xl mx-auto" id="features">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-semibold">
            Dimensional Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
            Crafted for depth and clarity
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto font-light">
            Every layer of your chart is rendered through rigorous sidereal mathematics and harmonic division.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-white/25 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-white mb-6">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
              Natal Matrix (D1)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              The foundational matrix of your physical constitution, vitality, and planetary placements, computed with exact sidereal offsets.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-white/25 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-white mb-6">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
              Navamsha Harmonic (D9)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              The 9-fold harmonic of the soul. Reveals deep partnership synastry, inner strength, and the evolutionary destiny of your life.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-white/25 transition-all shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-white mb-6">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
              Dashamsha Harmonic (D10)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              The 10-fold harmonic of vocation and leadership. Maps optimal industry alignments, executive standing, and strategic career pivots.
            </p>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-white/[0.05] via-purple-500/[0.06] to-white/[0.02] backdrop-blur-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Ready to explore your celestial coordinates?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-light">
              Access your personalized birth matrix, daily transits, and conversational oracle.
            </p>
          </div>
          <button
            onClick={() => onLaunchDashboard()}
            className="px-8 py-3.5 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-all shadow-xl hover:scale-105 shrink-0"
          >
            Launch AstroMath
          </button>
        </div>
      </section>

      {/* 6. Clean Minimal Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#030712]/90 backdrop-blur-md" id="about">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Compass className="w-4 h-4 text-white" />
            <span className="font-bold text-sm tracking-widest text-white">
              ASTROMATH
            </span>
          </div>
          <p className="text-xs text-slate-400 font-light">
            © 2026 AstroMath. Crafted with precision astrometry.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <button onClick={() => onOpenAuth('signup')} className="hover:text-white transition-colors">Register</button>
            <button onClick={() => onOpenAuth('login')} className="hover:text-white transition-colors">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
