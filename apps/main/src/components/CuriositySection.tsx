
import React from 'react';
import { ArrowRight } from 'lucide-react';

const CURIOUS_CARDS = [
  { title: 'Food / Cuisine', listings: 24, img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500&auto=format&fit=crop' },
  { title: 'Shopping', listings: 18, img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&auto=format&fit=crop' },
  { title: 'Nightlife', listings: 12, img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop' },
  { title: 'Cocktails', listings: 14, img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&auto=format&fit=crop' },
  { title: 'Toys & Games', listings: 10, img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop' },
  { title: 'Hotels & Travel', listings: 22, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format&fit=crop' },
  { title: 'Bars & Grilled', listings: 16, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop' },
  { title: 'Night Events', listings: 20, img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&auto=format&fit=crop' },
];

export const CuriositySection: React.FC = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-[44px] font-extrabold text-[#111] mb-4 tracking-tight leading-none">What sparks your curiousity today?</h2>
        <p className="text-gray-500 font-bold text-sm leading-relaxed">
          See what is trending in Lagos:<br />
          Food, Parties, Clubs, Nightlife and much more
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {CURIOUS_CARDS.map((card, idx) => (
          <div key={idx} className="relative h-52 sm:h-56 rounded-xl overflow-hidden group cursor-pointer">
            <img 
              src={card.img} 
              alt={card.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
              <h3 className="text-white font-black text-base sm:text-lg mb-0.5">{card.title}</h3>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">{card.listings} Listings</p>
            </div>
          </div>
        ))}
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
