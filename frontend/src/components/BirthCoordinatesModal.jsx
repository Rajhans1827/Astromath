import { useState, useEffect } from 'react';
import { Compass, Calendar, Clock, MapPin, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

const POPULAR_CITIES = [
  'Pune', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad',
  'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Nagpur',
  'Nashik', 'London', 'New York', 'Dubai', 'Singapore'
];

export default function BirthCoordinatesModal({ isOpen, onClose, onProfileSaved, currentProfile = null }) {
  const [formData, setFormData] = useState({
    name: currentProfile?.name || '',
    dob: currentProfile?.dob || '',
    tob: currentProfile?.tob || '',
    city: currentProfile?.city || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dynamically sync formData with current profile or authenticated user
  useEffect(() => {
    if (isOpen) {
      const savedUserStr = localStorage.getItem('astromath_user');
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      setFormData({
        name: currentProfile?.name || savedUser?.name || '',
        dob: currentProfile?.dob || '',
        tob: currentProfile?.tob || '',
        city: currentProfile?.city || '',
      });
      setError('');
    }
  }, [isOpen, currentProfile]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.dob) {
      setError('Date of birth is compulsory for astronomical alignment.');
      return;
    }
    if (!formData.tob) {
      setError('Exact time of birth is compulsory to compute the Ascendant (Lagna).');
      return;
    }
    if (!formData.city.trim()) {
      setError('Place/city of birth is compulsory to resolve geographic coordinates.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('astromath_token');
      const savedUserStr = localStorage.getItem('astromath_user');
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;

      const res = await fetch('/api/chart/save-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          dob: formData.dob.trim(),
          tob: formData.tob.trim(),
          city: formData.city.trim(),
          userId: savedUser?.id || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to compute coordinates');

      if (onProfileSaved) {
        onProfileSaved(data.profile, data.chart);
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Save Profile Error:', err);
      setError(err.message || 'Could not calculate coordinates. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-lg p-5 sm:p-9 rounded-3xl bg-[#05070D]/95 backdrop-blur-3xl border border-white/15 shadow-2xl shadow-black/90 my-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/15 text-white mb-3 shadow-inner">
            <Compass className="w-5 h-5 text-amber-300 animate-spin-slow" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Initialize Your Coordinates
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 font-light max-w-md mx-auto leading-relaxed">
            Every divisional harmonic and planetary period is computed strictly from your verified birth data. Sample or hardcoded charts are disabled.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 p-3 mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Full Legal Name <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alexander Vance or Rajhans"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>

          {/* Date & Time of Birth */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Date of Birth <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full pl-10 pr-3 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Exact Time of Birth <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="time"
                  required
                  value={formData.tob}
                  onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
                  className="w-full pl-10 pr-3 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* City of Birth */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              City / Place of Birth <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Pune, Mumbai, Delhi, London..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            {/* Quick City Suggestions */}
            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono mr-1">Quick:</span>
              {POPULAR_CITIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setFormData({ ...formData, city: c })}
                  className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[11px] text-slate-300 hover:text-white transition-colors shrink-0"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 sm:py-4 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl shadow-white/15 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <Compass className="w-4 h-4 animate-spin text-slate-950" />
                <span>Computing Ephemeris Matrices (0.001°)...</span>
              </>
            ) : (
              <>
                <span>Generate Verified Astrological Matrix</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-center text-slate-400 mt-4 font-mono">
          Pure Astronomical Calculation • Zero Guesses • Saved securely to Database
        </p>
      </div>
    </div>
  );
}
