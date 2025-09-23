import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

const Navbar = ({ toggleSidebar, onLoginClick, onSignupClick }) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality here
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Hamburger Menu */}
        <button className="hamburger-menu" onClick={toggleSidebar}>
          <Bars3Icon className="w-6 h-6" />
        </button>

        {/* Logo/Brand */}
        <div className="navbar-brand">
          <h2>Manupedia</h2>
          <span className="navbar-tagline">The Free Manuscript Encyclopedia</span>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Auth Buttons */}
        <div className="navbar-auth">
          {user ? (
            <div className="auth-container">
              <button
                className="btn btn-upload"
                onClick={() => navigate('/upload')}
              >
                <CloudArrowUpIcon className="w-5 h-5" />
                <span>Upload Manuscript</span>
              </button>
              <div className="user-menu">
                <button
                  className="user-menu-button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <UserCircleIcon className="w-6 h-6" />
                  <span>{user.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <p>{user.name}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <hr />
                    <button onClick={handleLogout} className="logout-btn">
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <button onClick={onLoginClick} className="btn btn-login">
                Login
              </button>
              <button onClick={onSignupClick} className="btn btn-signup">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
