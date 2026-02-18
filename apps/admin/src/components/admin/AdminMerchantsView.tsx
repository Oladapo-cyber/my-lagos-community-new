import React, { useState } from 'react';
import { Search, Store, CheckCircle, XCircle, Clock, Eye, MoreVertical } from 'lucide-react';

export const AdminMerchantsView = () => {
  const [tab, setTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const merchants = [
    { id: 1, name: 'Lagos Fashion Hub', owner: 'Adeola Johnson', category: 'Fashion', status: 'approved', revenue: '₦2.1M', products: 45, joinDate: 'Mar 15, 2025' },
    { id: 2, name: 'Eko Art Gallery', owner: 'Bola Adeyemi', category: 'Arts & Culture', status: 'approved', revenue: '₦1.8M', products: 32, joinDate: 'Apr 20, 2025' },
    { id: 3, name: 'Naija Food Express', owner: 'Femi Kolawole', category: 'Restaurant', status: 'approved', revenue: '₦1.5M', products: 28, joinDate: 'Jun 8, 2025' },
    { id: 4, name: 'Lekki Crafts', owner: 'Ngozi Eze', category: 'Services', status: 'pending', revenue: '₦0', products: 0, joinDate: 'Feb 10, 2026' },
    { id: 5, name: 'Island Beauty', owner: 'Kemi Adedayo', category: 'Health & Beauty', status: 'pending', revenue: '₦0', products: 3, joinDate: 'Feb 9, 2026' },
    { id: 6, name: 'Quick Fix Auto', owner: 'Tunde Bakare', category: 'Automotive', status: 'rejected', revenue: '₦0', products: 0, joinDate: 'Jan 25, 2026' },
  ];

  const filtered = merchants.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = tab === 'all' || m.status === tab;
    return matchSearch && matchTab;
  });

  const tabs = [
    { id: 'all', label: 'All', count: merchants.length },
    { id: 'pending', label: 'Pending', count: merchants.filter(m => m.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: merchants.filter(m => m.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: merchants.filter(m => m.status === 'rejected').length },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              tab === t.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Merchants Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Store className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-extrabold text-gray-900">Merchants</h2>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search merchants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em]">
                <th className="px-6 py-4 rounded-tl-lg">Business</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4 text-center">Products</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 rounded-tr-lg text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((merchant) => (
                <tr key={merchant.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-extrabold text-gray-900 text-sm">{merchant.name}</p>
                      <p className="text-[10px] text-gray-400">Joined {merchant.joinDate}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-600">{merchant.owner}</td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-500">{merchant.category}</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-700">{merchant.revenue}</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-600 text-center">{merchant.products}</td>
                  <td className="px-6 py-5">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 ${
                      merchant.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                      merchant.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-red-50 text-red-600'
                    }`}>
                      {merchant.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                      {merchant.status === 'pending' && <Clock className="w-3 h-3" />}
                      {merchant.status === 'rejected' && <XCircle className="w-3 h-3" />}
                      {merchant.status.charAt(0).toUpperCase() + merchant.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-1">
                      {merchant.status === 'pending' && (
                        <>
                          <button className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-500 transition-colors" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Reject">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
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
