import api from './api';

export const tripService = {
  getLatestLocation: async (tripId) => {
    if (!tripId) return null;
    const res = await api.get(`/trips/${tripId}/location/latest`);
    return res.data;
  },

  getLocationHistory: async (tripId) => {
    if (!tripId) return [];
    const res = await api.get(`/trips/${tripId}/location/history`);
    return res.data;
  },

  getActiveTrips: async () => {
    const res = await api.get('/trips/active');
    return res.data;
  },

  recordLocation: async (tripId, locationData) => {
    const res = await api.post(`/trips/${tripId}/location`, locationData);
    return res.data;
  },
};

export default tripService;
