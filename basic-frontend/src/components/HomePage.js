import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import axios from 'axios';
import {
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const navigate = useNavigate();
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
  
  const [featuredManuscripts, setFeaturedManuscripts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch statistics
        const statsResponse = await axios.get('http://localhost:8080/api/dashboard/stats');
        const statsData = statsResponse.data;
        
        // Fetch featured manuscripts
        const featuredResponse = await axios.get('http://localhost:8080/api/manuals/featured');
        setFeaturedManuscripts(featuredResponse.data);

        setStatistics([
          {
            number: statsData.totalManuscripts.toLocaleString(),
            label: 'Total Manuscripts',
            icon: ChartBarIcon
          },
          {
            number: statsData.recentUpdates.toLocaleString(),
            label: 'Recent Updates',
            icon: ClockIcon
          },
          {
            number: statsData.contributors.toLocaleString(),
            label: 'Contributors',
            icon: UsersIcon
          }
        ]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
    // Set up auto-refresh every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);



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

      {/* Featured Manuscripts Section */}
      <section className="featured-section" data-testid="featured-manuscripts">
        <div className="featured-header">
          <StarIcon className="w-5 h-5 featured-icon" />
          <h2>Featured Manuscripts</h2>
        </div>
        
        <div className="featured-grid">
          {featuredManuscripts.length > 0 ? (
            featuredManuscripts.map((manuscript) => (
              <div key={manuscript.id} className="featured-card">
                {manuscript.imageData && (
                  <img 
                    src={`data:${manuscript.imageType};base64,${manuscript.imageData}`}
                    alt={manuscript.title}
                    className="featured-image"
                  />
                )}

                <div className="featured-content">
                  <h3 className="featured-title">{manuscript.title}</h3>
                  
                  <div className="featured-tags">
                    <span className="tag">{manuscript.language}</span>
                    {manuscript.material && <span className="tag">{manuscript.material}</span>}
                    {manuscript.condition && <span className="tag">{manuscript.condition}</span>}
                  </div>

                  <p className="featured-description">
                    {manuscript.description}
                  </p>

                  <button 
                    className="read-more-btn"
                    onClick={() => navigate(`/manuscripts/${manuscript.id}`)}
                  >
                    Read Full Article
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-featured">
              <p>No featured manuscripts at this time.</p>
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
