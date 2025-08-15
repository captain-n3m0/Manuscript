import React, { useState } from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null); // 'login', 'signup', or null

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openLoginModal = () => {
    setAuthModal('login');
  };

  const openSignupModal = () => {
    setAuthModal('signup');
  };

  const closeAuthModal = () => {
    setAuthModal(null);
  };

  const switchToLogin = () => {
    setAuthModal('login');
  };

  const switchToSignup = () => {
    setAuthModal('signup');
  };

  return (
    <AuthProvider>
      <div className="App">
        <Navbar
          toggleSidebar={toggleSidebar}
          onLoginClick={openLoginModal}
          onSignupClick={openSignupModal}
        />
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <HomePage />
        </main>

        {/* Authentication Modals */}
        {authModal === 'login' && (
          <LoginPage
            onSwitchToSignup={switchToSignup}
            onClose={closeAuthModal}
          />
        )}
        {authModal === 'signup' && (
          <SignupPage
            onSwitchToLogin={switchToLogin}
            onClose={closeAuthModal}
          />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
