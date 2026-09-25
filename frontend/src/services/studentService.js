import api from './api';

export const studentService = {
  getMyProfile: async () => {
    const res = await api.get('/students/me');
    return res.data;
  },

  updatePickupStop: async (stopId) => {
    const res = await api.put('/students/me/pickup-stop', { stopId });
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put('/students/me/profile', data);
    return res.data;
  },
};

export default studentService;
