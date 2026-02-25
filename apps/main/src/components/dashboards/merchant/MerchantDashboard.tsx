import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Star, 
  Wallet, 
  UserCircle, 
  Calendar,
  Store,
  AlertTriangle
} from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../shared/DashboardLayout';
import { MerchantStatsOverview } from './MerchantStatsOverview';
import { ProductsView } from './ProductsView';
import { MerchantAnalyticsView } from './MerchantAnalyticsView';
import { ReviewsView } from './ReviewsView';
import { PayoutsView } from './PayoutsView';
import { OrdersView } from '../../dashboard/OrdersView';
import { EventsView } from '../../dashboard/EventsView';
import { ProfileView } from '../../dashboard/ProfileView';
import { useAuth } from '../../../context/AuthContext';
import type { MenuItem } from '../../../types';

interface MerchantDashboardProps {
  onReturnHome: () => void;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'products', icon: Package, label: 'Products' },
  { id: 'events', icon: Calendar, label: 'Manage Events' },
  { id: 'orders', icon: ShoppingCart, label: 'Orders' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'reviews', icon: Star, label: 'Reviews' },
  { id: 'payouts', icon: Wallet, label: 'Payouts' },
  { id: 'profile', icon: UserCircle, label: 'Profile' },
];

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ onReturnHome }) => {
  const { user } = useAuth();

  const isPending = user?.merchantProfile?.status === 'pending';
  const isRejected = user?.merchantProfile?.status === 'rejected';

  const roleBadge = (
    <div className="space-y-2">
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-50 text-orange-600 border border-orange-200">
        <Store className="w-3 h-3" />
        Merchant
      </div>
      {user?.merchantProfile?.businessName && (
        <p className="text-xs font-bold text-gray-600 truncate">{user.merchantProfile.businessName}</p>
      )}
    </div>
  );

  return (
    <DashboardLayout
      menuItems={MENU_ITEMS}
      basePath="/dashboard/merchant"
      onReturnHome={onReturnHome}
      roleBadge={roleBadge}
    >
      {/* Pending Merchant Banner */}
      {isPending && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-extrabold text-yellow-800">Account Under Review</p>
            <p className="text-xs text-yellow-700 font-medium mt-0.5">
              Your merchant account is being reviewed by our team. You can add products and set up your store, 
              but they won't be visible to customers until your account is approved.
            </p>
          </div>
        </div>
      )}

      {/* Rejected Merchant Banner */}
      {isRejected && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-extrabold text-red-800">Application Rejected</p>
            <p className="text-xs text-red-700 font-medium mt-0.5">
              Unfortunately, your merchant application was not approved. Please contact support for more information.
            </p>
          </div>
        </div>
      )}

      <Routes>
        <Route index element={<MerchantStatsOverview />} />
        <Route path="products" element={<ProductsView />} />
        <Route path="events" element={<EventsView />} />
        <Route path="orders" element={<OrdersView />} />
        <Route path="analytics" element={<MerchantAnalyticsView />} />
        <Route path="reviews" element={<ReviewsView />} />
        <Route path="payouts" element={<PayoutsView />} />
        <Route path="profile" element={<ProfileView />} />
        <Route path="*" element={<Navigate to="/dashboard/merchant" replace />} />
      </Routes>
    </DashboardLayout>
  );
};
