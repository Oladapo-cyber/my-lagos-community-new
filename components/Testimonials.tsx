
import React from 'react';
import { IMAGES } from '../assets/images';

const TESTIMONIALS = [
  { 
    name: 'Adebayo Ogunlesi', 
    role: 'RESTAURANT OWNER', 
    text: 'My Lagos Community helped me discover amazing local spots I never knew existed. The platform is incredible for connecting businesses with customers.',
    img: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&auto=format&fit=crop' 
  },
  { 
    name: 'Chioma Nwosu', 
    role: 'EVENT PLANNER', 
    text: 'As an event planner, MLC has been a game-changer. I can easily find venues and connect with vendors across Lagos. Highly recommended!',
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop' 
  },
  { 
    name: 'Tunde Bakare', 
    role: 'HOTEL MANAGER', 
    text: 'Since listing our hotel on MLC, we have seen a significant increase in bookings. The community here is truly engaged and active.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop' 
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section 
      className="py-16 sm:py-28 px-6 relative"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: `url('${IMAGES.TESTIMONIAL_BG}')`,
        backgroundSize: '800px',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat'
      }}
    >
      <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-20 relative z-10">
        <h2 className="text-3xl sm:text-[44px] font-extrabold text-[#111] mb-4 sm:mb-6 tracking-tight leading-tight">What People Say</h2>
        <div className="max-w-3xl mx-auto space-y-2 sm:space-y-3 px-4">
          <p className="text-gray-600 font-bold text-xs sm:text-sm leading-relaxed tracking-tight">
            Hearing from our users will make you choose your mind!
          </p>
          <p className="text-gray-400 text-[11px] sm:text-[13px] font-bold leading-relaxed max-w-2xl mx-auto">
            Our community members love sharing their experiences discovering Lagos through MLC.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 relative z-10">
        {TESTIMONIALS.map((t, idx) => (
          <div key={idx} className="flex flex-col items-center text-center group">
            {/* Image with thick light blue border */}
            <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full overflow-hidden border-[8px] sm:border-[12px] border-[#e0e7ff] mb-8 sm:mb-12 shadow-sm transition-transform duration-500 group-hover:scale-105">
              <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
            </div>
            
            {/* Header info */}
            <div className="space-y-1 sm:space-y-2 mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-black text-[#f59e0b] tracking-tight leading-none">{t.name}</h3>
              <p className="text-[9px] sm:text-[11px] font-black tracking-[0.2em] text-[#111] uppercase">{t.role}</p>
            </div>
            
            {/* Italicized quote below */}
            <p className="text-gray-500 italic font-bold leading-relaxed text-[13px] sm:text-[15px] max-w-[280px]">
              "{t.text}"
            </p>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-12 sm:mt-24 gap-3 relative z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
        <div className="w-2.5 h-2.5 rounded-full border border-gray-300 bg-white"></div>
        <div className="w-2.5 h-2.5 rounded-full border border-gray-300 bg-white"></div>
        <div className="w-2.5 h-2.5 rounded-full border border-gray-300 bg-white"></div>
      </div>
    </section>
  );
};
