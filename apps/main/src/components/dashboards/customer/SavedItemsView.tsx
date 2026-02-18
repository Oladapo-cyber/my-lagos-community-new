import React from 'react';
import { Heart, Trash2, ExternalLink } from 'lucide-react';

export const SavedItemsView = () => {
  const savedItems = [
    { id: 1, name: "Oshey's Cafe", category: 'Bar & Cafe', location: 'Lekki, Lagos', image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200', rating: 4.5 },
    { id: 2, name: 'Island Grill House', category: 'Restaurant', location: 'Victoria Island, Lagos', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200', rating: 4.8 },
    { id: 3, name: 'Bella Boutique', category: 'Shopping', location: 'Ikeja, Lagos', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200', rating: 4.2 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-pink-500" />
            <h2 className="text-lg font-extrabold text-gray-900">Saved Items</h2>
            <span className="text-xs font-bold text-gray-400">({savedItems.length})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedItems.map((item) => (
            <div key={item.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-32 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <h3 className="font-extrabold text-gray-900 text-sm mb-1">{item.name}</h3>
                <p className="text-xs text-gray-500 font-medium mb-1">{item.category}</p>
                <p className="text-xs text-gray-400 mb-3">{item.location}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-yellow-600">★ {item.rating}</span>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {savedItems.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-400">No saved items yet</p>
            <p className="text-xs text-gray-400 mt-1">Start browsing to save items you love</p>
          </div>
        )}
      </div>
    </div>
  );
};
