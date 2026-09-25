import api from './api';

export const checkBackendHealth = async () => {
  const targetUrl = `${api.defaults.baseURL || '/api'}/health`;
  console.log('[SmartBus HealthCheck] Request URL:', targetUrl);

  try {
    const response = await api.get('/health');
    console.log('[SmartBus HealthCheck] HTTP Status:', response.status);
    console.log('[SmartBus HealthCheck] Response Body:', response.data);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    console.error('[SmartBus HealthCheck] Request URL:', targetUrl);
    console.error('[SmartBus HealthCheck] HTTP Status:', error.response?.status || 'NO_RESPONSE');
    console.error('[SmartBus HealthCheck] Response Body:', error.response?.data || null);
    console.error('[SmartBus HealthCheck] Error Object:', error);

    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Unable to connect to backend server',
      status: error.response?.status,
    };
  }
};
