import React from 'react';
import { DashboardLayout as SharedDashboardLayout } from '@mlc/ui-components';
import type { DashboardLayoutProps } from '@mlc/ui-components';
import { useAdminAuth } from '../../context/AdminAuthContext';

type AdminDashboardLayoutProps = Omit<DashboardLayoutProps, 'user'>;

export const DashboardLayout: React.FC<AdminDashboardLayoutProps> = (props) => {
  const { user } = useAdminAuth();

  return (
    <SharedDashboardLayout
      {...props}
      user={user ? {
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      } : undefined}
    />
  );
};
