import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../services/api';
import './AdminPage.css';
import {
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [manuscripts, setManuscripts] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is admin
  const isAdmin = user && user.role === 'ADMIN';

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch data for admin dashboard
      const [statsData, manuscriptsData, usersData] = await Promise.all([
        adminAPI.getDetailedStatistics(),
        adminAPI.getAllManuscriptsForAdmin(0, 50),
        adminAPI.getAllUsers(0, 20)
      ]);

      setStatistics(statsData);
      setManuscripts(manuscriptsData.content || manuscriptsData || []);
      setUsers(usersData.content || usersData || []);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteManuscript = async (manuscriptId) => {
    if (window.confirm('Are you sure you want to delete this manuscript?')) {
      try {
        await adminAPI.deleteManuscriptAsAdmin(manuscriptId);
        setManuscripts(manuscripts.filter(m => m.id !== manuscriptId));
      } catch (err) {
        console.error('Failed to delete manuscript:', err);
        alert('Failed to delete manuscript');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
      } catch (err) {
        console.error('Failed to delete user:', err);
        alert('Failed to delete user');
      }
    }
  };

  const renderDashboard = () => (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* System Statistics */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <DocumentTextIcon className="stat-icon" />
          <div className="stat-content">
            <h3>{statistics.manuscripts?.totalManuscripts || 0}</h3>
            <p>Total Manuscripts</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <UsersIcon className="stat-icon" />
          <div className="stat-content">
            <h3>{statistics.users?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <ChartBarIcon className="stat-icon" />
          <div className="stat-content">
            <h3>{statistics.manuscripts?.recentUpdates || 0}</h3>
            <p>Recent Updates</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <ExclamationTriangleIcon className="stat-icon pending" />
          <div className="stat-content">
            <h3>{statistics.users?.adminUsers || 0}</h3>
            <p>Admin Users</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-recent-activity">
        <h3>Recent Manuscripts</h3>
        <div className="activity-list">
          {manuscripts.slice(0, 5).map((manuscript) => (
            <div key={manuscript.id} className="activity-item">
              <div className="activity-info">
                <h4>{manuscript.title}</h4>
                <p>By {manuscript.author} • Uploaded by {manuscript.uploadedByUsername}</p>
                <span className="activity-date">
                  {new Date(manuscript.uploadDate).toLocaleDateString()}
                </span>
              </div>
              <div className="activity-actions">
                <button className="btn-icon view" title="View">
                  <EyeIcon className="icon" />
                </button>
                <button className="btn-icon edit" title="Edit">
                  <PencilIcon className="icon" />
                </button>
                <button
                  className="btn-icon delete"
                  title="Delete"
                  onClick={() => handleDeleteManuscript(manuscript.id)}
                >
                  <TrashIcon className="icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="admin-users">
      <div className="section-header">
        <h2>User Management</h2>
        <button className="btn-primary">Add User</button>
      </div>

      <div className="users-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Join Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.id * 1000).toLocaleDateString()}</td> {/* Using ID as proxy for join date */}
                <td><span className="status-badge active">Active</span></td>
                <td>
                  <div className="table-actions">
                    <button className="btn-icon edit" title="Edit">
                      <PencilIcon className="icon" />
                    </button>
                    <button
                      className="btn-icon delete"
                      title="Delete"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <TrashIcon className="icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderManuscriptManagement = () => (
    <div className="admin-manuscripts">
      <div className="section-header">
        <h2>Manuscript Management</h2>
        <div className="header-actions">
          <select className="filter-select">
            <option>All Status</option>
            <option>Published</option>
            <option>Pending</option>
            <option>Draft</option>
          </select>
          <button className="btn-secondary">Export</button>
        </div>
      </div>

      <div className="manuscripts-grid">
        {manuscripts.map((manuscript) => (
          <div key={manuscript.id} className="manuscript-card">
            <div className="manuscript-image">
              {manuscript.imageUrl ? (
                <img src={manuscript.imageUrl} alt={manuscript.title} />
              ) : (
                <div className="no-image">
                  <DocumentTextIcon className="placeholder-icon" />
                </div>
              )}
            </div>
            <div className="manuscript-info">
              <h3>{manuscript.title}</h3>
              <p className="manuscript-author">By {manuscript.author}</p>
              <p className="manuscript-meta">
                {manuscript.language} • {manuscript.material}
              </p>
              <p className="manuscript-uploader">
                Uploaded by {manuscript.uploadedByUsername}
              </p>
              <div className="manuscript-actions">
                <button className="btn-small view">
                  <EyeIcon className="icon" />
                  View
                </button>
                <button className="btn-small edit">
                  <PencilIcon className="icon" />
                  Edit
                </button>
                <button
                  className="btn-small delete"
                  onClick={() => handleDeleteManuscript(manuscript.id)}
                >
                  <TrashIcon className="icon" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="admin-settings">
      <h2>System Settings</h2>

      <div className="settings-sections">
        <div className="settings-section">
          <h3>General Settings</h3>
          <div className="setting-item">
            <label>Site Name</label>
            <input type="text" defaultValue="Manupedia" />
          </div>
          <div className="setting-item">
            <label>Site Description</label>
            <textarea defaultValue="The comprehensive digital archive of historical manuscripts"></textarea>
          </div>
          <div className="setting-item">
            <label>Allow User Registration</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>

        <div className="settings-section">
          <h3>Upload Settings</h3>
          <div className="setting-item">
            <label>Maximum File Size (MB)</label>
            <input type="number" defaultValue="10" />
          </div>
          <div className="setting-item">
            <label>Allowed File Types</label>
            <input type="text" defaultValue="jpg, jpeg, png, pdf" />
          </div>
          <div className="setting-item">
            <label>Require Admin Approval</label>
            <input type="checkbox" />
          </div>
        </div>

        <div className="settings-section">
          <h3>Security Settings</h3>
          <div className="setting-item">
            <label>Enable Two-Factor Authentication</label>
            <input type="checkbox" />
          </div>
          <div className="setting-item">
            <label>Session Timeout (minutes)</label>
            <input type="number" defaultValue="60" />
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-primary">Save Settings</button>
        <button className="btn-secondary">Reset to Defaults</button>
      </div>
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="admin-unauthorized">
        <ShieldCheckIcon className="unauthorized-icon" />
        <h2>Access Denied</h2>
        <p>You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage your Manupedia system</p>
      </div>

      <div className="admin-content">
        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <ChartBarIcon className="nav-icon" />
            Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <UsersIcon className="nav-icon" />
            Users
          </button>
          <button
            className={`nav-item ${activeTab === 'manuscripts' ? 'active' : ''}`}
            onClick={() => setActiveTab('manuscripts')}
          >
            <DocumentTextIcon className="nav-icon" />
            Manuscripts
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <CogIcon className="nav-icon" />
            Settings
          </button>
        </nav>

        <div className="admin-main">
          {error && (
            <div className="error-message">
              <ExclamationTriangleIcon className="error-icon" />
              {error}
            </div>
          )}

          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'users' && renderUserManagement()}
          {activeTab === 'manuscripts' && renderManuscriptManagement()}
          {activeTab === 'settings' && renderSystemSettings()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
