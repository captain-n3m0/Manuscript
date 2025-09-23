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
  signup: async (name, email, password, phone) => {
    try {
      const response = await api.post('/api/auth/signup', {
        name,
        email,
        password,
        phone
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

export default api;
