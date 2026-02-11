
import React from 'react';
import { Search, ChevronDown, MapPin, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
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
        <p className="text-xs sm:text-lg md:text-[22px] text-white/95 font-bold mb-8 sm:mb-14 tracking-tight leading-relaxed max-w-xl mx-auto drop-shadow-lg px-4">
          Let's discover some great adventures, explore all the popular<br className="hidden md:block" /> places, and discover the best spots in town.
        </p>

        {/* Search Bar Card - Optimized for Mobile spacing */}
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl mx-auto w-full border border-white/20 p-3 md:p-2 mb-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center">
            {/* Category */}
            <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-gray-100 p-2.5 sm:p-4 flex items-center justify-between cursor-pointer group hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col items-start">
                <span className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest text-gray-400 mb-0.5">Category</span>
                <span className="text-[11px] sm:text-sm font-bold text-gray-700">Choose category</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            
            {/* Location */}
            <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-gray-100 p-2.5 sm:p-4 flex items-center justify-between cursor-pointer group hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col items-start">
                <span className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest text-gray-400 mb-0.5">Location</span>
                <span className="text-[11px] sm:text-sm font-bold text-gray-700">Pick a location</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>

            {/* Keyword */}
            <div className="flex-[1.5] w-full p-2.5 sm:p-4 flex items-center">
              <input 
                type="text" 
                placeholder="Type a keyword..." 
                className="w-full bg-transparent outline-none px-1 sm:px-4 text-[11px] sm:text-sm font-bold text-gray-700 placeholder:text-gray-300"
              />
            </div>

            {/* Search Button */}
            <button className="w-full md:w-auto bg-[#303030] hover:bg-black text-white px-8 py-3.5 sm:py-5 rounded-lg font-black transition-all uppercase tracking-[0.2em] text-[10px] sm:text-xs shadow-lg mt-2 md:mt-0">
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
