import axios from 'axios';
import { API, STORAGE_KEYS } from '../constants';

const apiClient = axios.create({
  baseURL: API.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const isLoginRequest = config.url?.includes(API.LOGIN);
    if (isLoginRequest) {
      return config;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (raw) {
        const { token } = JSON.parse(raw);
        // Local accounts use a fake token — don't send it to DummyJSON
        if (token && !String(token).startsWith('local_')) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      /* ignore parse errors */
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
