import React, { useState, useEffect } from 'react';
import { Calendar, Users, FolderOpen, Star, Search, Calendar as CalendarIcon, Grid3x3, List as ListIcon, Plus, MoreVertical, Loader2, AlertCircle } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { getAllEvents, approveEvent } from '@mlc/api-client';
import { useToast } from '@mlc/ui-components';
import type { XanoEvent } from '@mlc/shared-types';

export const AdminEventsView = () => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ── Real API state ──────────────────────────────────────────────────
  const [allEvents, setAllEvents] = useState<XanoEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [serverNextPage, setServerNextPage] = useState<number | null>(null);
  const [serverPrevPage, setServerPrevPage] = useState<number | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const handleApprove = async (event: XanoEvent, approved: boolean) => {
    setApprovingId(event.id);
    try {
      await approveEvent(event, approved, 'admin');
      setAllEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, approved } : e)),
      );
      toast.success(approved ? 'Event approved' : 'Event revoked', approved ? 'The event is now live.' : 'The event has been unpublished.');
    } catch (err) {
      toast.error('Failed to update event', err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setApprovingId(null);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setFetchError(null);

    getAllEvents({ page: currentPage, per_page: itemsPerPage }, 'admin')
      .then((res) => {
        if (!cancelled) {
          setAllEvents(res.items);
          setServerNextPage(res.nextPage);
          setServerPrevPage(res.prevPage);
        }
      })
      .catch((err) => {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : 'Failed to load events.');
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [currentPage]);

  // Derived stats from loaded data
  const approvedCount = allEvents.filter((e) => e.approved).length;
  const categories = new Set(allEvents.map((e) => e.category)).size;

  // Summary cards — values derived from live API data
  const summaryCards = [
    { label: 'Published Events', value: String(approvedCount), change: '+10%', positive: true, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Total Categories', value: String(categories), change: '+10%', positive: true, icon: FolderOpen, color: 'bg-emerald-500' },
    { label: 'Total on Page', value: String(allEvents.length), change: '+10%', positive: true, icon: Users, color: 'bg-amber-500' },
    { label: 'Pending Approval', value: String(allEvents.filter((e) => !e.approved).length), change: '', positive: false, icon: Star, color: 'bg-red-500' },
  ];

  // Chart data (static trend — no time-series endpoint available)
  const ticketSalesData = {
    labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'This Week - 120k',
        data: [80, 120, 90, 140, 110, 150, 130, 180, 160],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Last Week - 9k',
        data: [60, 80, 70, 90, 75, 100, 85, 120, 110],
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

  // Upcoming events sidebar — first 4 from live data
  const upcomingEvents = allEvents.slice(0, 4).map((e) => ({
    id: e.id,
    name: e.name,
    location: e.address,
  }));

  // Client-side search filter on current page
  const filteredEvents = allEvents.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700';
      case 'Concluded':
        return 'bg-gray-100 text-gray-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleString('en-NG', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            CREATE CATEGORY
          </button>
          <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            CREATE EVENT
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
              {card.change} {card.change ? 'from yesterday' : ''}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Net Ticket Sales Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Net Ticket Sales</h3>
              <p className="text-xs text-gray-500">Total number of tickets per month</p>
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
            </div>
          </div>
          <div className="h-[240px] relative">
            <Line data={ticketSalesData} options={chartOptions} />
          </div>
        </div>

        {/* Latest Events sidebar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Recent Events</h3>
            <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">See All</a>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex items-center gap-2 py-4 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : allEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    {event.image?.[0] && (
                      <img
                        src={event.image[0]}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 truncate max-w-[140px]">{event.name.replace(/\n/g, ' ')}</p>
                    <p className="text-xs text-gray-500">{event.category}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusStyle(event.status)}`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Upcoming Event</h3>
            <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">See All</a>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="pb-3 border-b border-gray-50 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{event.name.replace(/\n/g, ' ')}</p>
                    <p className="text-xs text-red-500 mt-1 truncate">{event.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Events Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">All Events</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search Event / Category"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Category</option>
              <option>Social Networking</option>
              <option>Festival</option>
              <option>Concert</option>
              <option>Conference</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Status</option>
              <option>Active</option>
              <option>Concluded</option>
              <option>Cancelled</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <CalendarIcon size={16} />
              From
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Organizer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Approval</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
                          {event.image?.[0] && (
                            <img
                              src={event.image[0]}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900 max-w-[200px] truncate">{event.name.replace(/\n/g, ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">User #{event.user_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(event.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${event.approved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {event.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        {!event.approved && (
                          <button
                            onClick={() => handleApprove(event, true)}
                            disabled={approvingId === event.id}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 border border-emerald-200 rounded px-2 py-0.5 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {approvingId === event.id ? 'Approving…' : 'Approve'}
                          </button>
                        )}
                        {event.approved && (
                          <button
                            onClick={() => handleApprove(event, false)}
                            disabled={approvingId === event.id}
                            className="text-xs font-bold text-red-500 hover:text-red-600 border border-red-200 rounded px-2 py-0.5 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {approvingId === event.id ? 'Revoking…' : 'Revoke'}
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
            Page {currentPage} &middot; {filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''} on this page
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
