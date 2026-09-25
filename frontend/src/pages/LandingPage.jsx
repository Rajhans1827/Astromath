import {
  Sparkles,
  Compass,
  ArrowRight,
  Zap,
  Stars,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Scale,
  Clock,
  Globe,
  MessageCircle,
} from 'lucide-react';
import OrbitImages from '../components/OrbitImages';
import DriftWall from '../components/DriftWall';
import { planetsList, planetImages } from '../assets/planets';
import { WHATSAPP_TESTIMONIALS } from '../data/whatsappChats';

export default function LandingPage({ onOpenAuth, onLaunchDashboard }) {
  return (
    <div className="relative min-h-screen text-white selection:bg-purple-500/30 selection:text-white">
      {/* 1. Floating Glassmorphism Pill Navbar */}
      <div className="fixed top-5 inset-x-0 z-50 px-4 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-4xl rounded-full bg-[#05070D]/70 backdrop-blur-2xl border border-white/10 px-5 sm:px-7 py-3 flex items-center justify-between shadow-2xl shadow-black/90">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center text-white shadow-inner">
              <Compass className="w-4 h-4 text-amber-300 animate-spin-slow" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">
                AstroMath
              </span>
              <span className="text-[10px] text-amber-300 font-mono tracking-widest uppercase">
                Obs
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-7 text-xs uppercase tracking-widest text-slate-300 font-medium">
            <a href="#orrery" className="hover:text-white transition-colors">The Orrery</a>
            <a href="#trust" className="hover:text-white transition-colors">The Science</a>
            <a href="#pillars" className="hover:text-white transition-colors">Certainty</a>
            <a href="#proof" className="hover:text-white transition-colors">Wall of Proof</a>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('login')}
              className="text-xs uppercase tracking-wider font-semibold text-slate-300 hover:text-white px-2 py-1 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => onLaunchDashboard()}
              className="px-5 py-2 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-all shadow-lg shadow-white/15 hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </nav>
      </div>

      {/* 2. Hero Section with Original AstroMath Slogan & Authentic Trust Branding */}
      <section className="relative pt-36 sm:pt-48 pb-20 px-4 sm:px-6 max-w-5xl mx-auto text-center" id="orrery">
        {/* Trust Pill Announcement Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white/[0.05] backdrop-blur-2xl border border-white/15 text-xs text-white/90 shadow-2xl mb-8">
          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9.5px] uppercase tracking-wider">
            CERTAINTY
          </span>
          <span className="text-slate-200 font-medium tracking-wide">
            Pure Sidereal Mathematics • 0.001° Coordinate Precision
          </span>
        </div>

        {/* The Original AstroMath Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto">
          The Exact Mathematical Truth of Your Life’s Blueprint
        </h1>

        <p className="mt-7 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Say goodbye to vague, generic horoscopes. AstroMath computes your celestial matrix with uncompromising mathematical rigor—unlocking your authentic vocation, soul relationships, and 120-year planetary progression.
        </p>

        {/* High-Contrast Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onLaunchDashboard()}
            className="px-8 py-3.5 rounded-2xl bg-white text-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-2xl shadow-white/15 hover:scale-105 flex items-center gap-2"
          >
            <span>Enter Your Coordinates</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#trust"
            className="px-8 py-3.5 rounded-2xl bg-white/[0.04] border border-white/15 text-white font-medium text-xs uppercase tracking-widest hover:bg-white/10 backdrop-blur-xl transition-all"
          >
            Why AstroMath
          </a>
        </div>

        {/* 3. The Orrery - Dominik Koch's Orbit Component on the Silk Canvas */}
        <div className="mt-16 sm:mt-24 relative">
          <OrbitImages
            images={planetImages}
            altPrefix="Planetary Sphere"
            shape="ellipse"
            baseWidth={1400}
            radiusX={620}
            radiusY={200}
            duration={38}
            itemSize={84}
            rotation={-6}
            showPath={true}
            pathColor="rgba(255, 255, 255, 0.2)"
            pathWidth={1.5}
            responsive={true}
            centerContent={
              <div className="relative group cursor-pointer text-center p-6">
                <div className="w-36 h-36 rounded-full bg-white/[0.03] backdrop-blur-2xl border border-white/20 flex flex-col items-center justify-center shadow-2xl shadow-purple-500/15 group-hover:scale-105 transition-transform">
                  <Flame className="w-6 h-6 text-amber-300 mb-1" />
                  <span className="text-xs font-bold text-white tracking-[0.25em] uppercase">
                    ASTROMATH
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

      {/* 4. Trust Matrix / Proof Bar */}
      <section className="py-10 px-4 sm:px-6 border-y border-white/5 bg-[#05070D]/50 backdrop-blur-2xl" id="trust">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">0.001°</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-medium">Astrometric Accuracy</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-300">120 Years</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-medium">Vimshottari Lifeline</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">D1 • D9 • D10</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-medium">Harmonic Divisions</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-300">Zero Fluff</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 font-medium">Mathematical Truth</div>
          </div>
        </div>
      </section>

      {/* 5. Trust Pillars: Why AstroMath Is Unlike Any Generic Platform */}
      <section className="py-24 px-4 sm:px-6 max-w-6xl mx-auto" id="pillars">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.25em] text-amber-300 font-semibold">
            Uncompromising Authenticity
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
            Built on Certainty, Not Guesswork
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2.5 max-w-lg mx-auto font-light">
            Why seekers trust AstroMath for true clarity across their vocation, union, and life trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-all shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-white mb-6">
              <Scale className="w-5 h-5 text-amber-300" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
              Deterministic Planetary Coordinates
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              We never fabricate celestial placements. Every degree, minute, second, house cusp, and retrograde motion is calculated deterministically from exact physical orbital geometry.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-all shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-white mb-6">
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
              Harmonic Soul Blueprints (D9 & D10)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              A flat horoscope only scratches the surface. AstroMath unpacks the 9-fold Navamsha (marriage & spiritual evolution) and 10-fold Dashamsha (career mastery & executive status).
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-all shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-white mb-6">
              <Clock className="w-5 h-5 text-emerald-300" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
              Dynamic 120-Year Lifeline Timing
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Know exactly what season of life you are walking through. Our 120-year Vimshottari progression maps your active Mahadashas and sub-antardashas down to the calendar date.
            </p>
          </div>
        </div>

        {/* 6. Comparison Table / Trust Benchmark */}
        <div className="mt-16 rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden">
          <h3 className="text-xl font-bold text-white text-center mb-8 tracking-tight">
            How AstroMath Compares
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <thead className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Astrological Capability</th>
                  <th className="py-3 px-4 text-slate-500">Generic Apps</th>
                  <th className="py-3 px-4 text-white font-bold">AstroMath Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-light">
                <tr>
                  <td className="py-4 px-4 font-medium text-white">Calculation Precision</td>
                  <td className="py-4 px-4 text-slate-500">Approximated / Flat Sun-Sign</td>
                  <td className="py-4 px-4 text-emerald-300 font-medium">Exact 0.001° Sidereal Lahiri Degrees</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-white">Divisional Harmonics</td>
                  <td className="py-4 px-4 text-slate-500">None (Only basic D1)</td>
                  <td className="py-4 px-4 text-emerald-300 font-medium">Complete D1, D9 (Navamsha), D10 (Dashamsha)</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-white">Planetary Timing</td>
                  <td className="py-4 px-4 text-slate-500">Static daily boilerplate text</td>
                  <td className="py-4 px-4 text-emerald-300 font-medium">120-Year Vimshottari Timeline + Real-time Transit</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-white">Consultation Depth</td>
                  <td className="py-4 px-4 text-slate-500">Canned robotic responses</td>
                  <td className="py-4 px-4 text-emerald-300 font-medium">Personalized synthesis strictly grounded in chart facts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. The Wall of Proof — 3D Drifting WhatsApp Chat Testimonials */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden" id="proof">
        <div className="max-w-6xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs text-slate-300 mb-4 shadow-xl">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold tracking-wider uppercase text-[10px] text-emerald-400">Verified User Feedback</span>
            <span className="text-white/40">•</span>
            <span>Unfiltered WhatsApp Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Real Precision. Real Lives Changed.
          </h2>
          <p className="mt-3.5 text-xs sm:text-base text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Unfiltered conversations from entrepreneurs, surgeons, scholars, and professionals whose decisions are guided by AstroMath’s mathematical clarity. Move cursor to tilt in 3D; hover any tile to pause.
          </p>
        </div>

        {/* 3D DriftWall Showcase Canvas */}
        <div className="relative w-full max-w-7xl mx-auto h-[600px] sm:h-[700px] rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl">
          <DriftWall
            items={WHATSAPP_TESTIMONIALS}
            columns={5}
            tileWidth={290}
            tileHeight={190}
            gap={22}
            radius={18}
            tilt={14}
            turn={-12}
            depth={130}
            speed={32}
            lift={80}
            fade={0.5}
            dim={0.68}
            pauseOnHover={true}
            overlayColor="#05070D"
          />

          {/* Interactive Instruction Pill */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-20 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-xl border border-white/15 text-[11px] text-slate-300 shadow-2xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive 3D Drift • Hover to inspect details</span>
          </div>
        </div>
      </section>

      {/* 7. Bottom Call to Action Card */}
      <section className="pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-white/[0.06] via-purple-500/[0.08] to-white/[0.02] backdrop-blur-2xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Get Your Actual AstroMath Blueprint
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-light max-w-xl">
              Experience the depth and precision of a true celestial observatory. Launch your personal dashboard in seconds.
            </p>
          </div>
          <button
            onClick={() => onLaunchDashboard()}
            className="px-8 py-4 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-2xl shadow-white/20 hover:scale-105 shrink-0"
          >
            Launch AstroMath
          </button>
        </div>
      </section>

      {/* 8. Minimalist Luxury Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#030712]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Compass className="w-4 h-4 text-amber-300" />
            <span className="font-bold text-sm tracking-widest text-white">
              ASTROMATH
            </span>
          </div>
          <p className="text-xs text-slate-400 font-light">
            © 2026 AstroMath. Precision celestial geometry & sidereal matrices.
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
