import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach JWT token dynamically from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eptms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Graceful response error handling (prevents random logouts)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only wipe token if credentials explicitly expired on an auth check
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('eptms_token');
      localStorage.removeItem('eptms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;