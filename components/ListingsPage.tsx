import React from 'react';
import { 
  Star, 
  MapPin, 
  Phone, 
  Heart, 
  Maximize2, 
  ShoppingBag, 
  ChevronDown, 
  LocateFixed,
  Utensils
} from 'lucide-react';

const LISTINGS = [
  { 
    id: 1, 
    name: "Oshey's Cafe & Bar", 
    desc: 'The best place to buy and sell', 
    address: '1, Real Address, Lagos, Nigeria', 
    phone: '08012345678', 
    status: 'OPEN NOW', 
    type: 'Bar & Cafe', 
    rating: 8.7, 
    img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop' 
  },
  { 
    id: 2, 
    name: 'Zara', 
    desc: 'The best place to buy and sell', 
    address: '1, Real Address, Off fake address, Lagos', 
    phone: '08065358853', 
    status: 'CLOSED', 
    type: 'shopping', 
    rating: 4.5, 
    img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop' 
  },
  { 
    id: 3, 
    name: 'Luxury Lounge', 
    desc: 'The best place to buy and sell', 
    address: '1, Real Address, Off fake address, Lagos', 
    phone: '08065358853', 
    status: 'OPEN NOW', 
    type: 'Bar & Cafe', 
    rating: 4.5, 
    img: 'https://images.unsplash.com/photo-1490474418645-177b35242d5f?w=600&auto=format&fit=crop' 
  },
  { 
    id: 4, 
    name: 'Zara', 
    desc: 'The best place to buy and sell', 
    address: '1, Real Address, Off fake address, Lagos', 
    phone: '08065358853', 
    status: 'CLOSED', 
    type: 'shopping', 
    rating: 4.5, 
    img: 'https://images.unsplash.com/photo-1599951684347-152e00c3b879?w=600&auto=format&fit=crop' 
  },
  { 
    id: 5, 
    name: 'Art House', 
    desc: 'The best place to buy and sell', 
    address: '1, Real Address, Off fake address, Lagos', 
    phone: '08065358853', 
    status: 'OPEN NOW', 
    type: 'Arts', 
    rating: 4.5, 
    img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop' 
  },
  { 
    id: 6, 
    name: 'Zara', 
    desc: 'The best place to buy and sell', 
    address: '1, Real Address, Off fake address, Lagos', 
    phone: '08065358853', 
    status: 'CLOSED', 
    type: 'shopping', 
    rating: 4.5, 
    img: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=600&auto=format&fit=crop' 
  },
];

const CATEGORIES = [
  'Medical Emergency',
  'Instant Loan',
  'Arts & Culture',
  'Restaurants',
  'Health & Beauty',
  'Shopping',
  'Hotels & Travel',
  'Nightlife',
  'Real Estate',
  'Automotive',
  'Services',
  'Bars & Cafes'
];

interface ListingsPageProps {
  onListingClick: (id: number) => void;
}

