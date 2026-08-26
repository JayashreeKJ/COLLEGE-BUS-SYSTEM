import api from './api';

export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Unable to connect to backend server',
    };
  }
};
