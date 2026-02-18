import React, { useState } from 'react';
import { Search, Calendar, MoreVertical, FileText } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';

export const AdminOrdersView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Order distribution chart
  const orderDistData = {
    labels: ['Open State', 'Cgn State', 'Djun State'],
    datasets: [
      {
        data: [53, 28, 19],
        backgroundColor: ['#10b981', '#fbbf24', '#3b82f6'],
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

  // Recent orders
  const recentOrders = [
    { id: 1, customer: 'Customer Name', time: '5 minutes ago', amount: '₦10,000.00' },
    { id: 2, customer: 'Customer Name', time: '13 minutes ago', amount: '₦50,000' },
    { id: 3, customer: 'Customer Name', time: '30 minutes ago', amount: '₦20,000.00' },
    { id: 4, customer: 'Customer Name', time: '1 hours ago', amount: '₦50,000.00' },
    { id: 5, customer: 'Customer Name', time: '2 hours ago', amount: '₦20,000.00' },
  ];

  // Orders table data
  const orders = [
    { id: '001', customer: 'Tiger Nixon', email: 'tiger@123gmail.com', orderId: '235', product: 'Dinner Ware', price: '₦10,000.00', orderDate: 'Oct 15, 2022 10:00am' },
    { id: '001', customer: 'Tiger Nixon', email: 'tiger@123gmail.com', orderId: '235', product: 'Dinner Ware', price: '₦10,000.00', orderDate: 'Oct 15, 2022 10:00am' },
    { id: '001', customer: 'Tiger Nixon', email: 'tiger@123gmail.com', orderId: '235', product: 'Dinner Ware', price: '₦10,000.00', orderDate: 'Oct 15, 2022 10:00am' },
    { id: '001', customer: 'Tiger Nixon', email: 'tiger@123gmail.com', orderId: '235', product: 'Dinner Ware', price: '₦10,000.00', orderDate: 'Oct 15, 2022 10:00am' },
    { id: '001', customer: 'Tiger Nixon', email: 'tiger@123gmail.com', orderId: '235', product: 'Dinner Ware', price: '₦10,000.00', orderDate: 'Oct 15, 2022 10:00am' },
    { id: '001', customer: 'Tiger Nixon', email: 'tiger@123gmail.com', orderId: '235', product: 'Dinner Ware', price: '₦10,000.00', orderDate: 'Oct 15, 2022 10:00am' },
    { id: '001', customer: 'Tiger Nixon', email: 'tiger@123gmail.com', orderId: '235', product: 'Dinner Ware', price: '₦10,000.00', orderDate: 'Oct 15, 2022 10:00am' },
    { id: '001', customer: 'Tiger Nixon', email: 'tiger@123gmail.com', orderId: '235', product: 'Dinner Ware', price: '₦10,000.00', orderDate: 'Oct 15, 2022 10:00am' },
    { id: '001', customer: 'Tiger Nixon', email: 'tiger@123gmail.com', orderId: '235', product: 'Dinner Ware', price: '₦10,000.00', orderDate: 'Oct 15, 2022 10:00am' },
    { id: '001', customer: 'Tiger Nixon', email: 'tiger@123gmail.com', orderId: '235', product: 'Dinner Ware', price: '₦10,000.00', orderDate: 'Oct 15, 2022 10:00am' },
  ];

  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          <FileText size={18} />
          Export CSV
        </button>
      </div>

      {/* Stats and Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customer List Preview */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Customer List</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.time}</p>
                </div>
                <p className="text-sm font-bold text-red-500">{order.amount}</p>
              </div>
            ))}
          </div>
          <a href="#" className="block text-center mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            See All
          </a>
        </div>

        {/* Active Order Distribution */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Active Order Distribution</h3>
          <div className="space-y-4">
            <div className="relative w-full h-48 mb-6">
              <Doughnut data={orderDistData} options={donutOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs text-gray-500">Total Active Orders</p>
                <p className="text-2xl font-bold text-gray-900">₦507,530</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">Open State</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">₦500,000.00</span>
                </div>
                <p className="text-xs text-emerald-600 font-medium ml-5">53% ACTIVE</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                    <span className="text-sm text-gray-600">Cgn State</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">5,030</span>
                </div>
                <p className="text-xs text-amber-600 font-medium ml-5">28% ACTIVE</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">Djun State</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">2,500</span>
                </div>
                <p className="text-xs text-blue-600 font-medium ml-5">19% ACTIVE</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
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
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              All
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Out of Stock
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              In Stock
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Id</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline">{order.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.orderDate}</td>
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
            {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} Records
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
