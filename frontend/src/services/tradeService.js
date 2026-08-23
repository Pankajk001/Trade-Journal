import api from './api';

const tradeService = {
  getTrades: async (keyword = '', winLoss = '', session = '', pageNumber = 1) => {
    const { data } = await api.get(
      `/api/trades?keyword=${keyword}&winLoss=${winLoss}&session=${session}&pageNumber=${pageNumber}`
    );
    return data;
  },

  getPublicTrades: async () => {
    const { data } = await api.get('/api/trades/public');
    return data;
  },

  getTradeById: async (id) => {
    const { data } = await api.get(`/api/trades/${id}`);
    return data;
  },

  createTrade: async (tradeData) => {
    const { data } = await api.post('/api/trades', tradeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  deleteTrade: async (id) => {
    const { data } = await api.delete(`/api/trades/${id}`);
    return data;
  },

  parseImage: async (formData) => {
    const { data } = await api.post('/api/trades/parse-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }
};

export default tradeService;
