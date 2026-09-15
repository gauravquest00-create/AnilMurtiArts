import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Response interceptor for clean error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Unable to connect to the server. Please check your network connection.';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
