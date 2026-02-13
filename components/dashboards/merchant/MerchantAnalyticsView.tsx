import React from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const MerchantAnalyticsView = () => {
  const metrics = [
    { label: 'Revenue This Month', value: '₦1.2M', change: '+18%', positive: true, icon: <DollarSign className="w-5 h-5" /> },
    { label: 'Orders This Month', value: '156', change: '+12%', positive: true, icon: <ShoppingCart className="w-5 h-5" /> },
    { label: 'Unique Customers', value: '89', change: '+5%', positive: true, icon: <Users className="w-5 h-5" /> },
    { label: 'Conversion Rate', value: '3.2%', change: '-0.3%', positive: false, icon: <TrendingUp className="w-5 h-5" /> },
  ];

  const monthlyRevenue = [
    { month: 'Sep', value: 680000 },
    { month: 'Oct', value: 820000 },
    { month: 'Nov', value: 950000 },
    { month: 'Dec', value: 1400000 },
    { month: 'Jan', value: 1100000 },
    { month: 'Feb', value: 1200000 },
  ];

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.value));

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                {metric.icon}
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-bold ${metric.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                {metric.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{metric.value}</p>
            <p className="text-xs font-medium text-gray-400 mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart (Simple Bar) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-lg font-extrabold text-gray-900 mb-6">Revenue Trend (Last 6 Months)</h2>
        <div className="flex items-end justify-between gap-3 h-48">
          {monthlyRevenue.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-gray-500">₦{(item.value / 1000).toFixed(0)}K</span>
              <div
                className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600"
                style={{ height: `${(item.value / maxRevenue) * 100}%`, minHeight: '8px' }}
              />
              <span className="text-[10px] font-bold text-gray-400">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sales by Category */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-lg font-extrabold text-gray-900 mb-6">Sales by Category</h2>
        <div className="space-y-4">
          {[
            { category: 'Fashion', percentage: 45, color: 'bg-blue-500' },
            { category: 'Arts & Culture', percentage: 28, color: 'bg-purple-500' },
            { category: 'Food & Beverage', percentage: 18, color: 'bg-orange-500' },
            { category: 'Other', percentage: 9, color: 'bg-gray-400' },
          ].map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-gray-700">{item.category}</span>
                <span className="text-sm font-bold text-gray-500">{item.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
