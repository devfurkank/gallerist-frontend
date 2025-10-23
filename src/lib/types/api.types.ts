export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
}

// Backend error response format
export interface ApiErrorResponse {
  status: number;
  exception: {
    path: string;
    createTime: string;
    hostName: string;
    message: string | Record<string, string[]>;
  };
}
