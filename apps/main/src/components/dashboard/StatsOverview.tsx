import React from 'react';
import { MapPin, Check, Clock, CalendarDays, CalendarClock, Eye, MessageSquare, Star } from 'lucide-react';

export const StatsOverview = () => {
  const STAT_CARDS = [
    { id: 1, value: '10', label: 'Published Listings', color: 'bg-blue-600', icon: (
      <div className="relative"><MapPin className="w-8 h-8" /><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-0.5"><Check className="w-3 h-3 text-blue-600" /></div></div>
    )},
    { id: 2, value: '5', label: 'Pending Listings', color: 'bg-pink-500', icon: (
      <div className="relative"><MapPin className="w-8 h-8" /><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-0.5"><Clock className="w-3 h-3 text-pink-500" /></div></div>
    )},
    { id: 3, value: '10', label: 'Published Events', color: 'bg-sky-400', icon: <CalendarDays className="w-8 h-8" /> },
    { id: 4, value: '10', label: 'Pending Events', color: 'bg-orange-500', icon: <CalendarClock className="w-8 h-8" /> },
    { id: 5, value: '5', label: 'Completed Orders', color: 'bg-[#ffb44a]', icon: <div className="border-2 border-white rounded p-0.5"><Check className="w-5 h-5" /></div> },
    { id: 6, value: '5', label: 'Total Views', color: 'bg-emerald-500', icon: <Eye className="w-8 h-8" /> },
    { id: 7, value: '5', label: 'Total Reviews', color: 'bg-purple-600', icon: (
      <div className="relative flex items-center justify-center"><MessageSquare className="w-8 h-8" /><div className="absolute inset-0 flex items-center justify-center pb-1"><Star className="w-3.5 h-3.5 fill-white text-white" /></div></div>
    )},
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {STAT_CARDS.map((card) => (
        <div key={card.id} className={`${card.color} rounded-xl p-6 md:p-8 text-white flex flex-col items-center justify-center text-center shadow-lg transition-transform hover:scale-[1.02] cursor-default min-h-[180px] md:min-h-[220px]`}>
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/40 flex items-center justify-center mb-4 md:mb-6 leading-none">{card.icon}</div>
          <span className="text-3xl md:text-4xl font-extrabold mb-1 md:mb-2 tracking-tight">{card.value}</span>
          <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest opacity-90">{card.label}</span>
        </div>
      ))}
    </div>
  );
};
