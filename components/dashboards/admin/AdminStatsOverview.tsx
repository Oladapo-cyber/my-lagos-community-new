import React from 'react';
import { DollarSign, Users, Store, ShoppingCart, TrendingUp, TrendingDown, ArrowUpRight, Activity, AlertTriangle, Globe } from 'lucide-react';

export const AdminStatsOverview = () => {
  const platformStats = [
    { id: 1, value: '₦18.5M', label: 'Total Revenue', color: 'bg-blue-600', icon: <DollarSign className="w-7 h-7" />, trend: '+23%' },
    { id: 2, value: '2,847', label: 'Active Users', color: 'bg-emerald-500', icon: <Users className="w-7 h-7" />, trend: '+156' },
    { id: 3, value: '124', label: 'Active Merchants', color: 'bg-orange-500', icon: <Store className="w-7 h-7" />, trend: '+12' },
    { id: 4, value: '98.7%', label: 'Platform Health', color: 'bg-purple-600', icon: <Activity className="w-7 h-7" />, trend: '+0.3%' },
  ];

  const secondaryStats = [
    { label: 'Total Orders', value: '3,421', change: '+18%', positive: true },
    { label: 'Pending Merchants', value: '15', change: '+5', positive: false },
    { label: 'Active Listings', value: '892', change: '+45', positive: true },
    { label: 'Active Events', value: '67', change: '+8', positive: true },
    { label: 'Fraud Alerts', value: '3', change: '-2', positive: true },
    { label: 'Support Tickets', value: '24', change: '+6', positive: false },
  ];

  const topMerchants = [
    { name: 'Lagos Fashion Hub', revenue: '₦2.1M', orders: 342, rating: 4.9 },
    { name: 'Eko Art Gallery', revenue: '₦1.8M', orders: 289, rating: 4.7 },
    { name: 'Naija Food Express', revenue: '₦1.5M', orders: 567, rating: 4.8 },
    { name: "Victoria's Boutique", revenue: '₦1.2M', orders: 198, rating: 4.6 },
    { name: 'Adire Collections', revenue: '₦980K', orders: 156, rating: 4.5 },
  ];

  const recentActivity = [
    { type: 'merchant', text: 'New merchant "Lekki Crafts" registered', time: '2 min ago', color: 'text-orange-600 bg-orange-50' },
    { type: 'order', text: 'Order #3421 completed - ₦45,000', time: '15 min ago', color: 'text-emerald-600 bg-emerald-50' },
    { type: 'alert', text: 'Unusual login activity detected - User #2847', time: '1 hr ago', color: 'text-red-600 bg-red-50' },
    { type: 'user', text: '12 new users registered today', time: '2 hrs ago', color: 'text-blue-600 bg-blue-50' },
    { type: 'merchant', text: 'Merchant "Eko Art Gallery" approved', time: '3 hrs ago', color: 'text-orange-600 bg-orange-50' },
  ];

  const monthlyGrowth = [
    { month: 'Sep', users: 1200, revenue: 8500000 },
    { month: 'Oct', users: 1450, revenue: 10200000 },
    { month: 'Nov', users: 1800, revenue: 12500000 },
    { month: 'Dec', users: 2200, revenue: 16800000 },
    { month: 'Jan', users: 2500, revenue: 15200000 },
    { month: 'Feb', users: 2847, revenue: 18500000 },
  ];

  const maxUsers = Math.max(...monthlyGrowth.map(m => m.users));

  return (
    <div className="space-y-8">
      {/* Primary Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {platformStats.map((stat) => (
          <div
            key={stat.id}
            className={`${stat.color} rounded-xl p-6 md:p-8 text-white flex flex-col items-center justify-center text-center shadow-lg transition-transform hover:scale-[1.02] cursor-default min-h-[160px] relative`}
          >
            <div className="w-14 h-14 rounded-full border border-white/40 flex items-center justify-center mb-4">
              {stat.icon}
            </div>
            <span className="text-3xl md:text-4xl font-extrabold mb-1 tracking-tight">{stat.value}</span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-90">{stat.label}</span>
            <span className="absolute top-4 right-4 text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">{stat.trend}</span>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {secondaryStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
            <span className={`text-[10px] font-bold mt-1 inline-flex items-center gap-0.5 ${stat.positive ? 'text-emerald-500' : 'text-red-500'}`}>
              {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">User Growth</h2>
              <p className="text-xs text-gray-500 font-medium">Last 6 months</p>
            </div>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-end gap-3 h-48">
            {monthlyGrowth.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400">{month.users.toLocaleString()}</span>
                <div
                  className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-700 cursor-default"
                  style={{ height: `${(month.users / maxUsers) * 100}%`, minHeight: '8px' }}
                />
                <span className="text-[10px] font-bold text-gray-500">{month.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  activity.type === 'alert' ? 'bg-red-500' :
                  activity.type === 'merchant' ? 'bg-orange-500' :
                  activity.type === 'order' ? 'bg-emerald-500' : 'bg-blue-500'
                }`} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-700 leading-relaxed">{activity.text}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Merchants */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-gray-900">Top Performing Merchants</h2>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest cursor-pointer hover:text-blue-700 flex items-center gap-1">
            View All <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em]">
                <th className="px-6 py-4 rounded-tl-lg">#</th>
                <th className="px-6 py-4">Merchant</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4 text-center">Orders</th>
                <th className="px-6 py-4 rounded-tr-lg text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topMerchants.map((merchant, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5">
                    <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-extrabold text-white ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-extrabold text-gray-900 text-sm">{merchant.name}</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-700">{merchant.revenue}</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-600 text-center">{merchant.orders}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-bold text-yellow-600">★ {merchant.rating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
