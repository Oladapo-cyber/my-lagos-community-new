import React from 'react';
import { DollarSign, Package, ShoppingCart, Star, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

export const MerchantStatsOverview = () => {
  const STAT_CARDS = [
    { id: 1, value: '₦2.4M', label: 'Total Revenue', color: 'bg-blue-600', icon: <DollarSign className="w-7 h-7" />, trend: { value: '+12%', positive: true } },
    { id: 2, value: '45', label: 'Active Products', color: 'bg-emerald-500', icon: <Package className="w-7 h-7" />, trend: { value: '+5', positive: true } },
    { id: 3, value: '28', label: 'Pending Orders', color: 'bg-orange-500', icon: <ShoppingCart className="w-7 h-7" />, trend: { value: '+8', positive: true } },
    { id: 4, value: '4.7', label: 'Store Rating', color: 'bg-purple-600', icon: <Star className="w-7 h-7" />, trend: { value: '+0.2', positive: true } },
  ];

  const recentOrders = [
    { id: 1, customer: 'Aisha M.', item: 'Ankara Fabric Set', amount: '₦32,000', status: 'Pending', date: 'Feb 12, 2026' },
    { id: 2, customer: 'David O.', item: 'Lagos Art Print', amount: '₦15,000', status: 'Shipped', date: 'Feb 11, 2026' },
    { id: 3, customer: 'Kemi A.', item: 'Suya Special Box', amount: '₦8,500', status: 'Delivered', date: 'Feb 10, 2026' },
    { id: 4, customer: 'Emeka C.', item: 'Leather Bag', amount: '₦45,000', status: 'Pending', date: 'Feb 10, 2026' },
  ];

  const topProducts = [
    { id: 1, name: 'Ankara Fabric Set', sales: 152, revenue: '₦4.8M' },
    { id: 2, name: 'Lagos Art Print', sales: 98, revenue: '₦1.5M' },
    { id: 3, name: 'Leather Bag Collection', sales: 67, revenue: '₦3.0M' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {STAT_CARDS.map((card) => (
          <div
            key={card.id}
            className={`${card.color} rounded-xl p-6 md:p-8 text-white flex flex-col items-center justify-center text-center shadow-lg transition-transform hover:scale-[1.02] cursor-default min-h-[160px] relative`}
          >
            <div className="w-14 h-14 rounded-full border border-white/40 flex items-center justify-center mb-4">
              {card.icon}
            </div>
            <span className="text-3xl md:text-4xl font-extrabold mb-1 tracking-tight">{card.value}</span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-90">{card.label}</span>
            {card.trend && (
              <div className="absolute top-4 right-4 flex items-center gap-0.5">
                {card.trend.positive ? <TrendingUp className="w-3 h-3 text-white/80" /> : <TrendingDown className="w-3 h-3 text-white/80" />}
                <span className="text-[10px] font-bold text-white/80">{card.trend.value}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-extrabold text-gray-900">Recent Orders</h2>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest cursor-pointer hover:text-blue-700 flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em]">
                  <th className="px-4 py-3 rounded-tl-lg">Customer</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-tr-lg">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm font-bold text-gray-800">{order.customer}</td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-600">{order.item}</td>
                    <td className="px-4 py-4 text-sm font-extrabold text-gray-900">{order.amount}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                        order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs font-medium text-gray-400">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-extrabold text-gray-900 mb-6">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold text-white ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.sales} sales</p>
                </div>
                <span className="text-sm font-extrabold text-gray-900">{product.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
