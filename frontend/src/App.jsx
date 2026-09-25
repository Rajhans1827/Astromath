import { useState, useEffect } from 'react';
import DarkVeil from './components/DarkVeil';
import AuthModal from './components/AuthModal';
import BirthCoordinatesModal from './components/BirthCoordinatesModal';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [coordinatesModalOpen, setCoordinatesModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'dashboard'
  const [initialBirthData, setInitialBirthData] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('astromath_user');
    const token = localStorage.getItem('astromath_token');
    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }

    const savedProfile = localStorage.getItem('astromath_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.dob && profile.tob) {
          setInitialBirthData(profile);
        }
      } catch (e) {
        console.error('Failed to parse saved profile', e);
      }
    }
  }, []);

  const handleOpenAuth = () => {
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setAuthModalOpen(false);

    // If user has saved profile, go to dashboard, else open coordinates modal
    const savedProfile = localStorage.getItem('astromath_profile');
    if (savedProfile) {
      setCurrentView('dashboard');
    } else {
      setCoordinatesModalOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('astromath_user');
    localStorage.removeItem('astromath_token');
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleLaunchDashboard = (birthData) => {
    if (birthData && birthData.dob && birthData.tob) {
      setInitialBirthData(birthData);
      setCurrentView('dashboard');
      return;
    }

    // Check if saved profile exists
    const savedProfile = localStorage.getItem('astromath_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.dob && parsed.tob) {
          setInitialBirthData(parsed);
          setCurrentView('dashboard');
          return;
        }
      } catch (e) {}
    }

    // Compulsory: user must enter coordinates first
    setCoordinatesModalOpen(true);
  };

  const handleCoordinatesSaved = (profile, chart) => {
    setInitialBirthData(profile);
    setCoordinatesModalOpen(false);
    setCurrentView('dashboard');
  };

  return (
    <div className="relative min-h-screen bg-[#05070D] text-slate-100 overflow-x-hidden selection:bg-purple-500/30 selection:text-white">
      {/* Procedural DarkVeil Fluid Silk Shader (Dynamic: Rich Dark Silk on Landing, Dimmed Calm on Dashboard) */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700 ${
          currentView === 'landing' ? 'opacity-85' : 'opacity-20'
        }`}
      >
        <DarkVeil
          speed={currentView === 'landing' ? 0.35 : 0.15}
          warpAmount={0.28}
          hueShift={-18}
          noiseIntensity={0.012}
        />
        {/* Ambient Obsidian Vignette Overlay (Lighter on Landing for deep cosmic silk, Strong on Dashboard for crisp readability) */}
        <div
          className={`absolute inset-0 transition-all duration-700 ${
            currentView === 'landing'
              ? 'bg-gradient-to-b from-[#05070D]/60 via-[#05070D]/25 to-[#05070D]'
              : 'bg-gradient-to-b from-[#05070D]/95 via-[#05070D]/85 to-[#05070D]'
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
            onReturnHome={() => setCurrentView('landing')}
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
