import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const LoginPage = ({ onSwitchToSignup, onClose }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      onClose(); // Close modal on successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <div className="auth-logo">
            <BookOpenIcon className="auth-logo-icon" />
            <span className="auth-logo-text">Manupedia</span>
          </div>
          <button className="auth-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="auth-content">
          <div className="auth-title-section">
            <h2>Welcome Back</h2>
            <p>Sign in to your Manupedia account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <EnvelopeIcon className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="auth-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <LockClosedIcon className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="auth-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <button type="button" className="forgot-password">Forgot password?</button>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="social-login">
            <button className="social-btn google-btn">
              <span className="social-icon">🔗</span>
              Continue with Google
            </button>
            <button className="social-btn github-btn">
              <span className="social-icon">📚</span>
              Continue with GitHub
            </button>
          </div>

          <div className="auth-switch">
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="switch-btn"
                onClick={onSwitchToSignup}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
