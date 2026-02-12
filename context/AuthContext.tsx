import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { callXanoEndpoint, setAuthToken, getAuthToken } from '../utils/apiClient';

export interface UserAddress {
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  address?: string;
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  billingAddress?: UserAddress;
  shippingAddress?: UserAddress;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (identifier: string, password: string) => Promise<void>;
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
      
      // Robust mapping helper
      const mapDataToUser = (data: any): User => {
          const mapAddress = (addr: any) => addr ? ({
              country: addr.country,
              state: addr.state,
              city: addr.city,
              postalCode: addr.postal_code || addr.postalCode,
              address: addr.address
          }) : undefined;

          return {
              id: data.id ? String(data.id) : undefined,
              firstName: data.firstName || data.first_name || (data.name ? data.name.split(' ')[0] : '') || '',
              lastName: data.lastName || data.last_name || (data.name ? data.name.split(' ').slice(1).join(' ') : '') || '',
              username: data.username || data.user_name || '',
              email: data.email || '',
              phone: String(data.phone || data.phoneNumber || data.phone_number || ''),
              address: data.address || '',
              avatar: data.image || data.avatar || (data.profile_image ? data.profile_image.url : undefined) || undefined,
              billingAddress: mapAddress(data.billing_address || data.billingAddress),
              shippingAddress: mapAddress(data.shipping_address || data.shippingAddress),
          };
      };

      if (response && response.user) {
         setUser(mapDataToUser(response.user));
         setIsLoggedIn(true);
      } else if (response && typeof response === 'object' && (response.id || response.email || response.name || response.firstName)) {
         setUser(mapDataToUser(response));
         setIsLoggedIn(true);
      } else {
         console.warn('[Auth] Unexpected user response format:', response);
         setIsLoggedIn(false);
         setUser(null);
      }
    } catch (err: any) {
      console.error('[Auth] Failed to fetch user:', err);
      setError(err.message || 'Failed to load user data');
      setIsLoggedIn(false);
      setUser(null);
      
      // Clear invalid token if unauthorized
      if (err.message?.includes('Authentication failed')) {
        setAuthToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Login with email or username and password
  const login = async (identifier: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Distinguish between email and username for the payload
      const payload: any = { password };
      if (identifier.includes('@')) {
        payload.email = identifier;
      } else {
        payload.username = identifier;
      }

      console.log('[Auth] Logging in with:', identifier.includes('@') ? 'email' : 'username');
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
      let errorMessage = err.message || 'Login failed.';
      
      // Refine generic 401/auth errors to be more specific to the input type
      const lowerError = errorMessage.toLowerCase();
      if (lowerError.includes('authentication failed') || 
          lowerError.includes('credentials') ||
          lowerError.includes('invalid information')) {
        const type = identifier.includes('@') ? 'email' : 'username';
        errorMessage = `Invalid ${type} or password. Please try again.`;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
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
      
      // Set user directly from response if present
      const responseUser = response.user;
      if (responseUser) {
         const mapAddress = (addr: any) => addr ? ({
             country: addr.country,
             state: addr.state,
             city: addr.city,
             postalCode: addr.postal_code || addr.postalCode,
             address: addr.address
         }) : undefined;

         setUser({
            id: responseUser.id ? String(responseUser.id) : undefined,
            firstName: responseUser.firstName || responseUser.first_name || (responseUser.name ? responseUser.name.split(' ')[0] : '') || '',
            lastName: responseUser.lastName || responseUser.last_name || (responseUser.name ? responseUser.name.split(' ').slice(1).join(' ') : '') || '',
            username: responseUser.username || '',
            email: responseUser.email || '',
            phone: String(responseUser.phone || responseUser.phoneNumber || ''),
            address: responseUser.address || '',
            avatar: responseUser.image || responseUser.avatar || undefined,
            billingAddress: mapAddress(responseUser.billing_address || responseUser.billingAddress),
            shippingAddress: mapAddress(responseUser.shipping_address || responseUser.shippingAddress),
         });
         setIsLoggedIn(true);
      } else {
         await fetchCurrentUser();
      }
    } catch (err: any) {
      console.error('[Auth] Signup failed:', err);
      const errorMessage = err.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
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
