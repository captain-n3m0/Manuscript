import React from 'react';
import './HelpGuide.css';
import {
  DocumentTextIcon,
  PhotoIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  BookOpenIcon,
  ClockIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const HelpGuide = () => {
  const guidelines = [
    {
      id: 1,
      title: 'Manuscript Submission Guidelines',
      icon: DocumentTextIcon,
      items: [
        'Ensure the manuscript is complete and legible',
        'Provide accurate dating and origin information if known',
        'Include clear photographs of the manuscript',
        'Describe the physical condition accurately',
        'Mention any special handling requirements'
      ]
    },
    {
      id: 2,
      title: 'Image Guidelines',
      icon: PhotoIcon,
      items: [
        'Upload high-resolution images (minimum 300 DPI)',
        'Include multiple angles if necessary',
        'Ensure proper lighting in photographs',
        'Add close-ups of significant details',
        'Maximum file size: 10MB per image'
      ]
    },
    {
      id: 3,
      title: 'Content Standards',
      icon: ShieldCheckIcon,
      items: [
        'Provide accurate and verifiable information',
        'Cite reliable sources when available',
        'Maintain neutral point of view',
        'Respect copyright and intellectual property rights',
        'Avoid speculation in descriptions'
      ]
    },
    {
      id: 4,
      title: 'Community Guidelines',
      icon: UserGroupIcon,
      items: [
        'Be respectful to other contributors',
        'Follow the peer review process',
        'Collaborate on manuscript verification',
        'Help maintain quality standards',
        'Report inappropriate content'
      ]
    }
  ];

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpenIcon,
      content: 'Welcome to Manupedia! This platform is dedicated to preserving and sharing historical manuscripts. Whether you\'re a scholar, researcher, or history enthusiast, you can contribute to this growing repository of knowledge.'
    },
    {
      id: 'how-to-contribute',
      title: 'How to Contribute',
      icon: ClockIcon,
      content: 'To contribute, first create an account and verify your email. You can then upload manuscripts, add descriptions, or help improve existing entries. All contributions are reviewed by our community moderators.'
    },
    {
      id: 'search-tips',
      title: 'Search Tips',
      icon: MagnifyingGlassIcon,
      content: 'Use specific keywords, time periods, or locations to find manuscripts. You can filter results by language, condition, and date range. Advanced search options are available for more precise queries.'
    },
    {
      id: 'important-notices',
      title: 'Important Notices',
      icon: ExclamationTriangleIcon,
      content: 'Please ensure all uploaded content respects copyright laws. Some manuscripts may have specific usage restrictions. Always verify the source and permissions before uploading.'
    }
  ];

  return (
    <div className="help-guide">
      <div className="help-header">
        <h1>Help & Guidelines</h1>
        <p className="help-intro">
          Learn how to contribute effectively to Manupedia and make the most of our platform.
        </p>
      </div>

      <div className="help-sections">
        {sections.map((section) => {
          const IconComponent = section.icon;
          return (
            <div key={section.id} className="help-section">
              <div className="section-header">
                <IconComponent className="section-icon" />
                <h2>{section.title}</h2>
              </div>
              <p>{section.content}</p>
            </div>
          );
        })}
      </div>

      <div className="guidelines-container">
        <h2>Detailed Guidelines</h2>
        <div className="guidelines-grid">
          {guidelines.map((guide) => {
            const IconComponent = guide.icon;
            return (
              <div key={guide.id} className="guideline-card">
                <div className="guideline-header">
                  <IconComponent className="guideline-icon" />
                  <h3>{guide.title}</h3>
                </div>
                <ul>
                  {guide.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="help-footer">
        <p>
          Need more help? Contact our support team at{' '}
          <a href="mailto:support@manupedia.org">support@manupedia.org</a>
        </p>
      </div>
    </div>
  );
};

export default HelpGuide;