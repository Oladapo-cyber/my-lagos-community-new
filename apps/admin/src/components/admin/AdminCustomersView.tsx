import React, { useState } from 'react';
import { Search, Calendar, MoreVertical, FileText, Plus } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';

export const AdminCustomersView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Customer stats chart
  const customerStatsData = {
    labels: ['Current', 'New Customer', 'Lost Customer'],
    datasets: [
      {
        data: [52000, 5000, 2500],
        backgroundColor: ['#3b82f6', '#10b981', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
    },
  };

  // Recent orders sidebar
  const recentOrders = [
    { id: 1, customer: 'Doyle Ericka', email: 'Doyle@gmail.com', orders: 60, memberSince: 'Sep 7, 2022', totalSpend: '₦10,000.00' },
    { id: 2, customer: 'Doyle Ericka', email: 'Doyle@gmail.com', orders: 60, memberSince: 'Sep 7, 2022', totalSpend: '₦10,000.00' },
    { id: 3, customer: 'Doyle Ericka', email: 'Doyle@gmail.com', orders: 60, memberSince: 'Sep 7, 2022', totalSpend: '₦10,000.00' },
    { id: 4, customer: 'Doyle Ericka', email: 'Doyle@gmail.com', orders: 60, memberSince: 'Sep 7, 2022', totalSpend: '₦10,000.00' },
  ];

  // Customers table data
  const customers = [
    { id: '001', name: 'Tiger Nixon', email: 'tiger@123gmail.com', orders: 60, memberSince: 'Sep 7, 2022', totalSpend: '₦10,000.00' },
    { id: '002', name: 'Tiger Nixon', email: 'tiger@123gmail.com', orders: 60, memberSince: 'Sep 7, 2022', totalSpend: '₦10,000.00' },
    { id: '001', name: 'Tiger Nixon', email: 'tiger@123gmail.com', orders: 60, memberSince: 'Sep 7, 2022', totalSpend: '₦10,000.00' },
    { id: '002', name: 'Tiger Nixon', email: 'tiger@123gmail.com', orders: 60, memberSince: 'Sep 7, 2022', totalSpend: '₦10,000.00' },
    { id: '001', name: 'Tiger Nixon', email: 'tiger@123gmail.com', orders: 60, memberSince: 'Sep 7, 2022', totalSpend: '₦10,000.00' },
    { id: '002', name: 'Tiger Nixon', email: 'tiger@123gmail.com', orders: 60, memberSince: 'Sep 7, 2022', totalSpend: '₦10,000.00' },
    { id: '001', name: 'Tiger Nixon', email: 'tiger@123gmail.com', orders: 60, memberSince: 'Sep 7, 2022', totalSpend: '₦10,000.00' },
    { id: '002', name: 'Tiger Nixon', email: 'tiger@123gmail.com', orders: 60, memberSince: 'Sep 7, 2022', totalSpend: '₦10,000.00' },
    { id: '001', name: 'Tiger Nixon', email: 'tiger@123gmail.com', orders: 60, memberSince: 'Sep 7, 2022', totalSpend: '₦10,000.00' },
    { id: '002', name: 'Tiger Nixon', email: 'tiger@123gmail.com', orders: 60, memberSince: 'Sep 7, 2022', totalSpend: '₦10,000.00' },
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <FileText size={18} />
            Export CSV
          </button>
          <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            <Plus size={18} />
            ADD CUSTOMER
          </button>
        </div>
      </div>

      {/* Stats and Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  <p>No. of Orders: <span className="font-medium">{order.orders}</span></p>
                  <p>Member Since: <span className="font-medium">{order.memberSince}</span></p>
                  <p>Total Spend: <span className="font-bold text-red-500">{order.totalSpend}</span></p>
                </div>
              </div>
            ))}
          </div>
          <a href="#" className="block text-center mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            See All
          </a>
        </div>

        {/* Customers Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Customers</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="relative h-64">
              <Doughnut data={customerStatsData} options={donutOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-3xl font-bold text-gray-900">59,500</p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">Current</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">52,000</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">New Customer</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">5,000</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">Lost Customer</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">2,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Customer List</h3>
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
                placeholder="Search Name/Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <Calendar size={16} />
              From
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
              <Calendar size={16} />
              To
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email Id</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No. of Orders</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Member Since</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Spend</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedCustomers.map((customer, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline">{customer.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.memberSince}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.totalSpend}</td>
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
            {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} Records
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">»</button>
          </div>
        </div>
      </div>
    </div>
  );
};
