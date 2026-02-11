import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { callXanoEndpoint, setAuthToken, getAuthToken } from '../utils/apiClient';

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user was previously logged in (restore from token)
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      console.log('[Auth] Token found, fetching user data...');
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log('[Auth] Fetching current user...');
      const response = await callXanoEndpoint('auth/me', 'GET');
      
      console.log('[Auth] User data:', response);
      
      if (response && response.user) {
        const userData: User = {
          id: response.user.id,
          firstName: response.user.firstName || response.user.first_name || '',
          lastName: response.user.lastName || response.user.last_name || '',
          username: response.user.username || '',
          email: response.user.email || '',
          phone: response.user.phone || response.user.phoneNumber || '',
          address: response.user.address || '',
          avatar: response.user.avatar || undefined,
        };
        
        setUser(userData);
        setIsLoggedIn(true);
      } else if (response && typeof response === 'object') {
        // Handle case where user data is directly in response
        const userData: User = {
          id: response.id,
          firstName: response.firstName || response.first_name || '',
          lastName: response.lastName || response.last_name || '',
          username: response.username || '',
          email: response.email || '',
          phone: response.phone || response.phoneNumber || '',
          address: response.address || '',
          avatar: response.avatar || undefined,
        };
        
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (err: any) {
      console.error('[Auth] Failed to fetch user:', err);
      setError(err.response?.data?.message || 'Failed to load user data');
      setIsLoggedIn(false);
      setUser(null);
      
      // Clear invalid token
      if (err.response?.status === 401) {
        setAuthToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        email,
        password
      };

      console.log('[Auth] Logging in...');
      const response = await callXanoEndpoint('auth/login', 'POST', payload);
      
      console.log('[Auth] Login response:', response);
      
      const token = response.authToken || response.auth_token || response.token;
      
      if (!token) {
        throw new Error('No auth token received');
      }

      setAuthToken(token);
      
      // Fetch user data after login
      await fetchCurrentUser();
    } catch (err: any) {
      console.error('[Auth] Login failed:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup with user data
  const signup = async (userData: any) => {
    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address,
        phoneNumber: userData.phone
      };

      console.log('[Auth] Signing up...');
      const response = await callXanoEndpoint('auth/signup', 'POST', payload);
      
      console.log('[Auth] Signup response:', response);
      
      const token = response.authToken || response.auth_token || response.token;
      
      if (!token) {
        throw new Error('No auth token received');
      }

      setAuthToken(token);
      
      // Fetch user data after signup
      await fetchCurrentUser();
    } catch (err: any) {
      console.error('[Auth] Signup failed:', err);
      const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = () => {
    console.log('[Auth] Logging out...');
    setAuthToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isLoggedIn,
    isLoading,
    error,
    login,
    signup,
    logout,
    fetchCurrentUser,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
