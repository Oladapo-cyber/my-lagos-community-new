import React from 'react';
import { DollarSign, ArrowDownRight, ArrowUpRight, Calendar, Download, Wallet } from 'lucide-react';

export const PayoutsView = () => {
  const payoutSummary = {
    available: '₦385,000',
    pending: '₦120,000',
    totalEarned: '₦2,450,000',
    lastPayout: 'Feb 1, 2026',
  };

  const payoutHistory = [
    { id: 'PAY-001', amount: '₦250,000', date: 'Feb 1, 2026', status: 'completed', method: 'Bank Transfer' },
    { id: 'PAY-002', amount: '₦180,000', date: 'Jan 15, 2026', status: 'completed', method: 'Bank Transfer' },
    { id: 'PAY-003', amount: '₦320,000', date: 'Jan 1, 2026', status: 'completed', method: 'Bank Transfer' },
    { id: 'PAY-004', amount: '₦150,000', date: 'Dec 15, 2025', status: 'completed', method: 'Bank Transfer' },
    { id: 'PAY-005', amount: '₦120,000', date: 'Dec 1, 2025', status: 'completed', method: 'Bank Transfer' },
  ];

  return (
    <div className="space-y-6">
      {/* Payout Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{payoutSummary.available}</p>
          <p className="text-xs text-gray-500 font-bold mt-1">Available Balance</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{payoutSummary.pending}</p>
          <p className="text-xs text-gray-500 font-bold mt-1">Pending Clearance</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{payoutSummary.totalEarned}</p>
          <p className="text-xs text-gray-500 font-bold mt-1">Total Earned (All Time)</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-lg font-extrabold text-gray-900">{payoutSummary.lastPayout}</p>
          <p className="text-xs text-gray-500 font-bold mt-1">Last Payout Date</p>
        </div>
      </div>

      {/* Request Payout */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-white">
          <h3 className="text-lg font-extrabold mb-1">Ready to withdraw?</h3>
          <p className="text-sm text-blue-100 font-medium">Request a payout for your available balance to your linked bank account.</p>
        </div>
        <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-blue-50 transition-colors flex items-center gap-2 shrink-0">
          <ArrowDownRight className="w-4 h-4" />
          Request Payout
        </button>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-extrabold text-gray-900">Payout History</h2>
          <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em]">
                <th className="px-6 py-4 rounded-tl-lg">ID</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payoutHistory.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5 text-sm font-extrabold text-blue-600">{payout.id}</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-900">{payout.amount}</td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-500">{payout.date}</td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-500">{payout.method}</td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-600">
                      Completed
                    </span>
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
