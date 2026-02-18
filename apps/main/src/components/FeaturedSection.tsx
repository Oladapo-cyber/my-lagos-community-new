
import React from 'react';
import { ArrowRight } from 'lucide-react';

export const FeaturedSection: React.FC = () => {
  return (
    <section className="relative h-[360px] sm:h-[480px] flex items-center px-6 md:px-24">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop" 
          className="w-full h-full object-cover"
          alt="Cafe Interior"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative z-10 text-white max-w-3xl">
        <h2 className="text-3xl sm:text-5xl md:text-[64px] font-black mb-6 sm:mb-10 leading-tight tracking-tighter">
          Visit the best Cafes, <br /> Restaurants & Bars
        </h2>
        <div className="flex items-center gap-4 sm:gap-6 group cursor-pointer">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-[#f59e0b] flex items-center justify-center group-hover:bg-[#f59e0b] transition-all">
            <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 text-[#f59e0b] group-hover:text-black" />
          </div>
          <span className="font-southern text-3xl sm:text-5xl text-white">See Listings</span>
        </div>
      </div>
    </section>
  );
};
