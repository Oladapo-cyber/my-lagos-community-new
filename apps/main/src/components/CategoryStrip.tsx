import React from 'react';
import { 
  PlusCircle, 
  HandCoins, 
  Music, 
  Utensils, 
  Scissors, 
  ShoppingBag,
  Bed,
  Moon,
  Briefcase,
  Home,
  Car,
  Coffee
} from 'lucide-react';

const CATEGORIES = [
  { icon: PlusCircle, label: 'Medical Emergency' },
  { icon: HandCoins, label: 'Instant Loan' },
  { icon: Music, label: 'Arts & Culture' },
  { icon: Utensils, label: 'Restaurants' },
  { icon: Scissors, label: 'Health & Beauty' },
  { icon: ShoppingBag, label: 'Shopping' },
  // { icon: Bed, label: 'Hotels & Travel' },
  // { icon: Moon, label: 'Nightlife' },
  // { icon: Home, label: 'Real Estate' },
  // { icon: Car, label: 'Automotive' },
  // { icon: Briefcase, label: 'Services' },
  // { icon: Coffee, label: 'Bars & Cafes' },
];

export const CategoryStrip: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-100 shadow-sm relative z-20 -mt-6 sm:-mt-8 mx-auto w-full rounded-xl px-2 sm:px-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 items-start py-3 gap-y-6">
        {CATEGORIES.map((cat, idx) => (
          <div key={idx} className="flex flex-col whitespace-nowrap items-center group cursor-pointer p-2 transition-transform hover:-translate-y-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-200 flex items-center justify-center mb-2 sm:mb-3 group-hover:border-blue-500 group-hover:bg-blue-50 group-hover:text-blue-600 text-gray-400 transition-all">
              <cat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-wider text-gray-500 group-hover:text-gray-900 text-center leading-tight max-w-[100px]">
              {cat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};