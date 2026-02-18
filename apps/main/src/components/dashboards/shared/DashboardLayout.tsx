// Re-export DashboardLayout from shared packages, wired to main app's auth
import React from 'react';
import { DashboardLayout as SharedDashboardLayout } from '@mlc/ui-components';
import type { DashboardLayoutProps as SharedProps } from '@mlc/ui-components';
import { useAuth } from '../../../context/AuthContext';

type DashboardLayoutProps = Omit<SharedProps, 'user'>;

export const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  const { user } = useAuth();
  return <SharedDashboardLayout {...props} user={user} />;
};
