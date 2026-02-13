import React from 'react';
import { LayoutDashboard, ShoppingBag, Heart, MessageSquare, UserCircle } from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../shared/DashboardLayout';
import { CustomerStatsOverview } from './CustomerStatsOverview';
import { SavedItemsView } from './SavedItemsView';
import { SupportTicketsView } from './SupportTicketsView';
import { OrdersView } from '../../dashboard/OrdersView';
import { ProfileView } from '../../dashboard/ProfileView';
import type { MenuItem } from '../../../types';

interface CustomerDashboardProps {
  onReturnHome: () => void;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'orders', icon: ShoppingBag, label: 'My Orders' },
  { id: 'saved', icon: Heart, label: 'Saved Items' },
  { id: 'support', icon: MessageSquare, label: 'Support Tickets' },
  { id: 'profile', icon: UserCircle, label: 'Profile' },
];

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onReturnHome }) => {
  const roleBadge = (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-200">
      <ShoppingBag className="w-3 h-3" />
      Customer
    </div>
  );

  return (
    <DashboardLayout
      menuItems={MENU_ITEMS}
      basePath="/dashboard/customer"
      onReturnHome={onReturnHome}
      roleBadge={roleBadge}
    >
      <Routes>
        <Route index element={<CustomerStatsOverview />} />
        <Route path="orders" element={<OrdersView />} />
        <Route path="saved" element={<SavedItemsView />} />
        <Route path="support" element={<SupportTicketsView />} />
        <Route path="profile" element={<ProfileView />} />
        <Route path="*" element={<Navigate to="/dashboard/customer" replace />} />
      </Routes>
    </DashboardLayout>
  );
};
