import React, { useState } from 'react';
import {
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  ListBulletIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import './UploadManuscript.css';

const UploadManuscript = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    dateCreated: '',
    originLocation: '',
    language: '',
    material: '',
    dimensions: '',
    condition: 'good',
    description: '',
    content: '',
    imageFile: null,
    imageUrl: ''
  });

  const [previewImage, setPreviewImage] = useState(null);

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
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      imageUrl: url,
      imageFile: null
    }));
    setPreviewImage(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement manuscript upload logic
    try {
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'imageFile' && key !== 'imageUrl') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add image file if exists
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      } else if (formData.imageUrl) {
        formDataToSend.append('imageUrl', formData.imageUrl);
      }

      // TODO: Send to backend API
      // const response = await manualsAPI.uploadManual(formDataToSend);
      
      // Reset form after successful upload
      setFormData({
        title: '',
        author: '',
        dateCreated: '',
        originLocation: '',
        language: '',
        material: '',
        dimensions: '',
        condition: 'good',
        description: '',
        content: '',
        imageFile: null,
        imageUrl: ''
      });
      setPreviewImage(null);

    } catch (error) {
      console.error('Error uploading manuscript:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <div className="upload-manuscript-container">
      <div className="upload-header">
        <h1>Add New Manuscript</h1>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-section basic-info">
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
              placeholder="Author name if known"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateCreated">Date Created</label>
            <input
              type="text"
              id="dateCreated"
              name="dateCreated"
              value={formData.dateCreated}
              onChange={handleInputChange}
              placeholder="e.g., '12th Century', '1445 AD'"
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
              placeholder="Place of origin"
            />
          </div>
        </div>

        <div className="form-section details">
          <div className="form-group">
            <label htmlFor="language">Language</label>
            <input
              type="text"
              id="language"
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              placeholder="Manuscript language"
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
              placeholder="e.g., 'Vellum, gold leaf, iron gall ink'"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dimensions">Dimensions</label>
            <input
              type="text"
              id="dimensions"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleInputChange}
              placeholder="e.g., '35 x 25 cm'"
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
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="damaged">Damaged</option>
            </select>
          </div>
        </div>

        <div className="form-section description">
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <div className="rich-text-toolbar">
              <button type="button" title="Bold"><strong>B</strong></button>
              <button type="button" title="Italic"><em>I</em></button>
              <button type="button" title="List"><ListBulletIcon className="toolbar-icon" /></button>
              <button type="button" title="Link"><LinkIcon className="toolbar-icon" /></button>
              <button type="button" title="Code"><CodeBracketIcon className="toolbar-icon" /></button>
            </div>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description with formatting options for the catalogue display"
              rows={4}
            />
          </div>
        </div>

        <div className="form-section content">
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <div className="rich-text-toolbar">
              <button type="button" title="Bold"><strong>B</strong></button>
              <button type="button" title="Italic"><em>I</em></button>
              <button type="button" title="List"><ListBulletIcon className="toolbar-icon" /></button>
              <button type="button" title="Link"><LinkIcon className="toolbar-icon" /></button>
              <button type="button" title="Code"><CodeBracketIcon className="toolbar-icon" /></button>
            </div>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Detailed content and transcription of the manuscript with full formatting options"
              rows={8}
            />
          </div>
        </div>

        <div className="form-section image-upload">
          <div className="form-group">
            <label>Preview Image (Catalogue)</label>
            <div className="image-upload-container">
              <div className="image-upload-options">
                <div className="upload-option">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                  <label htmlFor="imageUpload" className="upload-button">
                    <PhotoIcon className="upload-icon" />
                    Choose File
                  </label>
                </div>
                <span className="or-divider">Or</span>
                <div className="url-option">
                  <input
                    type="url"
                    placeholder="External image URL"
                    value={formData.imageUrl}
                    onChange={handleImageUrlChange}
                    className="url-input"
                  />
                </div>
              </div>
              
              {previewImage && (
                <div className="image-preview">
                  <img src={previewImage} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => {
                      setPreviewImage(null);
                      setFormData(prev => ({
                        ...prev,
                        imageFile: null,
                        imageUrl: ''
                      }));
                    }}
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button">
            <ArrowUturnLeftIcon className="button-icon" />
            Cancel
          </button>
          <button type="submit" className="submit-button">
            <DocumentTextIcon className="button-icon" />
            Add Manuscript
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadManuscript;