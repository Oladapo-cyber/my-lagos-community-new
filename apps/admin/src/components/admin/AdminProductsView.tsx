import React, { useState } from 'react';
import { Search, Calendar, Plus, MoreVertical, FileText } from 'lucide-react';

export const AdminProductsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Products data
  const products = [
    { id: '001', name: 'Table Knives', category: 'Home & Kitchen', price: '₦10,000.00', restockDate: 'Oct 15, 2022 10:00am', qtySold: 5000, qtyLeft: 0, status: 'Out of Stock' },
    { id: '002', name: 'China Dinner Ware', category: 'Bar & Restaurant', price: '₦2,640.00', restockDate: 'Oct 15, 2022 10:00am', qtySold: 560, qtyLeft: 560, status: 'In Stock' },
    { id: '001', name: 'Table Knives', category: 'Home & Kitchen', price: '₦10,000.00', restockDate: 'Oct 15, 2022 10:00am', qtySold: 5000, qtyLeft: 0, status: 'Out of Stock' },
    { id: '002', name: 'A Sample Product', category: 'Home & Kitchen', price: '₦2,640.00', restockDate: 'Oct 15, 2022 10:00am', qtySold: 560, qtyLeft: 560, status: 'In Stock' },
    { id: '002', name: 'A Sample Product', category: 'Home & Kitchen', price: '₦2,640.00', restockDate: 'Oct 15, 2022 10:00am', qtySold: 560, qtyLeft: 560, status: 'In Stock' },
    { id: '002', name: 'A Sample Product', category: 'Electronics', price: '₦2,640.00', restockDate: 'Oct 15, 2022 10:00am', qtySold: 560, qtyLeft: 560, status: 'In Stock' },
    { id: '002', name: 'A Sample Product', category: 'Home & Kitchen', price: '₦2,640.00', restockDate: 'Oct 15, 2022 10:00am', qtySold: 560, qtyLeft: 560, status: 'In Stock' },
    { id: '002', name: 'A Sample Product', category: 'Art', price: '₦2,640.00', restockDate: 'Oct 15, 2022 10:00am', qtySold: 560, qtyLeft: 560, status: 'In Stock' },
    { id: '002', name: 'A Sample Product', category: 'Home & Kitchen', price: '₦2,640.00', restockDate: 'Oct 15, 2022 10:00am', qtySold: 560, qtyLeft: 560, status: 'In Stock' },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-100 text-emerald-700';
      case 'Out of Stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <FileText size={18} />
            Export CSV
          </button>
          <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            <Plus size={18} />
            ADD PRODUCT
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Product List</h3>
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
                placeholder="Search Product"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Category</option>
              <option>Home & Kitchen</option>
              <option>Electronics</option>
              <option>Art</option>
              <option>Bar & Restaurant</option>
            </select>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Restock Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty Sold</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty Left</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedProducts.map((product, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.restockDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.qtySold}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.qtyLeft}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusStyle(product.status)}`}>
                      {product.status}
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
            {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} Records
          </p>
          <div className="flex gap-2">
            {[...Array(Math.min(totalPages, 5))].map((_, idx) => (
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
