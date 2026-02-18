import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MapPin, 
  Phone, 
  Heart, 
  Maximize2, 
  ShoppingBag, 
  ChevronDown, 
  LocateFixed,
  Utensils,
  ChevronUp
} from 'lucide-react';
import { LISTINGS_DATA, CATEGORIES } from '../data/listingsData';

interface ListingsPageProps {
  onListingClick: (id: number) => void;
}

export const ListingsPage: React.FC<ListingsPageProps> = ({ onListingClick }) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const totalListings = LISTINGS_DATA.length;
  const visibleListings = LISTINGS_DATA.slice(0, visibleCount);
  const hasMore = visibleCount < totalListings;
  const canShowLess = visibleCount > 6;

  // Show floating back to top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, totalListings));
  };

  const showLess = () => {
    setVisibleCount(6);
    // Scroll to top of listings
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Listings Content (Left Side) */}
          <main className="w-full lg:w-[68%] order-2 lg:order-1">
            <h1 className="text-5xl font-extrabold text-[#111] mb-12 tracking-tight">Listings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleListings.map((loc) => (
                <div 
                  key={loc.id} 
                  onClick={() => onListingClick(loc.id)}
                  className="bg-white rounded-lg overflow-hidden shadow-sm group/card cursor-pointer border border-gray-100 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={loc.img} 
                      alt={loc.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop';
                      }}
                    />
                    
                    {/* Status Ribbon */}
                    <div className={`absolute top-5 -left-8 w-36 py-1 flex items-center justify-center -rotate-45 text-[10px] font-black text-white uppercase tracking-tight shadow-sm ${loc.status === 'OPEN NOW' ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`}>
                      {loc.status}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 bg-[#2563eb] text-white px-3 py-1.5 rounded-md text-[10px] font-black flex items-center gap-1.5 shadow-md uppercase tracking-wide">
                      {loc.type.toLowerCase().includes('bar') || loc.type.toLowerCase().includes('cafe') || loc.type.toLowerCase().includes('restaurant') ? (
                        <Utensils className="w-3 h-3" />
                      ) : (
                        <ShoppingBag className="w-3 h-3" />
                      )}
                      {loc.type}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-extrabold text-[#111] mb-1">{loc.name}</h3>
                    <p className="text-xs text-gray-400 font-medium mb-4">{loc.desc}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2 text-[11px] text-gray-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{loc.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                        <Phone className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        <span>{loc.phone}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
                        <span className="text-sm font-bold text-[#444]">{loc.rating}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Maximize2 className="w-4 h-4 text-gray-300 hover:text-[#2563eb] transition-colors cursor-pointer" />
                        <Heart className="w-4 h-4 text-gray-300 hover:text-red-500 transition-colors cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Footer */}
            <div className="mt-16 text-center space-y-6">
              <p className="text-sm font-bold text-gray-600">You have viewed {visibleCount} out of {totalListings}</p>
              <div className="max-w-sm mx-auto h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2563eb] transition-all duration-500"
                  style={{ width: `${(visibleCount / totalListings) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-center gap-4 pt-2 pb-16">
                {canShowLess && (
                  <button 
                    onClick={showLess}
                    className="px-10 py-3.5 border-2 border-gray-300 text-gray-600 rounded-full text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-all duration-300"
                  >
                    SHOW LESS
                  </button>
                )}
                {hasMore && (
                  <button 
                    onClick={loadMore}
                    className="px-12 py-3.5 border-2 border-[#111] rounded-full text-xs font-black uppercase tracking-wider hover:bg-[#111] hover:text-white transition-all duration-300"
                  >
                    LOAD MORE
                  </button>
                )}
              </div>
            </div>
          </main>

          {/* Filter Sidebar */}
          <aside className="w-full lg:w-[32%] space-y-6 order-1 lg:order-2">
            <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm sticky top-24">
              <h2 className="text-xl font-black text-[#111] mb-8">What are you looking for</h2>
              
              <div className="space-y-6">
                {/* Category Dropdown */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">CHOOSE CATEGORY</label>
                  <div className="relative">
                    <select className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 appearance-none focus:outline-none focus:border-[#2563eb] transition-colors cursor-pointer">
                      <option>Choose category</option>
                      {CATEGORIES.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Keyword Search */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">WHAT ARE YOU LOOKING FOR?</label>
                  <input 
                    type="text" 
                    placeholder="Type a keyword to search" 
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#2563eb] transition-colors placeholder:text-gray-300"
                  />
                </div>

                {/* Location Picker */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">CHOOSE LOCATION</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Where are you looking?" 
                      className="w-full bg-white border border-gray-200 rounded-lg pl-4 pr-12 py-3 text-sm font-medium focus:outline-none focus:border-[#2563eb] transition-colors placeholder:text-gray-300"
                    />
                    <LocateFixed className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer hover:text-[#2563eb] transition-colors" />
                  </div>
                </div>

                {/* Distance Slider */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#111]">Distance (Km)</label>
                  <input 
                    type="range" 
                    className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#2563eb]" 
                  />
                </div>

                {/* Price Range Slider */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#111]">Price Range</label>
                  <input 
                    type="range" 
                    className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#2563eb]" 
                  />
                </div>

                {/* Open Toggle */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-bold text-[#111]">Open?</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                  </label>
                </div>

                {/* Tags Checklist */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#111]">Filter By Tags</label>
                  <div className="space-y-3">
                    {['Accessories', 'Agro', 'Arts', 'Bar', 'Breakfast', 'Brunch'].map((tag) => (
                      <label key={tag} className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb] cursor-pointer" 
                        />
                        <span className="text-xs font-medium text-gray-600">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button className="w-full bg-[#2563eb] hover:bg-blue-700 text-white py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all mt-4">
                  FILTER RESULT
                </button>
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-[#2563eb] hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        >
          <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};