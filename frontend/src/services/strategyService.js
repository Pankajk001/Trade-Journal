import api from './api';

const strategyService = {
  getStrategies: async () => {
    const { data } = await api.get('/api/strategies');
    return data;
  },

  createStrategy: async (strategyData) => {
    const { data } = await api.post('/api/strategies', strategyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  deleteStrategy: async (id) => {
    const { data } = await api.delete(`/api/strategies/${id}`);
    return data;
  }
};

export default strategyService;
