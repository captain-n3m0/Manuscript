import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';
import {
  HomeIcon,
  DocumentTextIcon,
  StarIcon,
  ClockIcon,
  TagIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState('main-page');

  const navigationItems = [
    { id: 'main-page', label: 'Main Page', icon: HomeIcon },
    { id: 'browse-manuscripts', label: 'Browse Manuscripts', icon: DocumentTextIcon },
    { id: 'featured-articles', label: 'Featured Articles', icon: StarIcon },
    { id: 'recent-changes', label: 'Recent Changes', icon: ClockIcon },
    { id: 'categories', label: 'Categories', icon: TagIcon },
    { id: 'contributors', label: 'Contributors', icon: UsersIcon }
  ];

  const quickAccessItems = [
    { id: 'help-guidelines', label: 'Help & Guidelines', icon: QuestionMarkCircleIcon, requiresAuth: false }
  ].filter(item => !item.requiresAuth || isAuthenticated());

  const handleNavClick = (itemId) => {
    setActiveSection(itemId);
    switch(itemId) {
      case 'main-page':
        navigate('/');
        toggleSidebar(); // Close sidebar after navigation on mobile
        break;
      case 'browse-manuscripts':
        navigate('/browse');
        toggleSidebar(); // Close sidebar after navigation on mobile
        break;
      case 'featured-articles':
        // TODO: Add featured articles route
        break;
      case 'recent-changes':
        // TODO: Add recent changes route
        break;
      case 'categories':
        // TODO: Add categories route
        break;
      case 'contributors':
        // TODO: Add contributors route
        break;
      default:
        console.log('Navigating to:', itemId);
    }
  };

  const handleQuickAccessClick = (itemId) => {
    switch(itemId) {
      case 'help-guidelines':
        navigate('/help');
        toggleSidebar(); // Close sidebar after navigation on mobile
        break;
      default:
        console.log('Quick access:', itemId);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <BookOpenIcon className="sidebar-logo-icon" />
            <span className="sidebar-logo-text">Manupedia</span>
          </div>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="sidebar-content">
          {/* Main Navigation */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title">NAVIGATION</h4>
            <ul className="sidebar-nav">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.id} className="sidebar-nav-item">
                    <button
                      className={`sidebar-nav-link ${
                        activeSection === item.id ? 'active' : ''
                      }`}
                      onClick={() => handleNavClick(item.id)}
                    >
                      <IconComponent className="sidebar-nav-icon" />
                      <span className="sidebar-nav-text">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Admin Section */}
          {isAdmin() && (
            <div className="sidebar-section">
              <h4 className="sidebar-section-title">ADMIN</h4>
              <ul className="sidebar-nav">
                <li className="sidebar-nav-item">
                  <button
                    className={`sidebar-nav-link ${
                      activeSection === 'admin' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveSection('admin');
                      navigate('/admin');
                      toggleSidebar();
                    }}
                  >
                    <UsersIcon className="sidebar-nav-icon" />
                    <span className="sidebar-nav-text">Admin Panel</span>
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Quick Access */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title">QUICK ACCESS</h4>
            <ul className="sidebar-quick-access">
              {quickAccessItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.id} className="sidebar-quick-item">
                    <button
                      className="sidebar-quick-link"
                      onClick={() => handleQuickAccessClick(item.id)}
                    >
                      <IconComponent className="sidebar-quick-icon" />
                      <span className="sidebar-quick-text">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
