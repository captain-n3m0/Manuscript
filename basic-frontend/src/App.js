import React, { useState } from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import UploadManuscript from './components/UploadManuscript';
import HelpGuidelines from './components/HelpGuidelines';
import BrowseManuscripts from './components/BrowseManuscripts';
import AdminPage from './components/AdminPage';
import ManuscriptDetails from './components/ManuscriptDetails';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null); // 'login', 'signup', or null
  const [showUploadManuscript, setShowUploadManuscript] = useState(false);
  const [showHelpGuidelines, setShowHelpGuidelines] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'browse', 'admin', 'manuscript-details'
  const [selectedManuscriptId, setSelectedManuscriptId] = useState(null);

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

  const openUploadManuscript = () => {
    setShowUploadManuscript(true);
  };

  const closeUploadManuscript = () => {
    setShowUploadManuscript(false);
  };

  const openHelpGuidelines = () => {
    setShowHelpGuidelines(true);
  };

  const closeHelpGuidelines = () => {
    setShowHelpGuidelines(false);
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setSidebarOpen(false);
  };

  const navigateToBrowse = () => {
    setCurrentPage('browse');
    setSidebarOpen(false);
  };

  const navigateToAdmin = () => {
    setCurrentPage('admin');
    setSidebarOpen(false);
  };

  const navigateToManuscriptDetails = (manuscriptId) => {
    setSelectedManuscriptId(manuscriptId);
    setCurrentPage('manuscript-details');
    setSidebarOpen(false);
  };

  return (
    <AuthProvider>
      <div className="App">
        <Navbar
          toggleSidebar={toggleSidebar}
          onLoginClick={openLoginModal}
          onSignupClick={openSignupModal}
        />
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          onUploadManuscript={openUploadManuscript}
          onHelpGuidelines={openHelpGuidelines}
          onNavigateHome={navigateToHome}
          onNavigateBrowse={navigateToBrowse}
          onNavigateAdmin={navigateToAdmin}
          currentPage={currentPage}
        />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          {currentPage === 'home' && <HomePage onViewManuscript={navigateToManuscriptDetails} />}
          {currentPage === 'browse' && <BrowseManuscripts onViewManuscript={navigateToManuscriptDetails} />}
          {currentPage === 'admin' && <AdminPage />}
          {currentPage === 'manuscript-details' && <ManuscriptDetails
            manuscriptId={selectedManuscriptId}
            onBack={() => setCurrentPage(previousPage => previousPage === 'home' ? 'home' : 'browse')}
          />}
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

        {/* Upload Manuscript Modal */}
        {showUploadManuscript && (
          <UploadManuscript
            onClose={closeUploadManuscript}
            onOpenLogin={() => {
              setShowUploadManuscript(false);
              openLoginModal();
            }}
          />
        )}

        {/* Help & Guidelines Modal */}
        {showHelpGuidelines && (
          <HelpGuidelines onClose={closeHelpGuidelines} />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
