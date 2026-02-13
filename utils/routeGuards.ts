import type { UserRole, User } from '../types';

/**
 * Route Guard utilities for role-based access control.
 * These functions determine whether a user can access specific dashboards.
 * Unauthorized access renders a 404 page (not "Access Denied") for security.
 */

export const isAuthenticated = (isLoggedIn: boolean): boolean => {
  return isLoggedIn;
};

export const hasRole = (user: User | null, requiredRole: UserRole): boolean => {
  if (!user) return false;
  return user.role === requiredRole;
};

export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

export const isMerchantApproved = (user: User | null): boolean => {
  if (!user || user.role !== 'merchant') return false;
  return user.merchantProfile?.status === 'approved';
};

export const isMerchantPending = (user: User | null): boolean => {
  if (!user || user.role !== 'merchant') return false;
  return user.merchantProfile?.status === 'pending';
};

/**
 * Determine which dashboard a user should see.
 * Returns null for unauthenticated / non-existent users (triggers 404).
 */
export type DashboardType = 'customer' | 'merchant' | 'admin';

export const getDashboardForUser = (user: User | null): DashboardType | null => {
  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return 'admin';
    case 'merchant':
      return 'merchant';
    case 'customer':
    default:
      return 'customer';
  }
};

/**
 * Check if a user is trying to access a dashboard that is NOT theirs.
 * Used to detect unauthorized access for 404 routing.
 */
export const isUnauthorizedDashboardAccess = (
  user: User | null,
  requestedDashboard: DashboardType
): boolean => {
  if (!user) return true;
  
  const allowedDashboard = getDashboardForUser(user);
  
  // Admin can access any dashboard
  if (user.role === 'admin') return false;
  
  return allowedDashboard !== requestedDashboard;
};
