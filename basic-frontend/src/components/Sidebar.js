import React, { useState } from 'react';
import './Sidebar.css';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  DocumentTextIcon,
  StarIcon,
  ClockIcon,
  TagIcon,
  UsersIcon,
  PlusIcon,
  CloudArrowUpIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  BookOpenIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({
  isOpen,
  toggleSidebar,
  onUploadManuscript,
  onHelpGuidelines,
  onNavigateHome,
  onNavigateBrowse,
  onNavigateAdmin,
  currentPage
}) => {
  const { isAuthenticated, user } = useAuth();

  const navigationItems = [
    { id: 'main-page', label: 'Main Page', icon: HomeIcon, page: 'home' },
    { id: 'browse-manuscripts', label: 'Browse Manuscripts', icon: DocumentTextIcon, page: 'browse' },
    { id: 'featured-articles', label: 'Featured Articles', icon: StarIcon, page: 'home' },
    { id: 'recent-changes', label: 'Recent Changes', icon: ClockIcon, page: 'home' },
    { id: 'categories', label: 'Categories', icon: TagIcon, page: 'home' },
    { id: 'contributors', label: 'Contributors', icon: UsersIcon, page: 'home' }
  ];

  const quickAccessItems = [
    { id: 'upload-manuscript', label: 'Upload Manuscript', icon: CloudArrowUpIcon, requiresAuth: true },
    { id: 'help-guidelines', label: 'Help & Guidelines', icon: QuestionMarkCircleIcon, requiresAuth: false },
    { id: 'admin-panel', label: 'Admin Panel', icon: CogIcon, requiresAuth: true, requiresAdmin: true }
  ];

  // Filter quick access items based on authentication and admin role
  const availableQuickAccessItems = quickAccessItems.filter(item => {
    if (!item.requiresAuth) return true;
    if (!isAuthenticated()) return false;
    if (item.requiresAdmin && (!user || user.role !== 'ADMIN')) return false;
    return true;
  });

  const handleNavClick = (itemId, page) => {
    console.log('Navigating to:', itemId, 'page:', page);
    if (page === 'home' && onNavigateHome) {
      onNavigateHome();
    } else if (page === 'browse' && onNavigateBrowse) {
      onNavigateBrowse();
    }
  };

  const handleQuickAccessClick = (itemId) => {
    console.log('Quick access:', itemId);
    if (itemId === 'upload-manuscript' && onUploadManuscript) {
      onUploadManuscript();
    }
    if (itemId === 'help-guidelines' && onHelpGuidelines) {
      onHelpGuidelines();
    }
    if (itemId === 'admin-panel' && onNavigateAdmin) {
      onNavigateAdmin();
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
                const isActive = (item.page === currentPage) ||
                                (item.id === 'main-page' && currentPage === 'home');
                return (
                  <li key={item.id} className="sidebar-nav-item">
                    <button
                      className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => handleNavClick(item.id, item.page)}
                    >
                      <IconComponent className="sidebar-nav-icon" />
                      <span className="sidebar-nav-text">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Access */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title">QUICK ACCESS</h4>
            <ul className="sidebar-quick-access">
              {availableQuickAccessItems.map((item) => {
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
