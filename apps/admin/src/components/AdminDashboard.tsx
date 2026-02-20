import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminStatsOverview } from './admin/AdminStatsOverview';
import { AdminMerchantsView } from './admin/AdminMerchantsView';
import { AdminEventsView } from './admin/AdminEventsView';
import { AdminListingsView } from './admin/AdminListingsView';
// -- No live endpoint yet — commented out until APIs are ready --
// import { AdminUsersView } from './admin/AdminUsersView';
// import { AdminTransactionsView } from './admin/AdminTransactionsView';
// import { SystemLogsView } from './admin/SystemLogsView';
// import { ProfileView } from './admin/ProfileView';
// import { AdminFinancialsView } from './admin/AdminFinancialsView';
// import { AdminRetailDashboardView } from './admin/AdminRetailDashboardView';
// import { AdminProductsView } from './admin/AdminProductsView';
// import { AdminOrdersView } from './admin/AdminOrdersView';
// import { AdminCustomersView } from './admin/AdminCustomersView';
// import { AdminReviewsView } from './admin/AdminReviewsView';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 md:p-8">
      <Routes>
        <Route index element={<AdminStatsOverview />} />
        
        {/* MAIN Routes — live data ✅ */}
        <Route path="events" element={<AdminEventsView />} />
        <Route path="listings" element={<AdminListingsView />} />

        {/* ADMIN Routes — live data ✅ */}
        <Route path="merchants" element={<AdminMerchantsView />} />

        {/* -- No live endpoint yet — commented out until APIs are ready -- */}
        {/* <Route path="financials" element={<AdminFinancialsView />} /> */}
        {/* <Route path="shop" element={<AdminRetailDashboardView />} /> */}
        {/* <Route path="shop/products" element={<AdminProductsView />} /> */}
        {/* <Route path="shop/orders" element={<AdminOrdersView />} /> */}
        {/* <Route path="shop/customers" element={<AdminCustomersView />} /> */}
        {/* <Route path="shop/reviews" element={<AdminReviewsView />} /> */}
        {/* <Route path="users" element={<AdminUsersView />} /> */}
        {/* <Route path="logs" element={<SystemLogsView />} /> */}
        {/* <Route path="profile" element={<ProfileView />} /> */}
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
};
