import React, { useState } from 'react';
import { Search, MoreVertical, Users, Shield, Ban, CheckCircle, XCircle } from 'lucide-react';

export const AdminUsersView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'merchant' | 'admin'>('all');

  const users = [
    { id: 1, name: 'Azeez Areo', email: 'azeez@email.com', role: 'admin', status: 'active', joinDate: 'Jan 1, 2025', orders: 0 },
    { id: 2, name: 'Adeola Johnson', email: 'adeola@email.com', role: 'merchant', status: 'active', joinDate: 'Mar 15, 2025', orders: 342 },
    { id: 3, name: 'Chidi Okafor', email: 'chidi@email.com', role: 'customer', status: 'active', joinDate: 'Jun 20, 2025', orders: 12 },
    { id: 4, name: 'Bola Adeyemi', email: 'bola@email.com', role: 'customer', status: 'suspended', joinDate: 'Aug 5, 2025', orders: 3 },
    { id: 5, name: 'Femi Kolawole', email: 'femi@email.com', role: 'merchant', status: 'active', joinDate: 'Sep 12, 2025', orders: 89 },
    { id: 6, name: 'Ngozi Eze', email: 'ngozi@email.com', role: 'customer', status: 'active', joinDate: 'Nov 3, 2025', orders: 7 },
    { id: 7, name: 'Tunde Bakare', email: 'tunde@email.com', role: 'merchant', status: 'pending', joinDate: 'Feb 8, 2026', orders: 0 },
  ];

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-50 text-purple-600',
    merchant: 'bg-orange-50 text-orange-600',
    customer: 'bg-blue-50 text-blue-600',
  };

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-600',
    suspended: 'bg-red-50 text-red-600',
    pending: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-extrabold text-gray-900">All Users</h2>
          <span className="text-xs font-bold text-gray-400">({filtered.length})</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-4 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 bg-white outline-none"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="merchant">Merchants</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em]">
              <th className="px-6 py-4 rounded-tl-lg">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Orders</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 rounded-tr-lg text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-extrabold text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${roleColors[user.role]}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[user.status]}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-gray-600 text-center">{user.orders}</td>
                <td className="px-6 py-5 text-xs font-medium text-gray-400">{user.joinDate}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-1">
                    {user.status === 'active' ? (
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Suspend">
                        <Ban className="w-4 h-4" />
                      </button>
                    ) : user.status === 'suspended' ? (
                      <button className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-500 transition-colors" title="Reactivate">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    ) : null}
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
  );
};
