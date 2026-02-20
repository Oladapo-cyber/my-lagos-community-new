import React from 'react';
import { 
  Utensils, 
  Heart, 
  Wrench, 
  Coffee, 
  ShoppingBag,
  Hotel,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Category {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

const CATEGORIES: Category[] = [
  { icon: Utensils, label: 'Restaurants', value: 'Restaurants' },
  { icon: Heart, label: 'Health & Beauty', value: 'Health & Beauty' },
  { icon: Wrench, label: 'Services', value: 'Services' },
  { icon: Coffee, label: 'Bars & Cafes', value: 'Bars & Cafes' },
  { icon: ShoppingBag, label: 'Shopping', value: 'Shopping' },
  { icon: Hotel, label: 'Hotels & Travel', value: 'Hotels & Travel' },
];

export const CategoryStrip: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/listings?category=${encodeURIComponent(category)}`);
  };
  return (
    <div className="bg-white border-b border-gray-100 shadow-sm relative z-20 -mt-6 sm:-mt-8 mx-auto w-full rounded-xl px-2 sm:px-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 items-start py-3 gap-y-6">
        {CATEGORIES.map((cat, idx) => (
          <div 
            key={idx} 
            onClick={() => handleCategoryClick(cat.value)}
            className="flex flex-col whitespace-nowrap items-center group cursor-pointer p-2 transition-transform hover:-translate-y-1"
          >
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