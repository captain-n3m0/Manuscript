import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BrowseManuscripts.css';
import {
  CalendarIcon,
  UserIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';

const BrowseManuscripts = () => {
  const [manuscripts, setManuscripts] = useState([]);
  const [sortBy, setSortBy] = useState('dateAdded');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchManuscripts();
  }, [sortBy]);

  const fetchManuscripts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/manuals?sort=${sortBy}`);
      setManuscripts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching manuscripts:', error);
      setLoading(false);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleManuscriptClick = (id) => {
    navigate(`/manuscript/${id}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading manuscripts...</p>
      </div>
    );
  }

  return (
    <div className="browse-manuscripts">
      <div className="browse-header">
        <div className="browse-title">
          <h1>All Manuscripts</h1>
          <span className="manuscript-count">({manuscripts.length})</span>
        </div>
        <div className="browse-controls">
          <div className="sort-control">
            <label htmlFor="sort">SORT BY</label>
            <select id="sort" value={sortBy} onChange={handleSortChange}>
              <option value="dateAdded">Date Added to Library</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="dateCreated">Date Created</option>
              <option value="condition">Condition</option>
            </select>
          </div>
        </div>
      </div>

      <div className="manuscripts-grid">
        {manuscripts.map((manuscript) => (
          <div
            key={manuscript.id}
            className="manuscript-card"
            onClick={() => handleManuscriptClick(manuscript.id)}
          >
            <div className="manuscript-image">
              {manuscript.imageData ? (
                <img
                  src={`data:${manuscript.imageType};base64,${manuscript.imageData}`}
                  alt={manuscript.title}
                />
              ) : (
                <div className="no-image">No Image Available</div>
              )}
              {manuscript.condition && (
                <div className={`condition-badge ${manuscript.condition.toLowerCase()}`}>
                  {manuscript.condition}
                </div>
              )}
            </div>
            <div className="manuscript-info">
              <h3 className="manuscript-title">{manuscript.title}</h3>
              <div className="manuscript-details">
                {manuscript.author && (
                  <div className="detail-item">
                    <UserIcon className="detail-icon" />
                    <span>{manuscript.author}</span>
                  </div>
                )}
                {manuscript.dateCreated && (
                  <div className="detail-item">
                    <CalendarIcon className="detail-icon" />
                    <span>{manuscript.dateCreated}</span>
                  </div>
                )}
                {manuscript.language && (
                  <div className="detail-item">
                    <LanguageIcon className="detail-icon" />
                    <span>{manuscript.language}</span>
                  </div>
                )}
              </div>
              <div className="date-added">
                Added {new Date(manuscript.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {manuscripts.length === 0 && (
        <div className="no-manuscripts">
          <p>No manuscripts found.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseManuscripts;