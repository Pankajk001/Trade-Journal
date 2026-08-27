import api from './api';

const authService = {
  getMe: async () => {
    const { data } = await api.get('/api/auth/me');
    return data;
  },

  login: async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      return data;
    } catch (err) {
      console.warn('API unavailable. Simulating mock login for presentation.', err);
      // Mock successful login
      return {
        _id: 'mock_user_123',
        name: 'Demo User',
        email: email,
        token: 'mock_jwt_token_123'
      };
    }
  },

  register: async (name, email, password) => {
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      return data;
    } catch (err) {
      console.warn('API unavailable. Simulating mock registration.', err);
      return {
        _id: 'mock_user_123',
        name: name,
        email: email,
        token: 'mock_jwt_token_123'
      };
    }
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
