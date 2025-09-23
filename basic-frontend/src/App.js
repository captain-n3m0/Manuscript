import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import UploadManuscript from './components/UploadManuscript';
import ProtectedRoute from './components/ProtectedRoute';
import HelpGuide from './components/HelpGuide';
import BrowseManuscripts from './components/BrowseManuscripts';
import AdminPanel from './components/AdminPanel';
import AdminRoute from './components/AdminRoute';

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
      <Router>
        <div className="App">
          <Navbar
            toggleSidebar={toggleSidebar}
            onLoginClick={openLoginModal}
            onSignupClick={openSignupModal}
          />
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute>
                    <UploadManuscript />
                  </ProtectedRoute>
                } 
              />
              <Route path="/help" element={<HelpGuide />} />
              <Route path="/browse" element={<BrowseManuscripts />} />
              <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            </Routes>
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
      </Router>
    </AuthProvider>
  );
}

export default App;
