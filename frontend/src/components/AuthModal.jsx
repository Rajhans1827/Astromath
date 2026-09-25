import { useState } from 'react';
import { Mail, Lock, User, Phone, CheckCircle2, AlertCircle, X, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setSuccessMsg(`A 6-digit security code has been dispatched to ${formData.email}`);
      setMode('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit security code');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: fullOtp,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });

      localStorage.setItem('astromath_token', data.token);
      localStorage.setItem('astromath_user', JSON.stringify(data.user));
      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccessMsg('A fresh security code has been sent to your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.needsVerification) {
          setMode('otp');
          setError('Email verification required. A new security code was sent.');
          return;
        }
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('astromath_token', data.token);
      localStorage.setItem('astromath_user', JSON.stringify(data.user));
      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl">
      <div className="relative w-full max-w-md p-6 sm:p-9 rounded-3xl bg-[#05070D]/90 backdrop-blur-3xl border border-white/15 shadow-2xl shadow-black/90">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/15 text-white mb-3.5 shadow-inner">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {mode === 'login'
              ? 'Enter AstroMath'
              : mode === 'signup'
              ? 'Create Your Account'
              : 'Security Verification'}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-light">
            {mode === 'login'
              ? 'Access your verified celestial coordinates and matrices'
              : mode === 'signup'
              ? 'Encrypted with direct email OTP verification'
              : `Enter the 6-digit code dispatched to ${formData.email}`}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-2.5 p-3 mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2.5 p-3 mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Mode: Login */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl shadow-white/15 disabled:opacity-50 mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">First time visiting? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                className="text-xs text-white hover:underline font-bold"
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* Mode: Signup */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Alexander Vance"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Confirm
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl shadow-white/15 disabled:opacity-50 mt-2"
            >
              {loading ? 'Dispatching Code...' : 'Register & Receive Code'}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">Already registered? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className="text-xs text-white hover:underline font-bold"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Mode: OTP */}
        {mode === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex justify-center gap-2 sm:gap-2.5">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-mono font-bold rounded-2xl bg-white/[0.04] border border-white/15 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-white text-slate-950 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl shadow-white/15 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Verify Code & Enter'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-white hover:underline font-medium"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-slate-400 hover:underline"
              >
                Return to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
