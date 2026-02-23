import React, { useEffect, useState } from 'react';
import { Package, TrendingDown, TrendingUp, Calendar, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { getAllProducts, getAllOrders } from '@mlc/api-client';
import type { Product, ShopOrder } from '@mlc/shared-types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AdminRetailDashboardView = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const [rawProducts, rawOrders] = await Promise.all([
          getAllProducts('admin'),
          getAllOrders('admin'),
        ]);
        if (cancelled) return;
        setProducts(Array.isArray(rawProducts) ? rawProducts : (rawProducts as any)?.items ?? []);
        setOrders(Array.isArray(rawOrders) ? rawOrders : (rawOrders as any)?.items ?? []);
      } catch (err) {
        if (!cancelled) setFetchError('Failed to load shop data. Please retry.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [retryKey]);

  // Derived KPIs
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.paymentStatus === 'completed').length;
  const pendingOrders = orders.filter(o => o.paymentStatus === 'pending').length;
  const totalProducts = products.length;
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'completed')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const summaryCards = [
    { label: 'TOTAL ORDERS', value: String(totalOrders), change: 'All time orders placed', positive: true },
    {
      label: 'TOTAL REVENUE',
      value: `₦${totalRevenue.toLocaleString()}`,
      change: 'From completed orders',
      positive: true,
    },
    { label: 'PENDING ORDERS', value: String(pendingOrders), change: 'Awaiting payment', positive: pendingOrders === 0 },
    { label: 'TOTAL PRODUCTS', value: String(totalProducts), change: 'Products in catalogue', positive: true },
  ];

  // Revenue chart
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'May, 2022 - 2026',
        data: [120, 150, 100, 180, 140, 160, 110, 200, 170, 150, 120, 180],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'May, 2021 - 100k',
        data: [80, 100, 70, 120, 90, 110, 75, 140, 110, 100, 80, 120],
        borderColor: '#9ca3af',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
      },
    ],
  };

  // Sales chart
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'May, 2022 - 2026',
        data: [120, 150, 130, 200, 160, 180, 140, 220, 190, 160, 140, 210],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'May, 2021 - 100k',
        data: [80, 110, 90, 140, 110, 130, 100, 160, 130, 110, 90, 150],
        borderColor: '#9ca3af',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
      },
    ],
  };

  // Order trend bar chart
  const orderTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Orders',
        data: [150, 180, 120, 200, 220, 250, 180, 230, 260, 220, 240, 180],
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      y: {
        grid: { display: true, borderDash: [2, 4], color: '#f3f4f6' },
        ticks: { font: { size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
    },
  };

  // Top selling products — sorted by price desc as a proxy (no orders-per-product data from API)
  const topProducts = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 7);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Retail Dashboard</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
            <Calendar size={16} />
            From: dd/mm/yy
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
            <Calendar size={16} />
            To: dd/mm/yy
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
            <FileText size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex items-center gap-4">
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <p className="text-sm font-medium text-red-700">{fetchError}</p>
          <button
            onClick={() => setRetryKey(k => k + 1)}
            className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              {isLoading ? (
                <Loader2 className="text-blue-600 animate-spin" size={40} />
              ) : (
                <Package className="text-blue-600" size={40} />
              )}
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{card.label}</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {isLoading ? <span className="animate-pulse bg-gray-200 rounded h-8 w-20 inline-block" /> : card.value}
            </h3>
            <p className={`text-xs font-medium ${card.positive ? 'text-emerald-600' : 'text-red-500'}`}>
              {card.positive ? '↗' : '↘'} {card.change}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Revenue</h3>
              <p className="text-xs text-gray-500">Revenue sale per month</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold text-emerald-600">₦54,290</span>
                <span className="text-xs text-emerald-600 font-medium">+8.3% since last month</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded">Daily</button>
              <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded">Monthly</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded">Annually</button>
            </div>
          </div>
          <div className="h-[240px]">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>

        {/* Sales */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Sales</h3>
              <p className="text-xs text-gray-500">Total number of sales per month</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold text-red-600">₦294,290.54</span>
                <span className="text-xs text-red-600 font-medium">-5.5% since last month</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded">Daily</button>
              <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded">Monthly</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded">Annually</button>
            </div>
          </div>
          <div className="h-[240px]">
            <Line data={salesData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Order Trend</h3>
              <p className="text-xs text-gray-500">Total number of engaged users per month</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold text-emerald-600">₦54,290</span>
                <span className="text-xs text-emerald-600 font-medium">+8.3% since last month</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded">Daily</button>
              <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded">Monthly</button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded">Annually</button>
            </div>
          </div>
          <div className="h-[280px]">
            <Bar data={orderTrendData} options={chartOptions} />
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Top Products</h3>
            <p className="text-xs text-gray-500">Sorted by price (highest)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center">
                      <Loader2 className="mx-auto text-blue-600 animate-spin" size={24} />
                    </td>
                  </tr>
                ) : topProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-sm text-gray-400">No products found.</td>
                  </tr>
                ) : topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{product.category || '—'}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">₦{product.price.toLocaleString()}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{product.quantity}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${product.quantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
