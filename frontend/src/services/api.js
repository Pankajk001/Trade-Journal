import axios from 'axios';

const api = axios.create({
  // Relying on Vite proxy for /api, so we don't need a hardcoded base URL here
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
