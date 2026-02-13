import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  ArrowRight,
  Heart,
  BarChart2
} from 'lucide-react';
import { EVENTS_DATA } from '../data/eventsData';

interface EventDetailPageProps {
  eventId: number;
  onBack: () => void;
  onEventClick?: (id: number) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ eventId, onBack, onEventClick }) => {
  const event = EVENTS_DATA.find(e => e.id === eventId);
  const [ticketCount, setTicketCount] = useState(1);
  
  // Design assets from instructions
  const HERO_IMAGE = "https://communitycra.vercel.app/static/media/eventbanner.8f131c5d46adc1b3ffcc.png";
  const EVENTS_IMAGE = "https://communitycra.vercel.app/static/media/abtevent.a9e2c54e4af4505034a7.png";

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <button onClick={onBack} className="text-blue-600 hover:underline">Back to Events</button>
        </div>
      </div>
    );
  }

  // Find related events
  const relatedEvents = EVENTS_DATA
    .filter(e => e.id !== event.id)
    .slice(0, 4);

  // Helper to parse date string "15 Feb, 2026"
  const getDateParts = (dateStr: string) => {
    const parts = dateStr.split(' ');
    return {
      day: parts[0] || '15',
      month: parts[1]?.replace(',', '') || 'OCT',
      year: parts[2] || '2026'
    };
  };

  const dateParts = getDateParts(event.date);

  return (
    <div className="bg-white min-h-screen font-sans text-black">
      
      {/* 1. HERO / TICKET SECTION */}
      <div className="w-full bg-white">
        <div className="container mx-auto ">
            <div className="flex flex-col lg:flex-row bg-white shadow-xl overflow-hidden border border-gray-100">
                {/* Left Side - Banner Image */}
                <div className="lg:w-[65%] w-full relative">
                    <img 
                      src={HERO_IMAGE} 
                      alt="Event Banner" 
                      className="w-full h-full object-cover min-h-[400px]"
                    />
                </div>

                {/* Right Side - Registration Info */}
                <div className="lg:w-[35%] w-full bg-white p-6 md:p-8 relative flex flex-col justify-between">
                    {/* Vertical Registration Text - Absolute positioned decor */}
                    <div className="hidden lg:flex absolute right-0 top-0 bottom-0 w-12 bg-[#222] text-white items-center justify-center overflow-hidden z-10">
                        <span className="transform rotate-90 whitespace-nowrap uppercase tracking-[0.2em] font-bold text-sm">Registration</span>
                    </div>
                    
                    <div className="pr-8">
                        {/* Date Badge */}
                        <div className="mb-4">
                            <p className="text-xs uppercase font-bold text-[#FF4500] mb-0">SATURDAY</p>
                            <h2 className="text-3xl font-black text-[#FF4500] uppercase leading-tight">
                                {dateParts.month} {dateParts.day}
                            </h2>
                        </div>

                        {/* Event Title/Venue */}
                        <h3 className="font-bold text-xs text-black uppercase mb-1 leading-relaxed tracking-wide">{event.location}</h3>
                        <p className="text-[#FF4500] font-bold text-xl mb-6">{event.time}</p>

                        {/* Pricing Table */}
                        <div className="mb-6">
                            <h4 className="font-bold text-[10px] text-gray-500 uppercase mb-2">PRICE/ TICKET</h4>
                            <div className="grid grid-cols-2 gap-3 text-[10px]">
                                <div className="border border-dashed border-gray-400 p-2">
                                    <span className="block text-black font-bold">REGULAR | <span className="text-[#FF4500]">5,000</span></span>
                                </div>
                                <div className="border border-dashed border-gray-400 p-2">
                                    <span className="block text-black font-bold">GOLD | <span className="text-[#FF4500]">1,000,000</span></span>
                                </div>
                                <div className="border border-dashed border-gray-400 p-2">
                                    <span className="block text-black font-bold">VIP | <span className="text-[#FF4500]">20,000</span></span>
                                </div>
                                <div className="border border-dashed border-gray-400 p-2">
                                    <span className="block text-black font-bold">PLATINUM | <span className="text-[#FF4500]">1,500,000</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Deadline */}
                        <div className="mb-8 border-t border-dotted border-gray-300 pt-4">
                            <h4 className="font-bold text-[10px] text-black uppercase mb-1">REGISTRATION DEADLINE</h4>
                            <p className="text-[#FF4500] font-bold text-lg">{event.date}</p>
                        </div>

                        {/* Action */}
                        <div className="flex items-center justify-between">
                            <button className="bg-[#1976D2] hover:bg-blue-700 text-white px-8 py-3 font-bold text-xs uppercase transition-colors shadow-sm rounded-sm">
                                BUY TICKET
                            </button>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-black">Any Question?</p>
                                <a href="mailto:support@mic.com" className="text-[10px] text-gray-500">support@mic.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-12">
            
            {/* LEFT SIDEBAR - DETAILS */}
            <div className="md:w-1/4 space-y-8">
                {/* Date and Time Group */}
                <div className="flex gap-3">
                    <div className="mt-1">
                        <Calendar className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-black mb-1">Date and time</h4>
                        <p className="text-xs text-black block">{event.date}</p>
                        <p className="text-xs text-black block">{event.time}</p>
                    </div>
                </div>

                {/* Location Group */}
                <div className="flex gap-3">
                    <div className="mt-1">
                        <MapPin className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-black mb-1">Location</h4>
                        <p className="text-xs text-black leading-relaxed">
                            {event.location}
                        </p>
                    </div>
                </div>
            </div>

            {/* MIDDLE CONTENT - DESCRIPTION */}
            <div className="md:w-3/4">
                <div className="mb-8 font-bold italic text-black text-sm pr-4">
                    {event.title} - Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </div>

                <h2 className="text-2xl font-black text-black mb-4">About this event</h2>
                <div className="text-sm text-black space-y-4 mb-8 leading-relaxed text-justify">
                    <p>{event.description}</p>
                </div>

                {/* Second Image (Event Atmosphere) */}
                <div className="mb-8">
                    <img 
                        src={EVENTS_IMAGE} 
                        alt="Event Atmosphere" 
                        className="w-full h-auto shadow-sm"
                    />
                </div>

                {/* Tags */}
                <div className="mb-8">
                    <h3 className="font-bold text-sm text-gray-800 mb-3">Event Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {event.tags && event.tags.map((tag) => (
                            <span key={tag} className="px-4 py-1.5 bg-gray-100 text-black text-xs rounded-full font-bold">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Share */}
                <div className="mb-12">
                     <h3 className="font-bold text-sm text-black mb-3">Share with friends</h3>
                     <div className="flex gap-4">
                        <button className="w-10 h-10 rounded-full border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                            <Facebook className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                            <Instagram className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                            <Twitter className="w-5 h-5" />
                        </button>
                     </div>
                </div>

                {/* Centered Info Block */}
                <div className="flex flex-col items-center justify-center border-t border-gray-200 pt-12 pb-12 space-y-8">
                    {/* Theme */}
                    <div className="text-center">
                        <h3 className="font-black text-lg text-black uppercase tracking-widest mb-2 border-b-2 border-gray-200 pb-1 inline-block">Event Theme</h3>
                        <p className="text-xs text-black font-bold block mt-2">at</p>
                        <h4 className="font-black text-lg text-black uppercase tracking-widest mt-2 border-b-2 border-gray-200 pb-1 inline-block">Event Address</h4>
                    </div>

                    {/* Organizer */}
                    <div className="text-center">
                         <h3 className="font-black text-lg text-black uppercase tracking-widest mb-2 border-b-2 border-gray-200 pb-1 inline-block">Organizer's Name</h3>
                         <p className="text-xs text-black mt-2 mb-6">{event.organizer || 'Lagos Community Events'}</p>
                         
                         <button className="bg-[#222] text-white px-8 py-3 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors">
                             CONTACT ORGANIZER
                         </button>
                    </div>
                </div>

            </div>
        </div>
      </div>

      {/* 3. RELATED EVENTS */}
      <div className="w-full bg-white border-t border-gray-100">
         <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-black text-black uppercase">Other Events You May Like</h2>
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="text-blue-400 hover:text-blue-600 transition-colors">
                        <span className="sr-only">See all</span>
                        <ArrowRight className="w-6 h-6 border border-blue-200 rounded-full p-1" />
                    </button>
                    <span className="font-cursive text-black text-lg italic">See All</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedEvents.map((item) => (
                    <div 
                      key={item.id} 
                      className="group cursor-pointer bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      onClick={() => onEventClick && onEventClick(item.id)}
                    >
                        <div className="relative h-48 overflow-hidden">
                             <img 
                               src={item.img} 
                               alt={item.title} 
                               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                             />
                             {/* Icons overlay - Removed background as per user preference for cleaner look */}
                             <div className="absolute bottom-2 right-2 flex flex-col gap-2">
                                <span className="bg-white/90 p-1.5 rounded-full shadow-sm">
                                    <BarChart2 className="w-3 h-3 text-black" />
                                </span>
                                <span className="bg-white/90 p-1.5 rounded-full shadow-sm">
                                    <Heart className="w-3 h-3 text-black" />
                                </span>
                             </div>
                        </div>
                        <div className="p-4 bg-white">
                            <h3 className="font-bold text-black text-xs mb-1 truncate">{item.title}</h3>
                            <div className="inline-block bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600 uppercase mb-2 rounded-sm">Workshop</div>
                            <div className="flex flex-col gap-0.5 mt-2">
                                <div className="text-xs text-gray-700 block">{item.date}</div>
                                <div className="text-xs text-gray-700 block">{item.location}</div>
                                <div className="text-xs text-[#FF4500] font-bold block mt-1">Ticket Price : {item.price}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </div>

    </div>
  );
};
