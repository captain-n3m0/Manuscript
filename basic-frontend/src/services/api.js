import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8080', // Spring Boot backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // User login
  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // User signup
  signup: async (name, email, password) => {
    try {
      const response = await api.post('/api/auth/signup', {
        name,
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Signup failed' };
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user profile' };
    }
  }
};

// Manuals API calls
export const manualsAPI = {
  // Get all manuals
  getAllManuals: async () => {
    try {
      const response = await api.get('/api/manuals');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch manuals' };
    }
  },

  // Get manual by ID
  getManualById: async (id) => {
    try {
      const response = await api.get(`/api/manuals/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch manual' };
    }
  },

  // Search manuals
  searchManuals: async (query) => {
    try {
      const response = await api.get(`/api/manuals/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Search failed' };
    }
  },

  // Upload manual (for authenticated users)
  uploadManual: async (manualData) => {
    try {
      const response = await api.post('/api/manuals', manualData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload manual' };
    }
  }
};

// Reviews API calls
export const reviewsAPI = {
  // Get reviews for a manual
  getReviewsForManual: async (manualId) => {
    try {
      const response = await api.get(`/api/reviews/manual/${manualId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch reviews' };
    }
  },

  // Add review for a manual
  addReview: async (manualId, reviewData) => {
    try {
      const response = await api.post(`/api/reviews/manual/${manualId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add review' };
    }
  }
};

// Manuscripts API calls
export const manuscriptsAPI = {
  // Upload a new manuscript
  uploadManuscript: async (manuscriptData, imageFile) => {
    try {
      const formData = new FormData();

      // Add manuscript data as JSON blob
      formData.append('manuscript', new Blob([JSON.stringify(manuscriptData)], {
        type: 'application/json'
      }));

      // Add image file if provided
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.post('/api/manuscripts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload manuscript' };
    }
  },

  // Update an existing manuscript
  updateManuscript: async (id, manuscriptData, imageFile) => {
    try {
      const formData = new FormData();

      formData.append('manuscript', new Blob([JSON.stringify(manuscriptData)], {
        type: 'application/json'
      }));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.put(`/api/manuscripts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update manuscript' };
    }
  },

  // Get a specific manuscript by ID
  getManuscript: async (id) => {
    try {
      const response = await api.get(`/api/manuscripts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch manuscript' };
    }
  },

  // Get all manuscripts with pagination
  getAllManuscripts: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/api/manuscripts?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch manuscripts' };
    }
  },

  // Get user's manuscripts
  getUserManuscripts: async () => {
    try {
      const response = await api.get('/api/manuscripts/my-manuscripts');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user manuscripts' };
    }
  },

  // Search manuscripts
  searchManuscripts: async (searchParams, page = 0, size = 10) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...searchParams
      });

      const response = await api.get(`/api/manuscripts/search?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search manuscripts' };
    }
  },

  // Delete a manuscript
  deleteManuscript: async (id) => {
    try {
      const response = await api.delete(`/api/manuscripts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete manuscript' };
    }
  },

  // Get manuscript by ID
  getManuscriptById: async (id) => {
    try {
      const response = await api.get(`/api/manuscripts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch manuscript details' };
    }
  },

  // Download manuscript
  downloadManuscript: async (id) => {
    try {
      const response = await api.get(`/api/manuscripts/${id}/download`, {
        responseType: 'blob'
      });

      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `manuscript-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      return true;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to download manuscript' };
    }
  },

  // Test API connection
  testConnection: async () => {
    try {
      const response = await api.get('/api/manuscripts/test');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to test connection' };
    }
  },

  // Get statistics
  getStatistics: async () => {
    try {
      const response = await api.get('/api/manuscripts/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch statistics' };
    }
  },

  // Get recent manuscripts
  getRecentManuscripts: async (limit = 5) => {
    try {
      const response = await api.get(`/api/manuscripts/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch recent manuscripts' };
    }
  },

  // Get featured manuscript
  getFeaturedManuscript: async () => {
    try {
      const response = await api.get('/api/manuscripts/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch featured manuscript' };
    }
  }
};

// Admin API calls
export const adminAPI = {
  // User Management
  getAllUsers: async (page = 0, size = 20) => {
    try {
      const response = await api.get(`/api/admin/users?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/api/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/api/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/api/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },

  updateUserRole: async (id, role) => {
    try {
      const response = await api.put(`/api/admin/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user role' };
    }
  },

  // Manuscript Management
  getAllManuscriptsForAdmin: async (page = 0, size = 20, status = null) => {
    try {
      let url = `/api/admin/manuscripts?page=${page}&size=${size}`;
      if (status) {
        url += `&status=${status}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch manuscripts' };
    }
  },

  updateManuscriptStatus: async (id, status) => {
    try {
      const response = await api.put(`/api/admin/manuscripts/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update manuscript status' };
    }
  },

  deleteManuscriptAsAdmin: async (id) => {
    try {
      const response = await api.delete(`/api/admin/manuscripts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete manuscript' };
    }
  },

  // System Statistics
  getDetailedStatistics: async () => {
    try {
      const response = await api.get('/api/admin/statistics/detailed');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch detailed statistics' };
    }
  },

  getRecentActivity: async () => {
    try {
      const response = await api.get('/api/admin/statistics/activity');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch recent activity' };
    }
  },

  getSystemHealth: async () => {
    try {
      const response = await api.get('/api/admin/system/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch system health' };
    }
  }
};

export default api;
