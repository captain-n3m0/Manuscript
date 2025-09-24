import React, { useState, useEffect } from 'react';
import { manuscriptsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './ManuscriptDetails.css';
import { ArrowLeftIcon, DocumentArrowDownIcon, HeartIcon, ShareIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const ManuscriptDetails = ({ manuscriptId, onBack }) => {
  const [manuscript, setManuscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchManuscript = async () => {
      try {
        setLoading(true);
        const data = await manuscriptsAPI.getManuscriptById(manuscriptId);
        setManuscript(data);
      } catch (err) {
        console.error('Failed to fetch manuscript details:', err);
        setError('Failed to load manuscript details');
      } finally {
        setLoading(false);
      }
    };

    if (manuscriptId) {
      fetchManuscript();
    }
  }, [manuscriptId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = async () => {
    try {
      await manuscriptsAPI.downloadManuscript(manuscriptId);
    } catch (err) {
      console.error('Failed to download manuscript:', err);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/manuscripts/${manuscriptId}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const isOwner = currentUser && manuscript?.uploadedBy?.email === currentUser.email;
  const isAdmin = currentUser?.role === 'ADMIN';

  if (loading) {
    return <div className="manuscript-details-loading">Loading manuscript details...</div>;
  }

  if (error) {
    return <div className="manuscript-details-error">{error}</div>;
  }

  if (!manuscript) {
    return <div className="manuscript-details-error">Manuscript not found</div>;
  }

  return (
    <div className="manuscript-details-container">
      <div className="manuscript-details-header">
        <button onClick={onBack} className="back-button">
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Browse
        </button>
        <h1>{manuscript.title}</h1>
      </div>

      <div className="manuscript-details-content">
        <div className="manuscript-details-main">
          <div className="manuscript-image-container">
            <img
              src={manuscript.imageUrl ? `http://localhost:8080${manuscript.imageUrl}` : '/default-manuscript.jpg'}
              alt={manuscript.title}
              className="manuscript-main-image"
              onError={(e) => {
                e.target.src = '/default-manuscript.jpg';
              }}
            />
            {manuscript.additionalImages && manuscript.additionalImages.length > 0 && (
              <div className="manuscript-thumbnail-row">
                {[manuscript.imageUrl, ...manuscript.additionalImages].map((image, index) => (
                  <img
                    key={index}
                    src={image || '/default-manuscript.jpg'}
                    alt={`${manuscript.title} - Image ${index + 1}`}
                    className={`manuscript-thumbnail ${selectedImage === index ? 'selected' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="manuscript-details-tabs">
            <div className="manuscript-tabs-header">
              <h2>Description</h2>
            </div>
            <div className="manuscript-tab-content">
              <p className="manuscript-description">{manuscript.description}</p>

              {manuscript.content && (
                <>
                  <h3>Full Text</h3>
                  <div className="manuscript-full-text">
                    {manuscript.content.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </>
              )}

              {manuscript.philosophicalConcepts && (
                <div className="philosophical-concepts">
                  <h3>Philosophical Concepts</h3>
                  <div className="manuscript-full-text">
                    {manuscript.philosophicalConcepts.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {manuscript.contentSections && (
                <div className="content-sections">
                  <h3>Content Sections</h3>
                  <div className="manuscript-full-text">
                    {manuscript.contentSections.split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="manuscript-details-sidebar">
          <div className="manuscript-details-box">
            <h3>Manuscript Details</h3>
            <div className="manuscript-metadata">
              {manuscript.author && (
                <div className="metadata-row">
                  <span className="metadata-label">Author:</span>
                  <span className="metadata-value">{manuscript.author}</span>
                </div>
              )}
              {manuscript.dateCreated && (
                <div className="metadata-row">
                  <span className="metadata-label">Date:</span>
                  <span className="metadata-value">{manuscript.dateCreated}</span>
                </div>
              )}
              {manuscript.originLocation && (
                <div className="metadata-row">
                  <span className="metadata-label">Origin:</span>
                  <span className="metadata-value">{manuscript.originLocation}</span>
                </div>
              )}
              {manuscript.language && (
                <div className="metadata-row">
                  <span className="metadata-label">Language:</span>
                  <span className="metadata-value">{manuscript.language}</span>
                </div>
              )}
              {manuscript.material && (
                <div className="metadata-row">
                  <span className="metadata-label">Material:</span>
                  <span className="metadata-value">{manuscript.material}</span>
                </div>
              )}
              {manuscript.dimensions && (
                <div className="metadata-row">
                  <span className="metadata-label">Dimensions:</span>
                  <span className="metadata-value">{manuscript.dimensions}</span>
                </div>
              )}
              {manuscript.condition && (
                <div className="metadata-row">
                  <span className="metadata-label">Condition:</span>
                  <span className="metadata-value">{manuscript.condition}</span>
                </div>
              )}
              <div className="metadata-row">
                <span className="metadata-label">Added:</span>
                <span className="metadata-value">{formatDate(manuscript.createdAt)}</span>
              </div>
              <div className="metadata-row">
                <span className="metadata-label">Last Updated:</span>
                <span className="metadata-value">{formatDate(manuscript.updatedAt)}</span>
              </div>
              {manuscript.uploadedBy && (
                <div className="metadata-row">
                  <span className="metadata-label">Contributed By:</span>
                  <span className="metadata-value">{manuscript.uploadedBy.name || manuscript.uploadedBy.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="manuscript-actions">
            <button className="manuscript-action-btn download-btn" onClick={handleDownload}>
              <DocumentArrowDownIcon className="h-5 w-5 mr-1" />
              Download
            </button>
            <button className="manuscript-action-btn share-btn" onClick={handleShare}>
              <ShareIcon className="h-5 w-5 mr-1" />
              Share
            </button>
            {(isOwner || isAdmin) && (
              <>
                <button className="manuscript-action-btn edit-btn">
                  <PencilIcon className="h-5 w-5 mr-1" />
                  Edit
                </button>
                <button className="manuscript-action-btn delete-btn">
                  <TrashIcon className="h-5 w-5 mr-1" />
                  Delete
                </button>
              </>
            )}
          </div>

          <div className="share-this-manuscript">
            <h3>Share This Manuscript</h3>
            <div className="share-url-container">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/manuscripts/${manuscriptId}`}
                className="share-url-input"
              />
              <button onClick={handleShare} className="copy-link-btn">Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManuscriptDetails;
