import React, { useState } from 'react';
import { Search, Calendar, MoreVertical, FileText, Star } from 'lucide-react';

export const AdminReviewsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reviews data
  const reviews = [
    { id: '001', customer: 'Tiger Nixon', email: 'tiger@123gmail.com', product: 'Dinner Ware', rating: 5, reviewDate: 'Oct 15, 2022 10:00am', status: 'Published', comment: 'Great product, highly recommended!' },
    { id: '002', customer: 'Garrett Winters', email: 'garrett@example.com', product: 'China Plates', rating: 4, reviewDate: 'Oct 14, 2022 3:30pm', status: 'Published', comment: 'Good quality for the price' },
    { id: '003', customer: 'Ashton Cox', email: 'ashton@example.com', product: 'Table Knives', rating: 3, reviewDate: 'Oct 13, 2022 11:20am', status: 'Pending', comment: 'Average product, nothing special' },
    { id: '004', customer: 'Cedric Kelly', email: 'cedric@example.com', product: 'Dinner Set', rating: 5, reviewDate: 'Oct 12, 2022 9:15am', status: 'Published', comment: 'Excellent purchase!' },
    { id: '005', customer: 'Airi Satou', email: 'airi@example.com', product: 'Glass Set', rating: 4, reviewDate: 'Oct 11, 2022 2:45pm', status: 'Published', comment: 'Very satisfied with quality' },
    { id: '006', customer: 'Brielle Williamson', email: 'brielle@example.com', product: 'Cutlery Set', rating: 5, reviewDate: 'Oct 10, 2022 8:30am', status: 'Published', comment: 'Best purchase ever!' },
    { id: '007', customer: 'Herrod Chandler', email: 'herrod@example.com', product: 'Tea Cups', rating: 2, reviewDate: 'Oct 9, 2022 6:10pm', status: 'Rejected', comment: 'Not what I expected' },
    { id: '008', customer: 'Rhona Davidson', email: 'rhona@example.com', product: 'Coffee Mugs', rating: 4, reviewDate: 'Oct 8, 2022 1:20pm', status: 'Published', comment: 'Nice design and quality' },
    { id: '009', customer: 'Colleen Hurst', email: 'colleen@example.com', product: 'Serving Platters', rating: 5, reviewDate: 'Oct 7, 2022 10:45am', status: 'Published', comment: 'Perfect for parties!' },
    { id: '010', customer: 'Sonya Frost', email: 'sonya@example.com', product: 'Bowl Set', rating: 3, reviewDate: 'Oct 6, 2022 4:00pm', status: 'Pending', comment: 'It is okay for the price' },
  ];

  const filteredReviews = reviews.filter(review =>
    review.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-100 text-emerald-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, idx) => (
          <Star
            key={idx}
            size={14}
            className={idx < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          <FileText size={18} />
          Export CSV
        </button>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">All Reviews</h3>
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
                placeholder="Search Customer/Product"
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
              Published
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              Pending
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Review Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Comment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedReviews.map((review, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{review.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{review.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 underline">{review.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{review.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{renderStars(review.rating)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{review.reviewDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusStyle(review.status)}`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{review.comment}</td>
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
            {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredReviews.length)} of {filteredReviews.length} Records
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
