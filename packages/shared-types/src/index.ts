import type React from 'react';

// ============================
// Role & Auth Types
// ============================

// Backend Xano user types (as stored in user table)
export type BackendUserType = 'User' | 'Admin' | 'Merchant';

// Frontend role types (used throughout the app)
export type UserRole = 'customer' | 'merchant' | 'admin';

/**
 * Map backend user type enum to frontend role
 */
export const mapBackendUserTypeToRole = (backendType: string | undefined): UserRole => {
  if (!backendType) return 'customer';
  
  switch (backendType) {
    case 'Admin':
      return 'admin';
    case 'Merchant':
      return 'merchant';
    case 'User':
    default:
      return 'customer';
  }
};

/**
 * Map frontend role to backend user type enum (for signup/updates)
 */
export const mapRoleToBackendUserType = (role: UserRole): BackendUserType => {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'merchant':
      return 'Merchant';
    case 'customer':
    default:
      return 'User';
  }
};

export type MerchantStatus = 'pending' | 'approved' | 'rejected';

export interface UserAddress {
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  address?: string;
}

export interface MerchantProfile {
  id?: string;
  businessName: string;
  businessCategory: string;
  businessDescription?: string;
  status: MerchantStatus;
  approvedAt?: string;
  createdAt?: string;
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
  role: UserRole;
  type?: BackendUserType;
  merchantProfile?: MerchantProfile;
  billingAddress?: UserAddress;
  shippingAddress?: UserAddress;
}

// ============================
// Dashboard Types
// ============================

export interface MenuItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export interface StatCard {
  id: number;
  value: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
}

// ============================
// Business / Listing Types
// ============================

export interface Listing {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  status: 'draft' | 'published' | 'pending';
  category: string;
  rating: number;
  image: string;
  merchantId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  price: string;
  category: string;
  image: string;
  ticketsSold?: number;
  status: 'draft' | 'published' | 'pending';
  merchantId?: string;
}

export interface Order {
  id: string;
  item: string;
  unitPrice: number;
  quantity: number;
  gross: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  merchantId?: string;
  customerId?: string;
  createdAt?: string;
}

export interface Review {
  id: string;
  merchantId: string;
  customerId: string;
  customerName: string;
  rating: number;
  text: string;
  createdAt: string;
}

// ============================
// Admin Analytics Types
// ============================

export interface PlatformStats {
  totalRevenue: number;
  activeUsers: number;
  activeMerchants: number;
  totalOrders: number;
  pendingMerchants: number;
  totalListings: number;
  totalEvents: number;
  platformHealth: number; // 0-100
}

export interface FraudAlert {
  id: string;
  alertType: 'suspicious_login' | 'chargeback' | 'unusual_activity' | 'account_takeover';
  userId: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  resolved: boolean;
}