export const ListingsPage: React.FC<ListingsPageProps> = ({ onListingClick }) => {
  return (
    <div className="bg-[#f9fafb] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Listings Content (Left Side) */}
          <main className="w-full lg:w-[68%] order-2 lg:order-1">
            <h1 className="text-5xl font-extrabold text-[#111] mb-12 tracking-tight">Listings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {LISTINGS.map((loc) => (
                <div 
                  key={loc.id} 
                  onClick={() => onListingClick(loc.id)}
                  className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] group/card cursor-pointer border border-gray-100/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={loc.img} 
                      alt={loc.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599951684347-152e00c3b879?w=600&auto=format&fit=crop';
                      }}
                    />
                    
                    {/* Status Ribbon */}
                    <div className={`absolute top-6 -left-8 w-36 py-1 flex items-center justify-center -rotate-45 text-[10px] font-black text-white uppercase tracking-tighter shadow-sm z-10 ${loc.status === 'OPEN NOW' ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`}>
                      {loc.status}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 bg-[#2563eb] text-white px-4 py-2 rounded-lg text-[11px] font-black flex items-center gap-2 shadow-lg uppercase tracking-widest z-10">
                      {loc.type.toLowerCase().includes('bar') ? <Utensils className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                      {loc.type}
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-black text-[#111] mb-1 group-hover/card:text-[#2563eb] transition-colors">{loc.name}</h3>
                    <p className="text-sm text-gray-400 font-bold mb-8">{loc.desc}</p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3 text-xs text-gray-500 font-bold leading-relaxed">
                        <MapPin className="w-4 h-4 text-gray-300 shrink-0" />
                        <span>{loc.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                        <Phone className="w-4 h-4 text-gray-300 shrink-0" />
                        <span>{loc.phone}</span>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
                        <span className="text-base font-black text-[#444]">{loc.rating}</span>
                      </div>
                      <div className="flex items-center gap-5">
                        <Maximize2 className="w-5 h-5 text-gray-300 hover:text-[#2563eb] transition-colors" />
                        <Heart className="w-5 h-5 text-gray-300 hover:text-red-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Footer */}
            <div className="mt-20 text-center space-y-8">
              <p className="text-sm font-black text-gray-600">You have viewed 12 out of 200</p>
              <div className="max-w-md mx-auto h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-[#2563eb] w-[30%] rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
              </div>
              <div className="pt-4 pb-20">
                <button className="px-12 py-4 border-2 border-[#111] rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-[#111] hover:text-white transition-all duration-300">
                  LOAD MORE
                </button>
              </div>
            </div>
          </main>

          {/* Filter Sidebar */}
          <aside className="w-full lg:w-[32%] space-y-8 order-1 lg:order-2">
            <div className="bg-white border border-gray-100 rounded-2xl p-10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] sticky top-24">
              <h2 className="text-2xl font-black text-[#111] mb-10">What are you looking for</h2>
              
              <div className="space-y-8">
                {/* Category Dropdown */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#999]">CHOOSE CATEGORY</label>
                  <div className="relative">
                    <select className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-5 py-4 text-sm font-bold text-gray-600 appearance-none focus:ring-4 focus:ring-blue-500/5 outline-none focus:border-blue-500 transition-all cursor-pointer">
                      <option>Choose category</option>
                      {CATEGORIES.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999] pointer-events-none" />
                  </div>
                </div>

                {/* Keyword Search */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#999]">WHAT ARE YOU LOOKING FOR?</label>
                  <input 
                    type="text" 
                    placeholder="Type a keyword to search" 
                    className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none focus:border-blue-500 transition-all placeholder:text-gray-300"
                  />
                </div>

                {/* Location Picker */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#999]">CHOOSE LOCATION</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Where are you looking?" 
                      className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl pl-5 pr-14 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none focus:border-blue-500 transition-all placeholder:text-gray-300"
                    />
                    <LocateFixed className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999] cursor-pointer hover:text-[#2563eb] transition-colors" />
                  </div>
                </div>

                {/* Distance Slider */}
                <div className="space-y-5">
                  <label className="text-sm font-black text-[#111]">Distance (Km)</label>
                  <div className="relative h-6 flex items-center">
                    <input 
                      type="range" 
                      className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#2563eb]" 
                    />
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="space-y-5">
                  <label className="text-sm font-black text-[#111]">Price Range</label>
                  <div className="relative h-6 flex items-center">
                    <input 
                      type="range" 
                      className="w-full h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[#2563eb]" 
                    />
                  </div>
                </div>

                {/* Open Toggle */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-black text-[#111]">Open?</span>
                  <label className="relative inline-flex items-center cursor-pointer group">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-500/10 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-[#2563eb] shadow-sm"></div>
                  </label>
                </div>

                {/* Tags Checklist */}
                <div className="space-y-5">
                  <label className="text-sm font-black text-[#111]">Filter By Tags</label>
                  <div className="grid grid-cols-1 gap-4">
                    {['Accessories', 'Agro', 'Arts', 'Bar', 'Breakfast', 'Brunch'].map((tag) => (
                      <label key={tag} className="flex items-center gap-4 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-200 bg-[#f8fafc] checked:bg-[#2563eb] checked:border-[#2563eb] transition-all" />
                          <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 peer-checked:opacity-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        <span className="text-xs font-black text-gray-500 group-hover:text-[#2563eb] transition-colors tracking-wide">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button className="w-full bg-[#2563eb] hover:bg-blue-700 text-white py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.25em] shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all mt-6">
                  FILTER RESULT
                </button>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};