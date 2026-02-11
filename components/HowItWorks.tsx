
import React from 'react';
import { Layers, MapPin, Search, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { 
    icon: Layers, 
    title: 'Select Category', 
    desc: 'Select a category from our diverse catalogue that best suits your adventure quest.' 
  },
  { 
    icon: MapPin, 
    title: 'Select Location', 
    desc: 'Select a location that you would like to have this interesting experience.' 
  },
  { 
    icon: Search, 
    title: 'Pick a Keyword', 
    desc: 'Use filters to customize your search and to find exactly what you want.' 
  },
  { 
    icon: CheckCircle2, 
    title: 'View Results', 
    desc: 'Here you go... go out, explore and have fun! Experience the city like a true local!' 
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="how-it-works-bg py-16 sm:py-28 px-6 text-white text-center">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-[44px] font-extrabold mb-2 tracking-tight">How MLC works</h2>
        <p className="text-white/80 font-bold text-xs sm:text-sm mb-12 sm:mb-20">All the benefits you can get at your fingertips!</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STEPS.map((step, idx) => (
            <div key={idx} className="border border-white/20 rounded-xl p-8 sm:p-10 hover:bg-white/5 transition-all flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center mb-6 sm:mb-8 shadow-2xl">
                <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-black mb-3 sm:mb-4 tracking-tight">{step.title}</h3>
              <p className="text-[12px] sm:text-[13px] text-white/70 leading-relaxed font-bold">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
