import type { UserRole, User } from '@mlc/shared-types';

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

export type DashboardType = 'customer' | 'merchant';

export const getDashboardForUser = (user: User | null): DashboardType | null => {
  if (!user) return null;

  switch (user.role) {
    case 'merchant':
      return 'merchant';
    case 'customer':
    default:
      return 'customer';
  }
};

export const isUnauthorizedDashboardAccess = (
  user: User | null,
  requestedDashboard: DashboardType
): boolean => {
  if (!user) return true;
  
  const allowedDashboard = getDashboardForUser(user);
  
  return allowedDashboard !== requestedDashboard;
};
