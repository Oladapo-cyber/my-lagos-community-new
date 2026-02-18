import React from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

export const ReviewsView = () => {
  const reviews = [
    { id: 1, customer: 'Adeola Johnson', rating: 5, text: 'Absolutely beautiful fabric! The quality exceeded my expectations. Will definitely order again.', product: 'Ankara Fabric Bundle', date: 'Feb 10, 2026', avatar: null, helpful: 12 },
    { id: 2, customer: 'Chidi Okafor', rating: 4, text: 'Great craftsmanship on the necklace. Shipping was a bit slow but the product itself is lovely.', product: 'Handcrafted Necklace', date: 'Feb 8, 2026', avatar: null, helpful: 8 },
    { id: 3, customer: 'Bola Adeyemi', rating: 3, text: 'The print is nice but the frame could be better quality. Overall decent for the price.', product: 'Lagos Art Print', date: 'Feb 5, 2026', avatar: null, helpful: 3 },
    { id: 4, customer: 'Femi Kolawole', rating: 5, text: 'Perfect fit and the adire pattern is stunning. My go-to store for authentic Nigerian fashion.', product: 'Adire Shirt', date: 'Feb 3, 2026', avatar: null, helpful: 15 },
  ];

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({ star: r, count: reviews.filter(rv => rv.rating === r).length }));

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
          <p className="text-5xl font-black text-gray-900">{avgRating}</p>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(avgRating)) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-500 font-bold mt-2">{reviews.length} Reviews</p>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-extrabold text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-2.5">
            {ratingCounts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 w-6">{star}★</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%` }} />
                </div>
                <span className="text-xs font-bold text-gray-400 w-6">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-extrabold text-gray-900">Customer Reviews</h2>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    {review.customer.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900">{review.customer}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{review.date} &middot; {review.product}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.text}</p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Helpful ({review.helpful})
                </button>
                <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
