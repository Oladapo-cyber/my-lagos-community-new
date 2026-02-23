import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, UserRole, MerchantProfile, UserAddress } from '@mlc/shared-types';
import { mapBackendUserTypeToRole } from '@mlc/shared-types';
import { callXanoEndpoint, setAuthToken, getAuthToken } from '@mlc/api-client';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
const LAST_ACTIVITY_KEY = 'admin_last_activity';

interface AdminAuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(() => {
    setAuthToken(null, 'admin');
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    setUser(null);
    setError(null);
  }, []);

  useEffect(() => {
    const token = getAuthToken('admin');
    if (token) {
      // Check if session has expired on initial load
      const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
      if (lastActivity && Date.now() - parseInt(lastActivity, 10) > INACTIVITY_TIMEOUT) {
        // Session expired while away
        logout();
        setIsLoading(false);
      } else {
        fetchCurrentUser();
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (user) {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Set initial activity time when user logs in
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());

    let intervalId: NodeJS.Timeout;

    const checkInactivity = () => {
      const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
      if (lastActivity && Date.now() - parseInt(lastActivity, 10) > INACTIVITY_TIMEOUT) {
        console.log('[Admin Auth] Session expired due to inactivity');
        logout();
      }
    };

    // Check inactivity every minute
    intervalId = setInterval(checkInactivity, 60000);

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];

    // Throttle resetting the timer to avoid excessive localStorage writes (e.g., limit to once per second)
    let throttleTimeout: NodeJS.Timeout | null = null;
    const handleActivity = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          resetInactivityTimer();
          throttleTimeout = null;
        }, 1000);
      }
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      clearInterval(intervalId);
      if (throttleTimeout) clearTimeout(throttleTimeout);
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user, logout, resetInactivityTimer]);

  const fetchCurrentUser = async (setLoadingState = true) => {
    try {
      if (setLoadingState) setIsLoading(true);
      const response = await callXanoEndpoint('auth/me', 'GET', undefined, undefined, 'admin');

      const data = response?.user || response;
      if (!data) {
        throw new Error('No user data received');
      }

      const backendType = data.type || data.user_type || data.userType || data.role;
      const role: UserRole = mapBackendUserTypeToRole(backendType);

      // CRITICAL: Validate admin role
      if (role !== 'admin') {
        throw new Error('Unauthorized: Admin access only');
      }

      const mapAddress = (addr: any): UserAddress | undefined => addr ? ({
        country: addr.country,
        state: addr.state,
        city: addr.city,
        postalCode: addr.postal_code || addr.postalCode,
        address: addr.address
      }) : undefined;

      const merchantProfile: MerchantProfile | undefined = data.merchant_profile || data.merchantProfile
        ? {
            id: data.merchant_profile?.id || data.merchantProfile?.id,
            businessName: data.merchant_profile?.business_name || data.merchantProfile?.businessName || '',
            businessCategory: data.merchant_profile?.business_category || data.merchantProfile?.businessCategory || '',
            businessDescription: data.merchant_profile?.business_description || data.merchantProfile?.businessDescription || '',
            status: data.merchant_profile?.status || data.merchantProfile?.status || 'pending',
            approvedAt: data.merchant_profile?.approved_at || data.merchantProfile?.approvedAt,
            createdAt: data.merchant_profile?.created_at || data.merchantProfile?.createdAt,
          }
        : undefined;

      setUser({
        id: data.id ? String(data.id) : undefined,
        firstName: data.firstName || data.first_name || (data.name ? data.name.split(' ')[0] : '') || '',
        lastName: data.lastName || data.last_name || (data.name ? data.name.split(' ').slice(1).join(' ') : '') || '',
        username: data.username || data.user_name || '',
        email: data.email || '',
        phone: String(data.phone || data.phoneNumber || data.phone_number || ''),
        address: data.address || '',
        avatar: data.image || data.avatar || (data.profile_image ? data.profile_image.url : undefined) || undefined,
        role,
        merchantProfile,
        billingAddress: mapAddress(data.billing_address || data.billingAddress),
        shippingAddress: mapAddress(data.shipping_address || data.shippingAddress),
      });
    } catch (err: any) {
      console.error('[Admin Auth] Failed to fetch user:', err);
      // Remove token to ensure app isn't stuck holding a bad token
      setAuthToken(null, 'admin');
      logout();
    } finally {
      if (setLoadingState) setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await callXanoEndpoint('auth/login', 'POST', { email, password }, undefined, 'admin');

      // Handle cases where the backend returns a 200 OK with an error string or message
      const responseStr = typeof response === 'string' ? response.toLowerCase() : '';
      const responseMsg = typeof response === 'object' && response !== null && 'message' in response ? String((response as any).message).toLowerCase() : '';
      
      if (responseStr.includes('incorrect password') || responseMsg.includes('incorrect password')) {
        throw new Error('Incorrect password');
      }
      if (responseStr.includes('incorrect username') || responseMsg.includes('incorrect username') || responseStr.includes('incorrect email') || responseMsg.includes('incorrect email')) {
        throw new Error('Incorrect username or email');
      }

      const token = response.authToken || response.auth_token || response.token;
      if (!token) {
        throw new Error('No auth token received');
      }

      // Store token temporarily to fetch user data
      setAuthToken(token, 'admin');

      // Fetch user data to validate admin role
      const userResponse = await callXanoEndpoint('auth/me', 'GET', undefined, undefined, 'admin');
      const userData = userResponse?.user || userResponse;
      const backendType = userData?.type || userData?.user_type || userData?.userType || userData?.role;
      const role: UserRole = mapBackendUserTypeToRole(backendType);

      // CRITICAL: Validate admin role before completing login
      if (role !== 'admin') {
        setAuthToken(null, 'admin');
        throw new Error('Unauthorized: Admin credentials required. This portal is for administrators only.');
      }

      // Role validated, now set user
      // Pass false to prevent fetchCurrentUser from immediately setting isLoading to false
      // before login completes its own finally block
      await fetchCurrentUser(false);
    } catch (err: any) {
      console.error('[Admin Auth] Login failed:', err);
      const errorMessage = err.message || 'Login failed.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isLoading,
      error,
      login,
      logout,
      setUser,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
