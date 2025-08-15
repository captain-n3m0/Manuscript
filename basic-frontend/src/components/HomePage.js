import React from 'react';
import './HomePage.css';
import {
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const statistics = [
    {
      number: '2,847',
      label: 'Total Manuscripts',
      icon: ChartBarIcon
    },
    {
      number: '156',
      label: 'Recent Updates',
      icon: ClockIcon
    },
    {
      number: '1,293',
      label: 'Contributors',
      icon: UsersIcon
    }
  ];

  const featuredManuscript = {
    title: 'The Voynich Manuscript: Decoding Medieval Mysteries',
    description: 'An illustrated codex hand-written in an unknown script and language. Dating to the early 15th century, this mysterious manuscript has fascinated researchers and cryptographers for centuries with its undeciphered text and peculiar illustrations of unknown plants, astronomical diagrams, and biological systems.',
    tags: ['Medieval Studies', 'Cryptography']
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

          <h3 className="featured-title">{featuredManuscript.title}</h3>

          <div className="featured-tags">
            {featuredManuscript.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>

          <p className="featured-description">
            {featuredManuscript.description}
          </p>

          <button className="read-more-btn">
            Read Full Article
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </button>
        </div>
      </section>

      {/* Recent Manuscripts Section */}
      <section className="recent-section">
        <div className="recent-header">
          <h2>Recent Manuscripts</h2>
          <button className="view-all-btn">View All Manuscripts</button>
        </div>

        <div className="recent-manuscripts">
          {/* This would be populated with actual manuscript data */}
          <div className="manuscript-placeholder">
            <p>Recent manuscripts will be displayed here...</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
