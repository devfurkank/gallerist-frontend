import apiClient, { setTokens, clearTokens } from './client';
import { LoginRequest, RegisterRequest, AuthResponse, RootEntity, User } from '../types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    console.log('Auth API - Sending login request to /authenticate');
    console.log('Auth API - Credentials:', { username: credentials.username });
    const response = await apiClient.post<RootEntity<AuthResponse>>('/authenticate', credentials);
    console.log('Auth API - Full response:', response);
    console.log('Auth API - Response data:', response.data);
    console.log('Auth API - Response payload:', response.data.payload);
    
    if (!response.data.payload || !response.data.payload.accessToken || !response.data.payload.refreshToken) {
      console.error('Auth API - Invalid response structure:', response.data);
      throw new Error('Invalid authentication response from server');
    }
    
    const { accessToken, refreshToken } = response.data.payload;
    console.log('Auth API - Tokens extracted:', { 
      accessToken: accessToken ? accessToken.substring(0, 20) + '...' : 'MISSING', 
      refreshToken: refreshToken ? refreshToken.substring(0, 20) + '...' : 'MISSING'
    });
    
    setTokens(accessToken, refreshToken);
    console.log('Auth API - Login complete, tokens set');
    return response.data.payload;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<RootEntity<User>>('/register', data);
    return response.data.payload;
  },

  logout: () => {
    clearTokens();
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<RootEntity<AuthResponse>>('/refresh_token', {
      refreshToken,
    });
    return response.data.payload;
  },
};
