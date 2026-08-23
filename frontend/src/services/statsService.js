import api from './api';

const statsService = {
  getStats: async () => {
    const { data } = await api.get('/api/trades/stats');
    return data;
  }
};

export default statsService;
