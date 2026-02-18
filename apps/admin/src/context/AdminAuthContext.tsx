import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserRole, MerchantProfile, UserAddress } from '@mlc/shared-types';
import { mapBackendUserTypeToRole } from '@mlc/shared-types';
import { callXanoEndpoint, setAuthToken, getAuthToken } from '@mlc/api-client';

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

  useEffect(() => {
    const token = getAuthToken('admin');
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
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
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await callXanoEndpoint('auth/login', 'POST', { email, password }, undefined, 'admin');

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
      await fetchCurrentUser();
    } catch (err: any) {
      console.error('[Admin Auth] Login failed:', err);
      const errorMessage = err.message || 'Login failed.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null, 'admin');
    setUser(null);
    setError(null);
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
