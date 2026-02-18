
import React from 'react';
import { Star, MapPin, Phone, Heart, Maximize2, ShoppingBag, ChevronLeft, ChevronRight, ArrowRight, Utensils } from 'lucide-react';

const LOCATIONS = [
  { id: 1, name: "Oshey's Cafe & Bar", desc: 'The best place for cocktails and grills', address: '12, Admiralty Way, Lekki Phase 1, Lagos', phone: '08012345678', status: 'OPEN NOW', type: 'Bar & Cafe', rating: 4.8, img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop' },
  { id: 2, name: 'Terra Kulture', desc: 'Arts, culture, and fine dining', address: '1376 Tiamiyu Savage St, Victoria Island, Lagos', phone: '08098765432', status: 'OPEN NOW', type: 'Arts', rating: 4.7, img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&auto=format&fit=crop' },
  { id: 3, name: 'Nike Art Gallery', desc: 'Largest art gallery in West Africa', address: '2 Elegushi Beach Rd, Lekki, Lagos', phone: '08055443322', status: 'OPEN NOW', type: 'Gallery', rating: 4.9, img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop' },
  { id: 4, name: 'The Palms Shopping Mall', desc: 'Premium shopping and entertainment', address: '1 Bisway St, Lekki Phase 1, Lagos', phone: '08033221144', status: 'CLOSED', type: 'Shopping', rating: 4.5, img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop' },
];

interface PopularLocationsProps {
  onListingClick: (id: number) => void;
}

export const PopularLocations: React.FC<PopularLocationsProps> = ({ onListingClick }) => {
  return (
    <section className="py-28 px-6 bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-[44px] font-extrabold text-[#111] mb-4 tracking-tight leading-none">Most Popular Locations</h2>
        <p className="text-gray-500 font-bold text-sm leading-relaxed">
          Discover the best things to do in Lagos:<br />
          Restaurants, Theatres, Art Gallery, Nightlife and much more
        </p>
      </div>

      <div className="max-w-7xl mx-auto relative group">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {LOCATIONS.map((loc) => (
            <div 
              key={loc.id} 
              onClick={() => onListingClick(loc.id)}
              className="bg-white rounded-xl overflow-hidden shadow-sm group/card cursor-pointer border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={loc.img} alt={loc.name} className="w-full h-full object-cover transition-transform group-hover/card:scale-105" />
                
                {/* Status Badge */}
                <div className={`absolute top-5 -left-9 w-36 py-1 flex items-center justify-center -rotate-45 text-[10px] font-black text-white uppercase tracking-tighter shadow-md z-10 ${loc.status === 'OPEN NOW' ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`}>
                  {loc.status}
                </div>

                {/* Category Icon */}
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[9px] font-black flex items-center gap-1.5 shadow-lg uppercase tracking-widest">
                   <ShoppingBag className="w-3 h-3" />
                  {loc.type}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-black text-[#111] mb-1 group-hover/card:text-blue-600 transition-colors">{loc.name}</h3>
                <p className="text-[13px] text-gray-400 font-bold mb-6">{loc.desc}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2.5 text-[11px] text-gray-500 font-bold">
                    <MapPin className="w-4 h-4 text-gray-300 shrink-0" />
                    <span className="leading-relaxed">{loc.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[11px] text-gray-500 font-bold">
                    <Phone className="w-4 h-4 text-gray-300 shrink-0" />
                    <span>{loc.phone}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
                    <span className="text-sm font-black text-gray-600">{loc.rating}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Maximize2 className="w-4 h-4 text-gray-300 hover:text-blue-600 transition-colors" />
                    <Heart className="w-4 h-4 text-gray-300 hover:text-red-500 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl z-10">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl z-10">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-16 flex justify-center items-center gap-4 group cursor-pointer">
        <div className="w-10 h-10 rounded-full border border-blue-600 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
          <ArrowRight className="w-5 h-5" />
        </div>
        <span className="font-southern text-4xl text-black">See more Categories...</span>
      </div>
    </section>
  );
};
