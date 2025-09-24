import React, { useState, useEffect } from 'react';
import './UploadManuscript.css';
import { manuscriptsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const UploadManuscript = ({ onClose, onOpenLogin }) => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    dateCreated: '',
    originLocation: '',
    language: '',
    material: '',
    dimensions: '',
    condition: '',
    description: '',
    content: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('Image file size must be less than 10MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file');
        return;
      }

      setSelectedImageFile(file);
      setErrorMessage('');

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setSelectedImageFile(null);
    setErrorMessage('');
    document.getElementById('image-upload').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await manuscriptsAPI.uploadManuscript(formData, selectedImageFile);

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        if (onClose) onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting manuscript:', error);
      setErrorMessage(error.message || 'Failed to upload manuscript. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const conditionOptions = [
    'Excellent',
    'Good',
    'Fair',
    'Poor',
    'Fragmentary'
  ];

  // Check if user is authenticated
  if (!isAuthenticated() || !user) {
    return (
      <div className="upload-manuscript-overlay">
        <div className="upload-manuscript-modal auth-required-modal">
          <div className="auth-required-content">
            <ExclamationTriangleIcon className="auth-required-icon" />
            <h2>Authentication Required</h2>
            <p>You must be logged in to upload manuscripts.</p>
            <div className="auth-required-actions">
              <button
                className="login-button"
                onClick={() => {
                  if (onClose) onClose();
                  if (onOpenLogin) onOpenLogin();
                }}
              >
                Login to Continue
              </button>
              {onClose && (
                <button className="cancel-button" onClick={onClose}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="upload-manuscript-overlay">
        <div className="upload-manuscript-modal success-modal">
          <div className="success-content">
            <CheckCircleIcon className="success-icon" />
            <h2>Manuscript Uploaded Successfully!</h2>
            <p>Your manuscript has been submitted for review.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-manuscript-overlay">
      <div className="upload-manuscript-modal">
        <div className="modal-header">
          <div className="header-content">
            <CloudArrowUpIcon className="header-icon" />
            <h1>Add New Manuscript</h1>
          </div>
          {onClose && (
            <button className="close-button" onClick={onClose}>
              <XMarkIcon />
            </button>
          )}
        </div>

        <div className="modal-content">
          {errorMessage && (
            <div className="error-message">
              <XMarkIcon className="error-icon" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="manuscript-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter manuscript title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Enter author name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateCreated">Date Created</label>
                <input
                  type="text"
                  id="dateCreated"
                  name="dateCreated"
                  value={formData.dateCreated}
                  onChange={handleInputChange}
                  placeholder='e.g., "12th Century", "1245 AD"'
                />
              </div>
              <div className="form-group">
                <label htmlFor="originLocation">Origin/Location</label>
                <input
                  type="text"
                  id="originLocation"
                  name="originLocation"
                  value={formData.originLocation}
                  onChange={handleInputChange}
                  placeholder="Enter origin or location"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="language">Language</label>
                <input
                  type="text"
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  placeholder="Enter language(s)"
                />
              </div>
              <div className="form-group">
                <label htmlFor="material">Material</label>
                <input
                  type="text"
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  placeholder='e.g., "Vellum, Gold leaf from goat ink"'
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dimensions">Dimensions</label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleInputChange}
                  placeholder='e.g., "30 x 25 cm"'
                />
              </div>
              <div className="form-group">
                <label htmlFor="condition">Condition</label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                >
                  <option value="">Select condition</option>
                  {conditionOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <div className="rich-text-toolbar">
                <DocumentTextIcon className="toolbar-icon" />
                <span>Brief description with formatting options for the catalogue display.</span>
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Enter a brief description of the manuscript..."
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="content">Content</label>
              <div className="rich-text-toolbar">
                <DocumentTextIcon className="toolbar-icon" />
                <span>Detailed content and transcriptions of the manuscript with full formatting options.</span>
              </div>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="8"
                placeholder="Enter detailed content, transcriptions, and analysis..."
              />
            </div>

            <div className="form-group full-width">
              <label>Preview Image (Catalogue)</label>
              <div className="image-upload-section">
                <div className="upload-options">
                  <div className="upload-tab active">
                    <CloudArrowUpIcon className="upload-icon" />
                    Upload Image File
                  </div>
                  <div className="upload-tab">
                    Or Enter Image URL
                  </div>
                </div>

                <div className="upload-content">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image-upload" className="file-upload-button">
                    Choose File
                  </label>
                  <span className="file-info">
                    Recommended: 400x600px, Max 2MB
                  </span>
                </div>

                {previewImage && (
                  <div className="image-preview">
                    <div className="preview-container">
                      <img src={previewImage} alt="Preview" />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={removeImage}
                      >
                        <XMarkIcon />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting || !formData.title}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="button-icon" />
                    Upload Manuscript
                  </>
                )}
              </button>
              {onClose && (
                <button type="button" className="cancel-button" onClick={onClose}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadManuscript;
