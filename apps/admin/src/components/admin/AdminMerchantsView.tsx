import React, { useState, useEffect } from 'react';
import { Search, Store, CheckCircle, XCircle, Clock, Eye, MoreVertical, Loader2, AlertCircle } from 'lucide-react';
import { getAllBusinesses, approveBusiness } from '@mlc/api-client';
import type { Business } from '@mlc/shared-types';

export const AdminMerchantsView = () => {
  const [tab, setTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // ── Real API state ──────────────────────────────────────────────────
  const [merchants, setMerchants] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [serverNextPage, setServerNextPage] = useState<number | null>(null);
  const [serverPrevPage, setServerPrevPage] = useState<number | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const handleApprove = async (id: number, approved: boolean) => {
    setApprovingId(id);
    try {
      await approveBusiness(id, approved, 'admin');
      setMerchants((prev) =>
        prev.map((m) => (m.id === id ? { ...m, approved } : m)),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update merchant status.');
    } finally {
      setApprovingId(null);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setFetchError(null);

    getAllBusinesses({ page: currentPage, per_page: itemsPerPage }, 'admin')
      .then((res) => {
        if (!cancelled) {
          setMerchants(res.items);
          setServerNextPage(res.nextPage);
          setServerPrevPage(res.prevPage);
        }
      })
      .catch((err) => {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : 'Failed to load merchants.');
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [currentPage]);

  // Map Business.approved → status string for tab filtering
  const getStatus = (m: Business) => m.approved ? 'approved' : 'pending';

  const filtered = merchants.filter((m) => {
    const status = getStatus(m);
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = tab === 'all' || status === tab;
    return matchSearch && matchTab;
  });

  const approvedCount = merchants.filter((m) => m.approved).length;
  const pendingCount = merchants.filter((m) => !m.approved).length;

  const tabs = [
    { id: 'all', label: 'All', count: merchants.length },
    { id: 'pending', label: 'Pending', count: pendingCount },
    { id: 'approved', label: 'Approved', count: approvedCount },
    { id: 'rejected', label: 'Rejected', count: 0 },
  ];

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' });

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
            <span className="text-xs font-bold text-gray-400">({filtered.length})</span>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <span className="ml-2 text-sm font-medium text-gray-500">Loading…</span>
            </div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <p className="text-sm font-medium text-gray-500">{fetchError}</p>
              <button onClick={() => setCurrentPage((p) => p)} className="text-xs font-bold text-blue-600 hover:underline">Retry</button>
            </div>
          ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em]">
                <th className="px-6 py-4 rounded-tl-lg">Business</th>
                <th className="px-6 py-4">Owner ID</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 rounded-tr-lg text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((merchant) => {
                const status = getStatus(merchant);
                return (
                  <tr key={merchant.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {merchant.images?.[0] ? (
                          <img src={merchant.images[0]} alt={merchant.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-extrabold text-gray-900 text-sm">{merchant.name}</p>
                          <p className="text-[10px] text-gray-400">Joined {formatDate(merchant.created_at)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-600">User #{merchant.user_id}</td>
                    <td className="px-6 py-5 text-xs font-bold text-gray-500">{merchant.category}</td>
                    <td className="px-6 py-5 text-sm text-blue-600 underline">{merchant.email}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{merchant.phoneNumber}</td>
                    <td className="px-6 py-5 text-sm text-gray-500">{formatDate(merchant.created_at)}</td>
                    <td className="px-6 py-5">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 ${
                        status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-yellow-50 text-yellow-600'
                      }`}>
                        {status === 'approved' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-1">
                        {!merchant.approved && (
                          <button
                            onClick={() => handleApprove(merchant.id, true)}
                            disabled={approvingId === merchant.id}
                            className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-500 transition-colors disabled:opacity-50"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {merchant.approved && (
                          <button
                            onClick={() => handleApprove(merchant.id, false)}
                            disabled={approvingId === merchant.id}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Revoke"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {currentPage} &middot; {filtered.length} result{filtered.length !== 1 ? 's' : ''} on this page
          </p>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={serverPrevPage === null}
              className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded disabled:opacity-40 hover:bg-gray-200"
            >
              &laquo;
            </button>
            <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">{currentPage}</span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={serverNextPage === null}
              className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded disabled:opacity-40 hover:bg-gray-200"
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
