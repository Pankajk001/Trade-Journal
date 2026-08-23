import api from './api';

const noteService = {
  getNotes: async (keyword = '', isPinned = '') => {
    const { data } = await api.get(`/api/notes?keyword=${keyword}&isPinned=${isPinned}`);
    return data;
  },

  createNote: async (noteData) => {
    const { data } = await api.post('/api/notes', noteData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  deleteNote: async (id) => {
    const { data } = await api.delete(`/api/notes/${id}`);
    return data;
  }
};

export default noteService;
