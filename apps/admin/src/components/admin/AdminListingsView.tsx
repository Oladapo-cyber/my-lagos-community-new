import React, { useState, useEffect } from 'react';
import { List, FolderOpen, Eye, Star, Search, Calendar, Grid3x3, List as ListIcon, MoreVertical, FileText, Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { getAllBusinesses, approveBusiness } from '@mlc/api-client';
import type { Business } from '@mlc/shared-types';

export const AdminListingsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ── Real API state ──────────────────────────────────────────────────────
  const [allListings, setAllListings] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [serverNextPage, setServerNextPage] = useState<number | null>(null);
  const [serverPrevPage, setServerPrevPage] = useState<number | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const handleApprove = async (id: number, approved: boolean) => {
    setApprovingId(id);
    try {
      await approveBusiness(id, approved, 'admin');
      setAllListings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, approved } : b)),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update listing status.');
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
          setAllListings(res.items);
          setServerNextPage(res.nextPage);
          setServerPrevPage(res.prevPage);
        }
      })
      .catch((err) => {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : 'Failed to load listings.');
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [currentPage]);

  // Derived stats from currently loaded page
  const approvedCount = allListings.filter((b) => b.approved).length;
  const pendingCount  = allListings.filter((b) => !b.approved).length;

  // Summary cards — values derived from live API data
  const summaryCards = [
    { label: 'Published Listings', value: String(approvedCount), change: '+10%', positive: true, icon: List, color: 'bg-blue-500' },
    { label: 'Total Categories', value: String(new Set(allListings.map((b) => b.category)).size), change: '', positive: true, icon: FolderOpen, color: 'bg-emerald-500' },
    { label: 'Pending Approval', value: String(pendingCount), change: '', positive: false, icon: Eye, color: 'bg-amber-500' },
    { label: 'Total on Page', value: String(allListings.length), change: '+10%', positive: true, icon: Star, color: 'bg-red-500' },
  ];

  // Chart data
  const listingTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'May, 2022 - 2026',
        data: [80, 120, 140, 110, 160, 140, 130, 170, 150, 180, 160, 190],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'May, 2021 - 100k',
        data: [60, 80, 100, 75, 110, 90, 85, 120, 100, 130, 110, 140],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      y: {
        grid: { display: true, borderDash: [2, 4], color: '#f3f4f6' },
        ticks: { font: { size: 10 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
    },
  };

  // Latest listings sidebar — first 5 from API
  const latestListings = allListings.slice(0, 5).map((b) => ({
    id: b.id,
    name: b.name,
    location: b.address,
    image: b.images?.[0] ?? '',
  }));

  // Popular listings sidebar — show approved ones first (proxy for popularity)
  const popularListings = [...allListings]
    .sort((a, b) => Number(b.approved) - Number(a.approved))
    .slice(0, 5)
    .map((b) => ({
      id: b.id,
      name: b.name,
      location: b.address,
      image: b.images?.[0] ?? '',
    }));

  // Client-side keyword filter on the server-returned page
  const filteredListings = allListings.filter((listing) =>
    listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Pagination is server-driven; client filtering is over the current page only
  const totalPages = serverNextPage !== null ? currentPage + 1 : currentPage;
  const paginatedListings = filteredListings; // server already returns the right page

  const getStatusStyle = (approved: boolean) => {
    return approved
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-amber-100 text-amber-700';
  };

  /** Format a Xano unix-ms timestamp to a readable date string */
  const formatDate = (ts: number) =>
    new Date(ts).toLocaleString('en-NG', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Listings</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <FileText size={18} />
            Export CSV
          </button>
          <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            CREATE CATEGORY
          </button>
          <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            CREATE LISTINGS
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-3 rounded-lg ${card.color} text-white`}>
                <card.icon size={20} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
            <p className={`text-xs font-medium ${card.positive ? 'text-emerald-600' : 'text-red-500'}`}>
              {card.change} from yesterday
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Latest Listings */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Latest Listings</h3>
            <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">See All</a>
          </div>
          <div className="space-y-3">
            {latestListings.map((listing) => (
              <div key={listing.id} className="pb-3 border-b border-gray-50 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{listing.name}</p>
                    <p className="text-xs text-red-500 mt-1">{listing.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Listing Trend Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Listing Trend</h3>
              <p className="text-xs text-gray-500">Total number of listings per month</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100">
                Daily
              </button>
              <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700">
                Monthly
              </button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100">
                Annually
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
          <div className="h-[240px] relative">
            <Line data={listingTrendData} options={chartOptions} />
            <div className="absolute top-16 right-32 bg-white px-2 py-1 rounded border border-gray-200 text-xs">
              May, 2022 - 2026
            </div>
            <div className="absolute top-28 right-40 bg-white px-2 py-1 rounded border border-gray-200 text-xs">
              May, 2021 - 100k
            </div>
          </div>
        </div>

        {/* Popular Listings */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Popular Listings</h3>
            <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">See All</a>
          </div>
          <div className="space-y-3">
            {popularListings.map((listing) => (
              <div key={listing.id} className="pb-3 border-b border-gray-50 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{listing.name}</p>
                    <p className="text-xs text-red-500 mt-1">{listing.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

        {/* All Listings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">All Listings</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search Event/Organizer"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Category</option>
              <option>Restaurant</option>
              <option>Hotel</option>
              <option>Bar & Restaurant</option>
              <option>Cafe</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Status</option>
              <option>Active</option>
              <option>Deactivated</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <Calendar size={16} />
              From
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Grid3x3 size={16} />
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <ListIcon size={16} />
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
              All
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Draft
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Published
            </button>
          </div>
        </div>

        {/* Table */}
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
              <button
                onClick={() => setCurrentPage((p) => p)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Retry
              </button>
            </div>
          ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Listing Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Published On</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {listing.images?.[0] ? (
                        <img src={listing.images[0]} alt={listing.name} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium text-gray-900">{listing.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">User #{listing.user_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{listing.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(listing.created_at)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline">{listing.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{listing.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(listing.approved)}`}>
                      {listing.approved ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      {!listing.approved && (
                        <button
                          onClick={() => handleApprove(listing.id, true)}
                          disabled={approvingId === listing.id}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 border border-emerald-200 rounded px-2 py-0.5 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Approve this listing"
                        >
                          {approvingId === listing.id ? 'Approving…' : 'Approve'}
                        </button>
                      )}
                      {listing.approved && (
                        <button
                          onClick={() => handleApprove(listing.id, false)}
                          disabled={approvingId === listing.id}
                          className="text-xs font-bold text-red-500 hover:text-red-600 border border-red-200 rounded px-2 py-0.5 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Revoke approval"
                        >
                          {approvingId === listing.id ? 'Revoking…' : 'Revoke'}
                        </button>
                      )}
                      <button className="hover:text-gray-600"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {currentPage} &middot; {filteredListings.length} result{filteredListings.length !== 1 ? 's' : ''} on this page
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
