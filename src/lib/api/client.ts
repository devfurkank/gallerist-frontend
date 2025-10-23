import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: '', // No base URL, each API will use full path
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token persistence in localStorage
const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

let accessToken: string | null = localStorage.getItem(TOKEN_KEY);
let refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN_KEY);

console.log('API Client initialized');
console.log('Tokens loaded from localStorage:', { 
  accessToken: accessToken ? accessToken.substring(0, 20) + '...' : 'null', 
  refreshToken: refreshToken ? refreshToken.substring(0, 20) + '...' : 'null' 
});

export const setTokens = (access: string, refresh: string) => {
  console.log('setTokens called with:', { 
    access: access?.substring(0, 20) + '...', 
    refresh: refresh?.substring(0, 20) + '...' 
  });
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  console.log('Tokens saved to localStorage');
  console.log('Tokens in memory:', { accessToken: !!accessToken, refreshToken: !!refreshToken });
  console.log('Tokens in localStorage:', { 
    accessToken: !!localStorage.getItem(TOKEN_KEY), 
    refreshToken: !!localStorage.getItem(REFRESH_TOKEN_KEY) 
  });
};

export const getAccessToken = () => accessToken;
export const getRefreshToken = () => refreshToken;

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  console.log('Tokens cleared from localStorage');
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Access Token available:', !!accessToken);
    if (accessToken) {
      console.log('Token (first 20 chars):', accessToken.substring(0, 20) + '...');
    }
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('Authorization header set');
    } else {
      console.warn('No access token available for request');
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    console.error('API Response Error:', error.response?.status, error.config?.url, error.message);
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (!refreshToken) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post('/refresh_token', {
          refreshToken,
        });
        const { accessToken: newAccessToken } = response.data.payload;
        setTokens(newAccessToken, refreshToken);
        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
