import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { manuscriptsAPI } from '../services/api';
import {
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  StarIcon,
  ArrowRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const HomePage = ({ onViewManuscript }) => {
  const [statistics, setStatistics] = useState([
    {
      number: '...',
      label: 'Total Manuscripts',
      icon: ChartBarIcon
    },
    {
      number: '...',
      label: 'Recent Updates',
      icon: ClockIcon
    },
    {
      number: '...',
      label: 'Contributors',
      icon: UsersIcon
    }
  ]);
  const [recentManuscripts, setRecentManuscripts] = useState([]);
  const [featuredManuscript, setFeaturedManuscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatistics();
    fetchRecentManuscripts();
    fetchFeaturedManuscript();
  }, []);

  const fetchStatistics = async () => {
    try {
      const data = await manuscriptsAPI.getStatistics();
      setStatistics([
        {
          number: data.totalManuscripts.toLocaleString(),
          label: 'Total Manuscripts',
          icon: ChartBarIcon
        },
        {
          number: data.recentUpdates.toLocaleString(),
          label: 'Recent Updates',
          icon: ClockIcon
        },
        {
          number: data.totalContributors.toLocaleString(),
          label: 'Contributors',
          icon: UsersIcon
        }
      ]);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
      setError('Failed to load statistics');
    }
  };

  const fetchRecentManuscripts = async () => {
    try {
      const data = await manuscriptsAPI.getRecentManuscripts(6);
      setRecentManuscripts(data);
    } catch (err) {
      console.error('Failed to fetch recent manuscripts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedManuscript = async () => {
    try {
      const data = await manuscriptsAPI.getFeaturedManuscript();
      setFeaturedManuscript(data);
    } catch (err) {
      console.error('Failed to fetch featured manuscript:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="homepage">
      {/* Welcome Section */}
      <section className="welcome-section">
        <h1>Welcome to Manupedia</h1>
        <p className="welcome-description">
          The comprehensive digital archive of historical manuscripts, ancient texts, and scholarly
          documents. Explore humanity's written heritage through detailed articles, high-resolution
          images, and expert analysis.
        </p>
      </section>

      {/* Statistics Section */}
      <section className="statistics-section">
        <div className="stats-container">
          {statistics.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="stat-content">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Manuscript Section */}
      <section className="featured-section">
        <div className="featured-card">
          <div className="featured-header">
            <StarIcon className="w-5 h-5 featured-icon" />
            <h2>Featured Manuscript</h2>
          </div>

          {featuredManuscript ? (
            <>
              <h3 className="featured-title">{featuredManuscript.title}</h3>

              <div className="featured-tags">
                {featuredManuscript.language && (
                  <span className="tag">{featuredManuscript.language}</span>
                )}
                {featuredManuscript.material && (
                  <span className="tag">{featuredManuscript.material}</span>
                )}
                {featuredManuscript.originLocation && (
                  <span className="tag">{featuredManuscript.originLocation}</span>
                )}
              </div>

              <p className="featured-description">
                {featuredManuscript.description || 'A remarkable manuscript from our collection, showcasing the richness of historical documentation and scholarly research.'}
              </p>

              <div className="featured-metadata">
                <span>By {featuredManuscript.author}</span>
                {featuredManuscript.dateCreated && (
                  <span> • Created {formatDate(featuredManuscript.dateCreated)}</span>
                )}
              </div>

              <button className="read-more-btn">
                Read Full Article
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            </>
          ) : (
            <div className="featured-loading">
              <p>Loading featured manuscript...</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Manuscripts Section */}
      <section className="recent-section">
        <div className="recent-header">
          <h2>Recent Manuscripts</h2>
          <button className="view-all-btn">View All Manuscripts</button>
        </div>

        <div className="recent-manuscripts">
          {loading ? (
            <div className="manuscripts-loading">
              <p>Loading recent manuscripts...</p>
            </div>
          ) : error ? (
            <div className="manuscripts-error">
              <p>Failed to load recent manuscripts</p>
            </div>
          ) : recentManuscripts.length > 0 ? (
            <div className="manuscripts-grid">
              {recentManuscripts.map((manuscript) => (
                <div key={manuscript.id} className="manuscript-card">
                  <div className="manuscript-image">
                    {manuscript.imageUrl ? (
                      <img
                        src={`http://localhost:8080${manuscript.imageUrl}`}
                        alt={manuscript.title}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="manuscript-placeholder" style={{ display: manuscript.imageUrl ? 'none' : 'flex' }}>
                      <DocumentTextIcon className="placeholder-icon" />
                    </div>
                  </div>
                  <div className="manuscript-info">
                    <h4 className="manuscript-title">{manuscript.title}</h4>
                    <p className="manuscript-author">by {manuscript.author}</p>
                    <p className="manuscript-date">Uploaded: {formatDate(manuscript.uploadDate)}</p>
                    <div className="manuscript-tags">
                      <span className="manuscript-tag">{manuscript.language}</span>
                      <span className="manuscript-tag">{manuscript.condition}</span>
                    </div>
                    <button
                      className="view-details-btn"
                      onClick={() => onViewManuscript(manuscript.id)}
                    >
                      <span>View Details</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="manuscripts-empty">
              <DocumentTextIcon className="empty-icon" />
              <p>No manuscripts uploaded yet</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
