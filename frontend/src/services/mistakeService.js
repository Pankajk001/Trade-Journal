import api from './api';

const mistakeService = {
  getMistakes: async (keyword = '') => {
    const { data } = await api.get(`/api/mistakes?keyword=${keyword}`);
    return data;
  },

  createMistake: async (mistakeData) => {
    const { data } = await api.post('/api/mistakes', mistakeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  deleteMistake: async (id) => {
    const { data } = await api.delete(`/api/mistakes/${id}`);
    return data;
  }
};

export default mistakeService;
