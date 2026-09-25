import { useState, useEffect } from 'react';
import Starfield from './components/Starfield';
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
        // Optional: auto navigate to dashboard if already logged in
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

  const handleQuickCalculate = (birthData) => {
    setInitialBirthData(birthData);
    setCurrentView('dashboard');
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden">
      {/* Animated Deep Space Canvas */}
      <Starfield />

      {/* Main View Router */}
      {currentView === 'landing' ? (
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onQuickCalculate={handleQuickCalculate}
        />
      ) : (
        <Dashboard
          user={currentUser}
          initialBirthData={initialBirthData}
          onLogout={handleLogout}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
