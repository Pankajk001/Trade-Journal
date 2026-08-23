import api from './api';

const authService = {
  getMe: async () => {
    const { data } = await api.get('/api/auth/me');
    return data;
  },

  login: async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    return data;
  },

  register: async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password });
    return data;
  },

  logout: async () => {
    const { data } = await api.post('/api/auth/logout');
    return data;
  },

  updateProfile: async (profileData) => {
    const { data } = await api.put('/api/auth/me', profileData);
    return data;
  }
};

export default authService;
