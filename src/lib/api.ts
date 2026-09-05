import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Send httpOnly cookies (primary auth method)
});

// ── Request Interceptor ───────────────────────────────────────────────────────
// Attach Authorization header as fallback in case cookies aren't forwarded
// (e.g. cross-origin dev setup, Postman-like clients, or cookie timing issues)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    if (config.headers && typeof config.headers.set === 'function') {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Response Interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const msg = error.response?.data?.message || error.message;
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} →`, msg);
    return Promise.reject(error);
  }
);

export const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads/')) {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const baseUrl = apiUrl.replace(/\/api(\/v1)?\/?$/, '');
    return `${baseUrl}${url}`;
  }
  return url;
};

export default api;
