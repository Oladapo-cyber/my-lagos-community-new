import React, { useState } from 'react';
import { Calendar, Users, FolderOpen, Star, Search, Calendar as CalendarIcon, Grid3x3, List as ListIcon, Plus, MoreVertical } from 'lucide-react';
import { Line } from 'react-chartjs-2';

export const AdminEventsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Summary cards data
  const summaryCards = [
    { label: 'Published Events', value: '10000', change: '+10%', positive: true, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Total Categories', value: '10000', change: '+10%', positive: true, icon: FolderOpen, color: 'bg-emerald-500' },
    { label: 'Total Registrations', value: '10000', change: '+10%', positive: true, icon: Users, color: 'bg-amber-500' },
    { label: 'Total Reviews', value: '10000', change: '+10%', positive: true, icon: Star, color: 'bg-red-500' },
  ];

  // Chart data
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

  // Recent sells data
  const recentSells = [
    { id: 1, buyer: "Buyer's Name", event: "Event Name", amount: 420, currency: '₦50,000.00' },
    { id: 2, buyer: "Buyer's Name", event: "Event Name", amount: 420, currency: '₦50,000.00' },
    { id: 3, buyer: "Buyer's Name", event: "Event Name", amount: 420, currency: '₦50,000.00' },
    { id: 4, buyer: "Buyer's Name", event: "Event Name", amount: 420, currency: '₦50,000.00' },
    { id: 5, buyer: "Buyer's Name", event: "Event Name", amount: 420, currency: '₦50,000.00' },
  ];

  // Upcoming events
  const upcomingEvents = [
    { id: 1, name: 'Event Name', location: 'EH Suites Address, Location, Lagos', image: '' },
    { id: 2, name: 'Event Name', location: 'EH Suites Address, Location, Lagos', image: '' },
    { id: 3, name: 'Event Name', location: 'EH Suites Address, Location, Lagos', image: '' },
    { id: 4, name: 'Event Name', location: 'EH Suites Address, Location, Lagos', image: '' },
  ];

  // Events table data
  const allEvents = [
    {
      id: 1,
      name: 'Lagos Community Meet & Greet',
      organizer: 'My Lagos Community',
      category: 'Social Networking',
      publishedOn: 'Oct 15, 2022 10:00am',
      registration: 10000,
      regType: 'Paid',
      goals: '100,000',
      status: 'Concluded',
    },
    {
      id: 2,
      name: 'Lagos Community Meet & Greet',
      organizer: 'My Lagos Community',
      category: 'Festival',
      publishedOn: 'Oct 15, 2022 10:00am',
      registration: 10000,
      regType: 'Free',
      goals: '100,000',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Lagos Community Meet & Greet',
      organizer: 'My Lagos Community',
      category: 'Seminar',
      publishedOn: 'Oct 15, 2022 10:00am',
      registration: 10000,
      regType: 'Free',
      goals: '50,000',
      status: 'Concluded',
    },
    {
      id: 4,
      name: 'Lagos Community Meet & Greet',
      organizer: 'My Lagos Community',
      category: 'Social Networking',
      publishedOn: 'Oct 15, 2022 10:00am',
      registration: 10000,
      regType: 'Paid',
      goals: '100,000',
      status: 'Active',
    },
    {
      id: 5,
      name: 'Lagos Community Meet & Greet',
      organizer: 'My Lagos Community',
      category: 'Social Networking',
      publishedOn: 'Oct 15, 2022 10:00am',
      registration: 10000,
      regType: 'Paid',
      goals: '100,000',
      status: 'Active',
    },
    {
      id: 6,
      name: 'Lagos Community Meet & Greet',
      organizer: 'My Lagos Community',
      category: 'Concert',
      publishedOn: 'Oct 15, 2022 10:00am',
      registration: 10000,
      regType: 'Free',
      goals: '100,000',
      status: 'Cancelled',
    },
    {
      id: 7,
      name: 'Lagos Community Meet & Greet',
      organizer: 'My Lagos Community',
      category: 'Social Networking',
      publishedOn: 'Oct 15, 2022 10:00am',
      registration: 10000,
      regType: 'Paid',
      goals: '100,000',
      status: 'Concluded',
    },
    {
      id: 8,
      name: 'Lagos Community Meet & Greet',
      organizer: 'My Lagos Community',
      category: 'Conference',
      publishedOn: 'Oct 15, 2022 10:00am',
      registration: 10000,
      regType: 'Paid',
      goals: '100,000',
      status: 'Concluded',
    },
    {
      id: 9,
      name: 'Lagos Community Meet & Greet',
      organizer: 'My Lagos Community',
      category: 'Festival',
      publishedOn: 'Oct 15, 2022 10:00am',
      registration: 10000,
      regType: 'Paid',
      goals: '1,000,000',
      status: 'Concluded',
    },
  ];

  const filteredEvents = allEvents.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-700';
      case 'Concluded':
        return 'bg-gray-100 text-gray-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

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
              {card.change} from yesterday
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
            <div className="absolute top-20 left-32 bg-white px-2 py-1 rounded border border-gray-200 text-xs">
              This Week - 120k
            </div>
            <div className="absolute top-32 left-20 bg-white px-2 py-1 rounded border border-gray-200 text-xs">
              Last Week - 9k
            </div>
          </div>
        </div>

        {/* Recent Sells */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Recent Sells</h3>
            <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">See All</a>
          </div>
          <div className="space-y-3">
            {recentSells.map((sell) => (
              <div key={sell.id} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{sell.buyer}</p>
                    <p className="text-xs text-gray-500">{sell.event}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">x{sell.amount}</p>
                  <p className="text-sm font-bold text-gray-900">{sell.currency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Event */}
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
                    <p className="text-sm font-bold text-gray-900 truncate">{event.name}</p>
                    <p className="text-xs text-red-500 mt-1">{event.location}</p>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Organizer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Published On</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Registration</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reg Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Goals</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.organizer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.publishedOn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.registration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.regType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{event.goals}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(event.status)}`}>
                      {event.status}
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
            {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length} Results
          </p>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, idx) => (
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
