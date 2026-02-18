import React, { useState } from 'react';
import { List, FolderOpen, Eye, Star, Search, Calendar, Grid3x3, List as ListIcon, MoreVertical, FileText } from 'lucide-react';
import { Line } from 'react-chartjs-2';

export const AdminListingsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Summary cards data
  const summaryCards = [
    { label: 'Published Listings', value: '10000', change: '+10%', positive: true, icon: List, color: 'bg-blue-500' },
    { label: 'Total Categories', value: '10000', change: '+10%', positive: true, icon: FolderOpen, color: 'bg-emerald-500' },
    { label: 'Total Views', value: '10000', change: '+10%', positive: true, icon: Eye, color: 'bg-amber-500' },
    { label: 'Total Reviews', value: '10000', change: '+10%', positive: true, icon: Star, color: 'bg-red-500' },
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

  // Latest listings
  const latestListings = [
    { id: 1, name: 'Listing Name', location: 'EH Suites Address, Location, Lagos', image: '' },
    { id: 2, name: 'Listing Name', location: 'EH Suites Address, Location, Lagos', image: '' },
    { id: 3, name: 'Listing Name', location: 'EH Suites Address, Location, Lagos', image: '' },
    { id: 4, name: 'Listing Name', location: 'EH Suites Address, Location, Lagos', image: '' },
    { id: 5, name: 'Listing Name', location: 'EH Suites Address, Location, Lagos', image: '' },
  ];

  // Popular listings
  const popularListings = [
    { id: 1, name: 'Listing Name', location: 'EH Suites Address, Location, Lagos', image: '' },
    { id: 2, name: 'Listing Name', location: 'EH Suites Address, Location, Lagos', image: '' },
    { id: 3, name: 'Listing Name', location: 'EH Suites Address, Location, Lagos', image: '' },
    { id: 4, name: 'Listing Name', location: 'EH Suites Address, Location, Lagos', image: '' },
    { id: 5, name: 'Listing Name', location: 'EH Suites Address, Location, Lagos', image: '' },
  ];

  // All listings table data
  const allListings = [
    {
      id: 1,
      name: 'Luxury Restaurant',
      owner: 'My Lagos Community',
      category: 'Restaurant',
      publishedOn: 'Oct 15, 2022 10:00am',
      email: 'sampleemail@gmail.com',
      phone: '+234(0)1 2345 678',
      status: 'Deactivated',
    },
    {
      id: 2,
      name: "Oshey's Cafe & Bar",
      owner: 'Desmond Oslade',
      category: 'Bar & Restaurant',
      publishedOn: 'Oct 15, 2022 10:00am',
      email: 'sampleemail@gmail.com',
      phone: '+234(0)1 2345 678',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Hotel Shovorider',
      owner: 'Desmond Oslade',
      category: 'Hotel',
      publishedOn: 'Oct 15, 2022 10:00am',
      email: 'sampleemail@gmail.com',
      phone: '+234(0)1 2345 678',
      status: 'Deactivated',
    },
    {
      id: 4,
      name: 'Favorite Place Food Bank',
      owner: 'John Michael',
      category: 'Restaurant',
      publishedOn: 'Oct 15, 2022 10:00am',
      email: 'sampleemail@gmail.com',
      phone: '+234(0)1 2345 678',
      status: 'Active',
    },
    {
      id: 5,
      name: 'Beach Blue Beachbulk',
      owner: 'Imani Johnson',
      category: 'Restaurant',
      publishedOn: 'Oct 15, 2022 10:00am',
      email: 'sampleemail@gmail.com',
      phone: '+234(0)1 2345 678',
      status: 'Active',
    },
    {
      id: 6,
      name: 'Lagos Community Meet & Greet',
      owner: 'Imani Johnson',
      category: 'Nightlife',
      publishedOn: 'Oct 15, 2022 10:00am',
      email: 'sampleemail@gmail.com',
      phone: '+234(0)1 2345 678',
      status: 'Deactivated',
    },
    {
      id: 7,
      name: 'Favorite Place Food Bank',
      owner: 'Thomas Williams',
      category: 'Bar & Restaurant',
      publishedOn: 'Oct 15, 2022 10:00am',
      email: 'sampleemail@gmail.com',
      phone: '+234(0)1 2345 678',
      status: 'Deactivated',
    },
    {
      id: 8,
      name: "Oshey's Cafe & Bar",
      owner: 'Imani Johnson',
      category: 'Cafe',
      publishedOn: 'Oct 15, 2022 10:00am',
      email: 'sampleemail@gmail.com',
      phone: '+234(0)1 2345 678',
      status: 'Active',
    },
    {
      id: 9,
      name: 'Lagos Community Meet & Greet',
      owner: 'Desmond Luolu',
      category: 'Bar & Restaurant',
      publishedOn: 'Oct 15, 2022 10:00am',
      email: 'sampleemail@gmail.com',
      phone: '+234(0)1 2345 678',
      status: 'Active',
    },
    {
      id: 10,
      name: "Nka's Art Gallery",
      owner: 'Michael John',
      category: 'Art & Culture',
      publishedOn: 'Oct 15, 2022 10:00am',
      email: 'sampleemail@gmail.com',
      phone: '+234(0)1 2345 678',
      status: 'Active',
    },
  ];

  const filteredListings = allListings.filter(listing =>
    listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700';
      case 'Deactivated':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

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
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Listing Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner name</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{listing.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{listing.owner}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{listing.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{listing.publishedOn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline">{listing.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{listing.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(listing.status)}`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <button className="hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredListings.length)} of {filteredListings.length} Results
          </p>
          <div className="flex gap-2">
            {[...Array(totalPages > 5 ? 5 : totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-8 h-8 rounded ${
                  currentPage === idx + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">»</button>
          </div>
        </div>
      </div>
    </div>
  );
};
