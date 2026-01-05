import { useState } from 'react';
import apiClient from '@/lib/axios';

interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  user: User;
  roles?: string[];
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Login attempt with credentials:', { email: credentials.email });
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      const { accessToken, refreshToken, user } = response.data;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Store user info
      localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err; // Throw error để Login.tsx catch được
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Register attempt with data:', data);
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      console.log('Register response:', response.data);
      
      const { accessToken, refreshToken, user } = response.data;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Store user info
      localStorage.setItem('user', JSON.stringify(user));

      return response.data;
    } catch (err: unknown) {
      console.error('Register error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err; // Throw error để Register.tsx catch được
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('accessToken');
  };

  return {
    login,
    register,
    logout,
    getCurrentUser,
    isAuthenticated,
    isLoading,
    error,
  };
}
