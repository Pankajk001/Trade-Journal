import axios from 'axios';

const api = axios.create({
  // Use VITE_API_URL in production (Vercel), fallback to empty string locally (Vite proxy)
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
