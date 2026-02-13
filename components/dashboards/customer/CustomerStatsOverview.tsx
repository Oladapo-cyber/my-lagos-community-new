import React from 'react';
import { ShoppingBag, Heart, Package, Clock, TrendingUp, Star } from 'lucide-react';

export const CustomerStatsOverview = () => {
  const STAT_CARDS = [
    { id: 1, value: '12', label: 'Total Orders', color: 'bg-blue-600', icon: <ShoppingBag className="w-7 h-7" /> },
    { id: 2, value: '8', label: 'Saved Items', color: 'bg-pink-500', icon: <Heart className="w-7 h-7" /> },
    { id: 3, value: '3', label: 'Active Orders', color: 'bg-emerald-500', icon: <Package className="w-7 h-7" /> },
    { id: 4, value: '9', label: 'Completed', color: 'bg-purple-600', icon: <Clock className="w-7 h-7" /> },
  ];

  const recentOrders = [
    { id: 1, item: 'Lagos Art Print', price: '₦15,000', status: 'Delivered', date: 'Feb 10, 2026' },
    { id: 2, item: 'Ankara Fabric Set', price: '₦32,000', status: 'In Transit', date: 'Feb 8, 2026' },
    { id: 3, item: 'Suya Special Box', price: '₦8,500', status: 'Processing', date: 'Feb 7, 2026' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {STAT_CARDS.map((card) => (
          <div
            key={card.id}
            className={`${card.color} rounded-xl p-6 md:p-8 text-white flex flex-col items-center justify-center text-center shadow-lg transition-transform hover:scale-[1.02] cursor-default min-h-[160px]`}
          >
            <div className="w-14 h-14 rounded-full border border-white/40 flex items-center justify-center mb-4">
              {card.icon}
            </div>
            <span className="text-3xl md:text-4xl font-extrabold mb-1 tracking-tight">{card.value}</span>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-90">{card.label}</span>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-gray-900">Recent Orders</h2>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest cursor-pointer hover:text-blue-700">View All</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em]">
                <th className="px-6 py-4 rounded-tl-lg">Item</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 rounded-tr-lg">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 font-extrabold text-gray-900 text-sm">{order.item}</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-600">{order.price}</td>
                  <td className="px-6 py-5">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                      order.status === 'In Transit' ? 'bg-blue-50 text-blue-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-sm mb-1">Browse Listings</h3>
          <p className="text-xs text-gray-500 font-medium">Discover businesses and services in Lagos</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center mb-3 group-hover:bg-pink-100 transition-colors">
            <Heart className="w-5 h-5 text-pink-600" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-sm mb-1">Saved Items</h3>
          <p className="text-xs text-gray-500 font-medium">View your wishlisted items and businesses</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center mb-3 group-hover:bg-yellow-100 transition-colors">
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-sm mb-1">Write a Review</h3>
          <p className="text-xs text-gray-500 font-medium">Share your experience with the community</p>
        </div>
      </div>
    </div>
  );
};
