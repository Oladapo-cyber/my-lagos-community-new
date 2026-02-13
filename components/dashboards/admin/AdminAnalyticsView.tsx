import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Globe, BarChart3 } from 'lucide-react';

export const AdminAnalyticsView = () => {
  const conversionFunnel = [
    { stage: 'Page Visits', value: 45200, percentage: 100 },
    { stage: 'User Signups', value: 2847, percentage: 6.3 },
    { stage: 'First Purchase', value: 892, percentage: 31.3 },
    { stage: 'Repeat Purchase', value: 341, percentage: 38.2 },
  ];

  const userAcquisition = [
    { source: 'Organic Search', users: 1245, percentage: 43.7 },
    { source: 'Social Media', users: 892, percentage: 31.3 },
    { source: 'Direct', users: 456, percentage: 16.0 },
    { source: 'Referral', users: 254, percentage: 8.9 },
  ];

  const monthlyMetrics = [
    { month: 'Sep', revenue: 8.5, users: 1200 },
    { month: 'Oct', revenue: 10.2, users: 1450 },
    { month: 'Nov', revenue: 12.5, users: 1800 },
    { month: 'Dec', revenue: 16.8, users: 2200 },
    { month: 'Jan', revenue: 15.2, users: 2500 },
    { month: 'Feb', revenue: 18.5, users: 2847 },
  ];

  const maxRevenue = Math.max(...monthlyMetrics.map(m => m.revenue));

  const kpiCards = [
    { label: 'Avg. Order Value', value: '₦24,500', change: '+8%', positive: true, icon: <ShoppingCart className="w-5 h-5 text-blue-600" /> },
    { label: 'Customer Lifetime Value', value: '₦185,000', change: '+15%', positive: true, icon: <Users className="w-5 h-5 text-emerald-600" /> },
    { label: 'Monthly Active Users', value: '1,892', change: '+22%', positive: true, icon: <Globe className="w-5 h-5 text-purple-600" /> },
    { label: 'Revenue Per Merchant', value: '₦149K', change: '-3%', positive: false, icon: <DollarSign className="w-5 h-5 text-orange-600" /> },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">{kpi.icon}</div>
              <span className={`text-xs font-bold flex items-center gap-0.5 ${kpi.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                {kpi.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 font-bold mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Platform Revenue</h2>
              <p className="text-xs text-gray-500 font-medium">Monthly revenue in millions (₦)</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-end gap-3 h-48">
            {monthlyMetrics.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400">₦{m.revenue}M</span>
                <div
                  className="w-full bg-blue-600 rounded-t-lg hover:bg-blue-700 cursor-default transition-colors"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%`, minHeight: '8px' }}
                />
                <span className="text-[10px] font-bold text-gray-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-gray-900 mb-6">Conversion Funnel</h2>
          <div className="space-y-4">
            {conversionFunnel.map((stage, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-gray-700">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-gray-900">{stage.value.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-gray-400">({stage.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-emerald-500' : i === 2 ? 'bg-orange-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Acquisition Sources */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-lg font-extrabold text-gray-900 mb-6">User Acquisition Sources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {userAcquisition.map((source, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-5 text-center hover:shadow-sm transition-shadow">
              <p className="text-2xl font-extrabold text-gray-900">{source.users.toLocaleString()}</p>
              <p className="text-sm font-bold text-gray-600 mt-1">{source.source}</p>
              <p className="text-xs font-bold text-gray-400 mt-0.5">{source.percentage}% of total</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
