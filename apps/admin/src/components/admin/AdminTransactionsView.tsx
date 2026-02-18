import React, { useState } from 'react';
import { Search, DollarSign, Download } from 'lucide-react';

export const AdminTransactionsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'refunded' | 'failed'>('all');

  const transactions = [
    { id: 'TXN-3421', type: 'Sale', merchant: 'Lagos Fashion Hub', customer: 'Chidi O.', amount: '₦45,000', status: 'completed', date: 'Feb 12, 2026', commission: '₦4,500' },
    { id: 'TXN-3420', type: 'Sale', merchant: 'Eko Art Gallery', customer: 'Bola A.', amount: '₦15,000', status: 'completed', date: 'Feb 12, 2026', commission: '₦1,500' },
    { id: 'TXN-3419', type: 'Refund', merchant: 'Naija Food Express', customer: 'Ngozi E.', amount: '-₦8,500', status: 'refunded', date: 'Feb 11, 2026', commission: '-₦850' },
    { id: 'TXN-3418', type: 'Sale', merchant: 'Lagos Fashion Hub', customer: 'Femi K.', amount: '₦32,000', status: 'pending', date: 'Feb 11, 2026', commission: '₦3,200' },
    { id: 'TXN-3417', type: 'Payout', merchant: 'Eko Art Gallery', customer: '-', amount: '-₦180,000', status: 'completed', date: 'Feb 10, 2026', commission: '-' },
    { id: 'TXN-3416', type: 'Sale', merchant: "Victoria's Boutique", customer: 'Adeola J.', amount: '₦22,000', status: 'failed', date: 'Feb 10, 2026', commission: '₦0' },
  ];

  const filtered = transactions.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       t.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<string, string> = {
    completed: 'bg-emerald-50 text-emerald-600',
    pending: 'bg-yellow-50 text-yellow-600',
    refunded: 'bg-blue-50 text-blue-600',
    failed: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-extrabold text-gray-900">Transactions</h2>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 bg-white outline-none"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>
          <button className="px-4 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em]">
              <th className="px-6 py-4 rounded-tl-lg">ID</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Merchant</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Commission</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 rounded-tr-lg">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-5 text-sm font-extrabold text-blue-600">{txn.id}</td>
                <td className="px-6 py-5 text-sm font-bold text-gray-700">{txn.type}</td>
                <td className="px-6 py-5 text-sm font-medium text-gray-600">{txn.merchant}</td>
                <td className="px-6 py-5 text-sm font-medium text-gray-500">{txn.customer}</td>
                <td className="px-6 py-5 text-sm font-extrabold text-gray-900">{txn.amount}</td>
                <td className="px-6 py-5 text-sm font-bold text-gray-500">{txn.commission}</td>
                <td className="px-6 py-5">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[txn.status]}`}>
                    {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-5 text-xs font-medium text-gray-400">{txn.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
