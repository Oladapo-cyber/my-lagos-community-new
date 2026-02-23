import React, { useState, useEffect, useMemo } from 'react';
import { Search, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { getAllOrders } from '@mlc/api-client';
import type { ShopOrder } from '@mlc/shared-types';

export const AdminOrdersView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [retryKey, setRetryKey] = useState(0);
  const itemsPerPage = 10;

  // API state
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const raw = await getAllOrders('admin');
        if (cancelled) return;
        setOrders(Array.isArray(raw) ? raw : (raw as any)?.items ?? []);
      } catch (err) {
        if (!cancelled) setFetchError('Failed to load orders. Please retry.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [retryKey]);

  // Derive doughnut chart data from real payment statuses
  const statusCounts = useMemo(() => {
    const completed = orders.filter(o => o.paymentStatus === 'completed').length;
    const pending = orders.filter(o => o.paymentStatus === 'pending').length;
    const failed = orders.filter(o => o.paymentStatus === 'failed' || o.paymentStatus === 'refunded').length;
    return { completed, pending, failed };
  }, [orders]);

  const totalRevenue = useMemo(() =>
    orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0), [orders]);

  const orderDistData = {
    labels: ['Completed', 'Pending', 'Failed/Refunded'],
    datasets: [{
      data: [statusCounts.completed || 1, statusCounts.pending || 0, statusCounts.failed || 0],
      backgroundColor: ['#10b981', '#fbbf24', '#3b82f6'],
      borderWidth: 0,
    }],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: { legend: { display: false } },
  };

  // Recent orders: last 5 by ID desc
  const recentOrders = useMemo(() =>
    [...orders].sort((a, b) => b.id - a.id).slice(0, 5), [orders]);

  const filteredOrders = useMemo(() =>
    orders.filter(o => String(o.id).includes(searchQuery) || String(o.user_id).includes(searchQuery)),
    [orders, searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusBadge = (status: string) => {
    if (status === 'completed') return 'bg-emerald-100 text-emerald-700';
    if (status === 'pending') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          <FileText size={18} />
          Export CSV
        </button>
      </div>

      {/* Stats and Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Panel */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin text-blue-600" size={24} />
            </div>
          ) : fetchError ? (
            <div className="flex flex-col items-center py-10">
              <AlertCircle className="text-red-400 mb-2" size={20} />
              <p className="text-sm text-red-500 mb-3">{fetchError}</p>
              <button onClick={() => setRetryKey(k => k + 1)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg">Retry</button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No orders yet.</p>
              ) : recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold text-blue-600">
                    #{order.id}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">User #{order.user_id}</p>
                    <p className="text-xs text-gray-500">{order.created_at ? new Date(order.created_at).toLocaleString() : '—'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusBadge(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                    <p className="text-sm font-bold text-gray-700">₦{order.totalAmount?.toLocaleString() ?? 0}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => setCurrentPage(1)}
            className="block w-full text-center mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            See All Orders ↓
          </button>
        </div>

        {/* Active Order Distribution */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Order Distribution</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="animate-spin text-blue-600" size={24} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative w-full h-48 mb-6">
                <Doughnut data={orderDistData} options={donutOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-xs text-gray-500">Total Revenue</p>
                  <p className="text-xl font-bold text-gray-900">₦{totalRevenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Completed', color: 'bg-emerald-500', textColor: 'text-emerald-600', count: statusCounts.completed },
                  { label: 'Pending', color: 'bg-amber-400', textColor: 'text-amber-600', count: statusCounts.pending },
                  { label: 'Failed / Refunded', color: 'bg-blue-500', textColor: 'text-blue-600', count: statusCounts.failed },
                ].map(({ label, color, textColor, count }) => {
                  const total = orders.length || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${color}`} />
                          <span className="text-sm text-gray-600">{label}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{count}</span>
                      </div>
                      <p className={`text-xs font-medium ml-5 ${textColor}`}>{pct}% OF TOTAL</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">All Orders</h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by Order ID or User ID"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Method</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="mx-auto mb-2 text-blue-600 animate-spin" size={28} />
                    <p className="text-sm text-gray-400">Loading orders...</p>
                  </td>
                </tr>
              ) : fetchError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <AlertCircle className="mx-auto mb-2 text-red-400" size={28} />
                    <p className="text-sm text-red-500 mb-3">{fetchError}</p>
                    <button onClick={() => setRetryKey(k => k + 1)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Retry</button>
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">No orders found.</td></tr>
              ) : paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">User #{order.user_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₦{order.totalAmount?.toLocaleString() ?? 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{order.paymentMethod ?? '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium capitalize ${statusBadge(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && !fetchError && filteredOrders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} records
            </p>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm text-gray-600 disabled:opacity-40">«</button>
              {[...Array(Math.min(totalPages, 5))].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded ${currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm text-gray-600 disabled:opacity-40">»</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
