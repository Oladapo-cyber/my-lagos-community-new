import React from 'react';
import { LayoutDashboard, Users, Store, DollarSign, BarChart3, Shield, Server, UserCircle } from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../shared/DashboardLayout';
import { AdminStatsOverview } from './AdminStatsOverview';
import { AdminUsersView } from './AdminUsersView';
import { AdminMerchantsView } from './AdminMerchantsView';
import { AdminTransactionsView } from './AdminTransactionsView';
import { AdminAnalyticsView } from './AdminAnalyticsView';
import { FraudAlertsView } from './FraudAlertsView';
import { SystemLogsView } from './SystemLogsView';
import { ProfileView } from '../../dashboard/ProfileView';
import type { MenuItem } from '../../../types';

interface AdminDashboardProps {
  onReturnHome: () => void;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'users', icon: Users, label: 'Users' },
  { id: 'merchants', icon: Store, label: 'Merchants' },
  { id: 'transactions', icon: DollarSign, label: 'Transactions' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'fraud', icon: Shield, label: 'Fraud Alerts' },
  { id: 'logs', icon: Server, label: 'System Logs' },
  { id: 'profile', icon: UserCircle, label: 'Profile' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onReturnHome }) => {
  const roleBadge = (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-50 text-purple-600 border border-purple-200">
      <Shield className="w-3 h-3" />
      Super Admin
    </div>
  );

  return (
    <DashboardLayout
      menuItems={MENU_ITEMS}
      basePath="/dashboard/admin"
      onReturnHome={onReturnHome}
      roleBadge={roleBadge}
    >
      <Routes>
        <Route index element={<AdminStatsOverview />} />
        <Route path="users" element={<AdminUsersView />} />
        <Route path="merchants" element={<AdminMerchantsView />} />
        <Route path="transactions" element={<AdminTransactionsView />} />
        <Route path="analytics" element={<AdminAnalyticsView />} />
        <Route path="fraud" element={<FraudAlertsView />} />
        <Route path="logs" element={<SystemLogsView />} />
        <Route path="profile" element={<ProfileView />} />
        <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
      </Routes>
    </DashboardLayout>
  );
};
