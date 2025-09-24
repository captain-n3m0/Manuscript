import React from 'react';
import './HelpGuidelines.css';
import {
  DocumentTextIcon,
  CloudArrowUpIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  BookOpenIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const HelpGuidelines = ({ onClose }) => {
  return (
    <div className="help-guidelines-overlay">
      <div className="help-guidelines-modal">
        <div className="modal-header">
          <div className="header-content">
            <InformationCircleIcon className="header-icon" />
            <h1>Help & Guidelines</h1>
          </div>
          {onClose && (
            <button className="close-button" onClick={onClose}>
              <XMarkIcon />
            </button>
          )}
        </div>

        <div className="modal-content">
          <div className="guidelines-content">

            {/* Introduction */}
            <section className="guidelines-section">
              <div className="section-header">
                <BookOpenIcon className="section-icon" />
                <h2>Welcome to Manupedia</h2>
              </div>
              <p className="section-description">
                Manupedia is a collaborative platform for preserving and sharing historical manuscripts.
                Our community-driven approach ensures that valuable historical documents are digitized,
                cataloged, and made accessible to researchers and enthusiasts worldwide.
              </p>
            </section>

            {/* Getting Started */}
            <section className="guidelines-section">
              <div className="section-header">
                <CheckCircleIcon className="section-icon" />
                <h2>Getting Started</h2>
              </div>
              <div className="guidelines-list">
                <div className="guideline-item">
                  <strong>1. Create an Account</strong>
                  <p>Sign up with your email to start contributing to our manuscript collection.</p>
                </div>
                <div className="guideline-item">
                  <strong>2. Browse Manuscripts</strong>
                  <p>Explore our collection using the search and filter options to find manuscripts by title, author, language, or condition.</p>
                </div>
                <div className="guideline-item">
                  <strong>3. Upload Manuscripts</strong>
                  <p>Share your own manuscript discoveries by uploading high-quality images and detailed metadata.</p>
                </div>
              </div>
            </section>

            {/* Upload Guidelines */}
            <section className="guidelines-section">
              <div className="section-header">
                <CloudArrowUpIcon className="section-icon" />
                <h2>Manuscript Upload Guidelines</h2>
              </div>
              <div className="guidelines-list">
                <div className="guideline-item">
                  <strong>Required Information</strong>
                  <ul>
                    <li><strong>Title:</strong> Provide the manuscript's title or a descriptive name</li>
                    <li><strong>Author:</strong> Include the original author if known</li>
                    <li><strong>Date Created:</strong> Historical period or approximate date</li>
                    <li><strong>Origin/Location:</strong> Geographic origin or current location</li>
                  </ul>
                </div>
                <div className="guideline-item">
                  <strong>Optional Details</strong>
                  <ul>
                    <li><strong>Language:</strong> Original language(s) of the manuscript</li>
                    <li><strong>Material:</strong> Writing surface (vellum, papyrus, paper, etc.)</li>
                    <li><strong>Dimensions:</strong> Physical size measurements</li>
                    <li><strong>Condition:</strong> Current state of preservation</li>
                  </ul>
                </div>
                <div className="guideline-item">
                  <strong>Content & Description</strong>
                  <ul>
                    <li>Provide detailed descriptions of the manuscript's content</li>
                    <li>Include transcriptions when possible</li>
                    <li>Note any unique features or historical significance</li>
                    <li>Use formatting to organize information clearly</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Image Guidelines */}
            <section className="guidelines-section">
              <div className="section-header">
                <DocumentTextIcon className="section-icon" />
                <h2>Image Requirements</h2>
              </div>
              <div className="guidelines-list">
                <div className="guideline-item">
                  <strong>Quality Standards</strong>
                  <ul>
                    <li>High resolution (minimum 300 DPI recommended)</li>
                    <li>Clear, well-lit photographs</li>
                    <li>Minimal shadows and reflections</li>
                    <li>Accurate color representation</li>
                  </ul>
                </div>
                <div className="guideline-item">
                  <strong>Technical Requirements</strong>
                  <ul>
                    <li>Supported formats: JPEG, PNG, WebP</li>
                    <li>Maximum file size: 10MB</li>
                    <li>Recommended dimensions: 400x600px or larger</li>
                  </ul>
                </div>
                <div className="guideline-item">
                  <strong>Copyright & Permissions</strong>
                  <ul>
                    <li>Ensure you have rights to upload the image</li>
                    <li>Respect institutional policies and copyright laws</li>
                    <li>Credit original sources when applicable</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Community Standards */}
            <section className="guidelines-section">
              <div className="section-header">
                <UserGroupIcon className="section-icon" />
                <h2>Community Standards</h2>
              </div>
              <div className="guidelines-list">
                <div className="guideline-item">
                  <strong>Academic Integrity</strong>
                  <p>Maintain scholarly standards by providing accurate information and proper citations.</p>
                </div>
                <div className="guideline-item">
                  <strong>Respectful Collaboration</strong>
                  <p>Foster a welcoming environment for researchers from all backgrounds and expertise levels.</p>
                </div>
                <div className="guideline-item">
                  <strong>Quality Contributions</strong>
                  <p>Strive for completeness and accuracy in your manuscript submissions.</p>
                </div>
              </div>
            </section>

            {/* Important Notes */}
            <section className="guidelines-section warning">
              <div className="section-header">
                <ExclamationTriangleIcon className="section-icon warning-icon" />
                <h2>Important Notes</h2>
              </div>
              <div className="guidelines-list">
                <div className="guideline-item">
                  <strong>Authentication Required</strong>
                  <p>You must be logged in to upload manuscripts. This helps us maintain quality and accountability.</p>
                </div>
                <div className="guideline-item">
                  <strong>Review Process</strong>
                  <p>Uploaded manuscripts may be reviewed by our community moderators to ensure they meet quality standards.</p>
                </div>
                <div className="guideline-item">
                  <strong>Data Privacy</strong>
                  <p>Your uploads are associated with your account. You can edit or delete your own manuscripts at any time.</p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="guidelines-section">
              <div className="section-header">
                <InformationCircleIcon className="section-icon" />
                <h2>Need More Help?</h2>
              </div>
              <p className="section-description">
                If you have questions not covered in these guidelines, or if you encounter any issues
                while using Manupedia, please don't hesitate to reach out to our community support team.
              </p>
              <div className="contact-info">
                <p><strong>Email:</strong> support@manupedia.org</p>
                <p><strong>Community Forum:</strong> Available in the main navigation</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpGuidelines;
