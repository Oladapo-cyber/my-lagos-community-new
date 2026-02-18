
import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, MapPin, Sparkles, Check } from 'lucide-react';

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

export const Hero: React.FC = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const categoryRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="relative min-h-screen lg:h-[90vh] w-full flex items-center justify-center xs:pt-1 md:pt-20 pb-10 md:pb-28 overflow-hidden">
      {/* Background Image with Deep Blue Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://communitycra.vercel.app/static/media/banner.232e74bf9e2c596c4201.webp" 
          className="w-full h-full object-cover"
          alt="Lagos Banner"
        />
        <div className="absolute inset-0 bg-[#0a192f]/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a192f]/20 to-[#0a192f]/80"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl w-full">
        {/* Main Header - Adjusted for mobile visibility */}
        <h1 className="text-[32px] sm:text-3xl md:text-[44px] mt-[10px] md:mt-[130px] p-[40px] font-black text-white mb-3 sm:mb-6 tracking-tighter leading-tight drop-shadow-2xl">
          Welcome to <span className="text-[#f59e0b]">Lagos!</span>
        </h1>
        
        {/* Sub-header - Slightly smaller on mobile for breathing room */}
        <p className="text-xs sm:text-lg md:text-[22px] md:whitespace-nowrap text-white/95 font-bold mb-8 sm:mb-14 tracking-tight leading-relaxed max-w-xl mx-auto drop-shadow-lg px-4">
          Let's discover some great adventures, explore all the popular<br className="hidden md:block" /> places, and discover the best spots in town.
        </p>

        {/* Search Bar Card - Optimized for Mobile spacing */}
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl mx-auto w-full border border-white/20 p-2 md:p-1.5 mb-4 relative z-50">
          <div className="flex flex-col md:flex-row items-stretch md:items-center">
            
            {/* Category Dropdown */}
            <div ref={categoryRef} className="relative flex-1 w-full border-b md:border-b-0 md:border-r border-gray-100">
              <div 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="p-2 sm:p-3 flex items-center justify-between cursor-pointer group hover:bg-gray-50/50 transition-colors h-full"
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-[7px] sm:text-[9px] uppercase font-black tracking-widest text-gray-400">Category</span>
                  <span className={`text-[10px] sm:text-xs font-bold ${selectedCategory ? 'text-gray-900' : 'text-gray-500'} truncate max-w-[120px]`}>
                    {selectedCategory || 'All Categories'}
                  </span>
                </div>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180 text-blue-500' : ''}`} />
              </div>

              {/* Dropdown Menu */}
              {isCategoryOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-[200px] overflow-y-auto z-[100] py-1 text-left">
                  <div 
                    onClick={() => { setSelectedCategory(''); setIsCategoryOpen(false); }}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-600 truncate">All Categories</span>
                  </div>
                  {CATEGORIES.map((cat) => (
                    <div 
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setIsCategoryOpen(false); }}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <span className={`text-[10px] font-bold truncate ${selectedCategory === cat ? 'text-blue-600' : 'text-gray-500'} group-hover:text-blue-600`}>{cat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Location */}
            <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-gray-100 p-2 sm:p-3 flex items-center justify-between cursor-pointer group hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-[7px] sm:text-[9px] uppercase font-black tracking-widest text-gray-400">Location</span>
                <span className="text-[10px] sm:text-xs font-bold text-gray-500">Pick a location</span>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>

            {/* Keyword */}
            <div className="flex-[1.5] w-full p-2 sm:p-3 flex items-center">
              <input 
                type="text" 
                placeholder="Type a keyword..." 
                className="w-full bg-transparent outline-none px-1 text-[10px] sm:text-xs font-bold text-gray-700 placeholder:text-gray-300"
              />
            </div>

            {/* Search Button */}
            <button className="w-full md:w-auto bg-[#303030] hover:bg-black text-white px-6 py-3 sm:py-4 rounded-lg font-black transition-all uppercase tracking-[0.2em] text-[8px] sm:text-[10px] shadow-lg mt-1.5 md:mt-0 md:ml-1 text-center flex justify-center items-center">
              Search
            </button>
          </div>
        </div>

        {/* Sub-label Script - Reduced mobile size for space */}
        <div className="relative inline-block mt-4 sm:mt-12">
          <p className="font-southern text-xl sm:text-2xl md:text-3xl text-white leading-tight drop-shadow-lg px-8 sm:px-12">
            Or select a category below to find the best places
          </p>
        </div>

        {/* Scroll Indicator - Hidden on very small mobile to save space if needed, otherwise kept subtle */}
        <div className="mt-10 sm:mt-16 flex justify-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full md:mb-[20px] border border-white/20 flex items-center justify-center animate-bounce hover:border-white transition-colors cursor-pointer group">
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/50 group-hover:text-white" />
          </div>
        </div>
      </div>
    </section>
  );
};
