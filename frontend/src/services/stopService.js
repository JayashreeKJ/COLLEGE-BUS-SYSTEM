import api from './api';

export const stopService = {
  getAllStops: async () => {
    const res = await api.get('/stops');
    return res.data;
  },
};

export default stopService;
