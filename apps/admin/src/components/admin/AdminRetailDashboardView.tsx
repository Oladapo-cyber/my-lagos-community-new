import React from 'react';
import { Package, TrendingDown, TrendingUp, Calendar, FileText } from 'lucide-react';
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
  // Summary cards
  const summaryCards = [
    { label: 'TOTAL ORDERS', value: '4567', change: '+6% From Last 24 hours', positive: true },
    { label: 'COMPLETED ORDERS', value: '₦10000', change: '2% Decreased from last day', positive: false },
    { label: 'PENDING ORDERS', value: '3050', change: '+4% From Last 24 hours', positive: true },
    { label: 'TOTAL PRODUCTS', value: '₦504M', change: '+3% Decreased from last week', positive: true },
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

  // Top selling products
  const topProducts = [
    { id: 1, name: 'Google Fitness Band', price: '₦10,000.00', rating: 4.5, orders: 265, repeat: 456, available: true },
    { id: 2, name: 'Google Fitness Band', price: '₦10,000.00', rating: 6.5, orders: 752, repeat: 122, available: false },
    { id: 3, name: 'Google Fitness Band', price: '₦10,000.00', rating: 6.5, orders: 546, repeat: 630, available: true },
    { id: 4, name: 'Google Fitness Band', price: '₦10,000.00', rating: 6.5, orders: 900, repeat: 145, available: true },
    { id: 5, name: 'Google Fitness Band', price: '₦10,000.00', rating: 6.5, orders: 843, repeat: 345, available: false },
    { id: 6, name: 'Google Fitness Band', price: '₦10,000.00', rating: 6.5, orders: 752, repeat: 300, available: true },
    { id: 7, name: 'Google Fitness Band', price: '₦10,000.00', rating: 6.5, orders: 752, repeat: 290, available: true },
  ];

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <Package className="text-blue-600" size={40} />
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{card.label}</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{card.value}</h3>
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
            <h3 className="text-lg font-bold text-gray-800">Top Selling Products</h3>
            <p className="text-xs text-gray-500">Total number of engaged users per month</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Product Name</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Ratings</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Total Orders</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Repeat Orders</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{product.price}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{product.rating}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{product.orders}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{product.repeat}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${product.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {product.available ? 'In Stock' : 'Out of Stock'}
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
