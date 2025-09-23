import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';
import { useAuth } from '../contexts/AuthContext';

const AdminPanel = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState({
        totalManuscripts: 0,
        recentUpdates: 0,
        contributors: 0
    });
    const [manuscripts, setManuscripts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchStats();
        fetchManuscripts();
    }, [currentPage, filterStatus, searchTerm]);

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/dashboard/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchManuscripts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/manuscripts', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page: currentPage - 1,
                    size: 10,
                    status: filterStatus !== 'all' ? filterStatus : null,
                    search: searchTerm || null
                }
            });
            setManuscripts(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching manuscripts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (manuscriptId, newStatus) => {
        try {
            await axios.patch(`/api/admin/manuscripts/${manuscriptId}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchManuscripts();
        } catch (error) {
            console.error('Error updating manuscript status:', error);
        }
    };

    const handleDelete = async (manuscriptId) => {
        if (window.confirm('Are you sure you want to delete this manuscript?')) {
            try {
                await axios.delete(`/api/admin/manuscripts/${manuscriptId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchManuscripts();
            } catch (error) {
                console.error('Error deleting manuscript:', error);
            }
        }
    };

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Manuscripts</h3>
                    <p>{stats.totalManuscripts}</p>
                </div>
                <div className="stat-card">
                    <h3>Recent Updates</h3>
                    <p>{stats.recentUpdates}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Contributors</h3>
                    <p>{stats.contributors}</p>
                </div>
            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search manuscripts..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table className="manuscripts-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Status</th>
                                <th>Last Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {manuscripts.map((manuscript) => (
                                <tr key={manuscript.id}>
                                    <td>{manuscript.title}</td>
                                    <td>{manuscript.author}</td>
                                    <td>{manuscript.status}</td>
                                    <td>{new Date(manuscript.updatedAt).toLocaleDateString()}</td>
                                    <td className="action-buttons">
                                        {manuscript.status === 'PENDING' && (
                                            <>
                                                <button
                                                    className="btn btn-approve"
                                                    onClick={() => handleStatusChange(manuscript.id, 'APPROVED')}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn btn-delete"
                                                    onClick={() => handleStatusChange(manuscript.id, 'REJECTED')}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <button
                                            className="btn btn-edit"
                                            onClick={() => window.location.href = `/manuscripts/${manuscript.id}/edit`}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-delete"
                                            onClick={() => handleDelete(manuscript.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminPanel;