import React, { useState, useEffect } from 'react';
import './BrowseManuscripts.css';
import { manuscriptsAPI } from '../services/api';
import {
  MagnifyingGlassIcon,
  FilterIcon,
  DocumentTextIcon,
  CalendarIcon,
  MapPinIcon,
  LanguageIcon,
  UserIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const BrowseManuscripts = ({ onViewManuscript }) => {
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    author: '',
    language: '',
    condition: '',
    dateCreated: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 12;

  const conditionOptions = ['Excellent', 'Good', 'Fair', 'Poor', 'Fragmentary'];

  useEffect(() => {
    fetchManuscripts();
  }, [currentPage, searchQuery, filters]);

  const fetchManuscripts = async () => {
    setLoading(true);
    setError('');

    try {
      let response;
      const hasFilters = Object.values(filters).some(value => value.trim() !== '');

      if (searchQuery.trim() || hasFilters) {
        // Use search API with filters
        const searchParams = {
          ...(searchQuery.trim() && { title: searchQuery }),
          ...Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value.trim() !== '')
          )
        };
        response = await manuscriptsAPI.searchManuscripts(searchParams, currentPage, pageSize);
      } else {
        // Use regular get all API
        response = await manuscriptsAPI.getAllManuscripts(currentPage, pageSize);
      }

      setManuscripts(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      setError('Failed to load manuscripts. Please try again.');
      console.error('Error fetching manuscripts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Reset to first page on search
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(0); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({
      author: '',
      language: '',
      condition: '',
      dateCreated: ''
    });
    setSearchQuery('');
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return dateString;
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-manuscript.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8080${imageUrl}`;
  };

  return (
    <div className="browse-manuscripts">
      <div className="browse-header">
        <div className="browse-title">
          <DocumentTextIcon className="title-icon" />
          <h1>Browse Manuscripts</h1>
          <span className="manuscript-count">
            {totalElements} manuscript{totalElements !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Search and Filters */}
        <div className="search-filters-section">
          <div className="search-bar">
            <MagnifyingGlassIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search manuscripts by title..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <button
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <AdjustmentsHorizontalIcon className="filter-icon" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <label>Author</label>
                <input
                  type="text"
                  placeholder="Filter by author..."
                  value={filters.author}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Language</label>
                <input
                  type="text"
                  placeholder="Filter by language..."
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Condition</label>
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                >
                  <option value="">All conditions</option>
                  {conditionOptions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Date/Period</label>
                <input
                  type="text"
                  placeholder="Filter by date or period..."
                  value={filters.dateCreated}
                  onChange={(e) => handleFilterChange('dateCreated', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-actions">
              <button className="clear-filters" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading manuscripts...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button onClick={fetchManuscripts} className="retry-button">
            Try Again
          </button>
        </div>
      )}

      {/* Manuscripts Grid */}
      {!loading && !error && (
        <>
          {manuscripts.length === 0 ? (
            <div className="empty-state">
              <DocumentTextIcon className="empty-icon" />
              <h3>No manuscripts found</h3>
              <p>Try adjusting your search terms or filters.</p>
              <button onClick={clearFilters} className="clear-filters-button">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="manuscripts-grid">
              {manuscripts.map((manuscript) => (
                <div key={manuscript.id} className="manuscript-card">
                  <div className="manuscript-image">
                    <img
                      src={getImageUrl(manuscript.imageUrl)}
                      alt={manuscript.title}
                      onError={(e) => {
                        e.target.src = '/placeholder-manuscript.jpg';
                      }}
                    />
                    <div className="image-overlay">
                      <button
                        className="view-button"
                        onClick={() => onViewManuscript(manuscript.id)}
                      >
                        <EyeIcon className="view-icon" />
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className="manuscript-info">
                    <h3 className="manuscript-title">{manuscript.title}</h3>

                    <div className="manuscript-meta">
                      {manuscript.author && (
                        <div className="meta-item">
                          <UserIcon className="meta-icon" />
                          <span>by {manuscript.author}</span>
                        </div>
                      )}

                      {manuscript.dateCreated && (
                        <div className="meta-item">
                          <CalendarIcon className="meta-icon" />
                          <span>{formatDate(manuscript.dateCreated)}</span>
                        </div>
                      )}

                      {manuscript.language && (
                        <div className="meta-item">
                          <LanguageIcon className="meta-icon" />
                          <span>{manuscript.language}</span>
                        </div>
                      )}

                      {manuscript.originLocation && (
                        <div className="meta-item">
                          <MapPinIcon className="meta-icon" />
                          <span>{manuscript.originLocation}</span>
                        </div>
                      )}
                    </div>

                    {manuscript.description && (
                      <p className="manuscript-description">
                        {manuscript.description.length > 120
                          ? `${manuscript.description.substring(0, 120)}...`
                          : manuscript.description
                        }
                      </p>
                    )}

                    <div className="manuscript-footer">
                      {manuscript.condition && (
                        <span className={`condition-badge condition-${manuscript.condition.toLowerCase()}`}>
                          {manuscript.condition}
                        </span>
                      )}
                      <span className="uploaded-by">
                        by {manuscript.uploadedByUsername}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                <ChevronLeftIcon className="pagination-icon" />
                Previous
              </button>

              <div className="pagination-info">
                <span className="page-numbers">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <span className="results-info">
                  Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} results
                </span>
              </div>

              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                Next
                <ChevronRightIcon className="pagination-icon" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseManuscripts;
