import { useState, useEffect, useCallback } from 'react';
import DarkVeil from './components/DarkVeil';
import AuthModal from './components/AuthModal';
import BirthCoordinatesModal from './components/BirthCoordinatesModal';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

// Helper: Determine initial route from URL path or hash
function getInitialView() {
  if (typeof window === 'undefined') return 'landing';
  const path = (window.location.pathname || '').toLowerCase();
  const hash = (window.location.hash || '').toLowerCase();
  if (path === '/dashboard' || hash === '#/dashboard') {
    return 'dashboard';
  }
  return 'landing';
}

// Helper: Synchronously retrieve active cached profile on startup to eliminate refresh glitches
function getInitialBirthData() {
  if (typeof window === 'undefined') return null;
  try {
    const active = localStorage.getItem('astromath_active_profile');
    if (active) {
      const p = JSON.parse(active);
      if (p?.dob && p?.tob) return p;
    }
    const guest = localStorage.getItem('astromath_guest_profile');
    if (guest) {
      const p = JSON.parse(guest);
      if (p?.dob && p?.tob) return p;
    }
  } catch (e) {}
  return null;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [coordinatesModalOpen, setCoordinatesModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState(getInitialView);
  const [initialBirthData, setInitialBirthData] = useState(getInitialBirthData);

  // Robust SPA Navigation with Browser History & Popstate Support
  const navigateTo = useCallback((view, replace = false) => {
    setCurrentView(view);
    const targetPath = view === 'dashboard' ? '/dashboard' : '/';
    if (window.location.pathname !== targetPath) {
      if (replace) {
        window.history.replaceState({ view }, '', targetPath);
      } else {
        window.history.pushState({ view }, '', targetPath);
      }
    }
  }, []);

  // Sync browser back/forward buttons (Popstate and Hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = (window.location.pathname || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();
      if (path === '/dashboard' || hash === '#/dashboard') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Session Hydration on Mount & Refresh: Strict User Isolation
  useEffect(() => {
    const token = localStorage.getItem('astromath_token');
    const savedUserStr = localStorage.getItem('astromath_user');

    if (token && savedUserStr) {
      try {
        const user = JSON.parse(savedUserStr);
        setCurrentUser(user);

        // Fetch THIS specific user's verified birth profile from backend SQLite database
        fetch('/api/chart/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => r.json())
          .then((data) => {
            if (data?.profile?.dob && data?.profile?.tob) {
              setInitialBirthData(data.profile);
              localStorage.setItem('astromath_active_profile', JSON.stringify(data.profile));
            } else {
              // Logged-in user has no profile saved in SQLite database yet
              setInitialBirthData(null);
              localStorage.removeItem('astromath_active_profile');
              const path = (window.location.pathname || '').toLowerCase();
              if (path === '/dashboard') {
                setCoordinatesModalOpen(true);
              }
            }
          })
          .catch((err) => {
            console.error('Failed to fetch user profile:', err);
          });
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    } else {
      // Guest or logged-out session
      setCurrentUser(null);
      const guestProfile = localStorage.getItem('astromath_guest_profile');
      if (guestProfile) {
        try {
          const parsed = JSON.parse(guestProfile);
          if (parsed.dob && parsed.tob) setInitialBirthData(parsed);
        } catch (e) {}
      } else {
        setInitialBirthData(null);
      }
    }
  }, []);

  const handleOpenAuth = () => {
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = async (user) => {
    setCurrentUser(user);
    setAuthModalOpen(false);

    // Fetch this user's profile before deciding on coordinates modal
    const token = localStorage.getItem('astromath_token');
    if (token) {
      try {
        const res = await fetch('/api/chart/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data?.profile?.dob && data?.profile?.tob) {
          setInitialBirthData(data.profile);
          localStorage.setItem('astromath_active_profile', JSON.stringify(data.profile));
          navigateTo('dashboard');
          return;
        }
      } catch (err) {
        console.error('Failed to fetch profile on login:', err);
      }
    }

    // New user with no profile in DB yet -> navigate to dashboard and open coordinates modal
    navigateTo('dashboard');
    setCoordinatesModalOpen(true);
  };

  const handleLogout = () => {
    // Purge session tokens and cached keys to guarantee zero cross-user pollution
    localStorage.removeItem('astromath_user');
    localStorage.removeItem('astromath_token');
    localStorage.removeItem('astromath_profile');
    localStorage.removeItem('astromath_active_profile');
    localStorage.removeItem('astromath_chart');
    setCurrentUser(null);
    setInitialBirthData(null);
    navigateTo('landing');
  };

  const handleLaunchDashboard = (birthData) => {
    if (birthData && birthData.dob && birthData.tob) {
      setInitialBirthData(birthData);
      localStorage.setItem('astromath_active_profile', JSON.stringify(birthData));
      navigateTo('dashboard');
      return;
    }

    // Check if user has active session
    if (currentUser?.id && initialBirthData?.dob) {
      navigateTo('dashboard');
      return;
    }

    // Prompt coordinates modal for unconfigured users
    setCoordinatesModalOpen(true);
  };

  const handleCoordinatesSaved = (profile, chart) => {
    setInitialBirthData(profile);
    localStorage.setItem('astromath_active_profile', JSON.stringify(profile));
    if (!currentUser) {
      localStorage.setItem('astromath_guest_profile', JSON.stringify(profile));
    }
    setCoordinatesModalOpen(false);
    navigateTo('dashboard');
  };

  return (
    <div className="relative min-h-screen bg-[#05070D] text-slate-100 overflow-x-hidden selection:bg-purple-500/30 selection:text-white">
      {/* Procedural DarkVeil Fluid Silk Shader (Rich Dark Silk on Landing, Smooth Light Cosmic Silk on Dashboard) */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700 ${
          currentView === 'landing' ? 'opacity-85' : 'opacity-55'
        }`}
      >
        <DarkVeil
          speed={currentView === 'landing' ? 0.35 : 0.18}
          warpAmount={0.28}
          hueShift={-18}
          noiseIntensity={0.012}
        />
        {/* Ambient Obsidian Vignette Overlay - Balanced for gentle visible cosmic gradient on dashboard */}
        <div
          className={`absolute inset-0 transition-all duration-700 ${
            currentView === 'landing'
              ? 'bg-gradient-to-b from-[#05070D]/60 via-[#05070D]/25 to-[#05070D]'
              : 'bg-gradient-to-b from-[#05070D]/75 via-[#05070D]/55 to-[#05070D]/85'
          }`}
        />
      </div>

      {/* Main Views */}
      <div className="relative z-10">
        {currentView === 'landing' ? (
          <LandingPage
            onOpenAuth={handleOpenAuth}
            onLaunchDashboard={handleLaunchDashboard}
          />
        ) : (
          <Dashboard
            user={currentUser}
            initialBirthData={initialBirthData}
            onLogout={handleLogout}
            onReturnHome={() => navigateTo('landing')}
          />
        )}
      </div>

      {/* Compulsory Coordinates Setup Modal (Pure Database-Driven) */}
      <BirthCoordinatesModal
        isOpen={coordinatesModalOpen}
        onClose={() => setCoordinatesModalOpen(false)}
        onProfileSaved={handleCoordinatesSaved}
        currentProfile={initialBirthData}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
