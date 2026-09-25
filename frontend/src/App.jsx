import { useState, useEffect } from 'react';
import DarkVeil from './components/DarkVeil';
import AuthModal from './components/AuthModal';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
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
  }, []);

  const handleOpenAuth = () => {
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setAuthModalOpen(false);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('astromath_user');
    localStorage.removeItem('astromath_token');
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleLaunchDashboard = (birthData) => {
    if (birthData) setInitialBirthData(birthData);
    setCurrentView('dashboard');
  };

  return (
    <div className="relative min-h-screen bg-[#05070D] text-slate-100 overflow-x-hidden selection:bg-purple-500/30 selection:text-white">
      {/* Procedural DarkVeil Fluid Silk Shader (Dimmed & Calibrated for Pure Luxury) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-35">
        <DarkVeil
          speed={0.25}
          warpAmount={0.28}
          hueShift={-18}
          noiseIntensity={0.012}
        />
        {/* Soft Ambient Deep Obsidian Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070D]/80 via-[#05070D]/50 to-[#05070D]" />
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

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
