
import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Gamepad2, 
  Activity, 
  CalendarDays, 
  Music, 
  UtensilsCrossed, 
  Code2, 
  Globe, 
  Shirt, 
  Theater, 
  Trophy, 
  Presentation, 
  MoreHorizontal,
  Search,
  Heart,
  Share2,
  BarChart2,
  ChevronUp
} from 'lucide-react';
import { EVENTS_DATA } from '../data/eventsData';

const CATEGORIES = [
  { icon: Briefcase, label: 'Business' },
  { icon: Gamepad2, label: 'Gaming' },
  { icon: Activity, label: 'Health & Wellness' },
  { icon: CalendarDays, label: 'Festivals' },
  { icon: Music, label: 'Music' },
  { icon: UtensilsCrossed, label: 'Food & Drinks' },
  { icon: Code2, label: 'Hackathons' },
  { icon: Globe, label: 'Virtual Events' },
  { icon: Shirt, label: 'Fashion Show' },
  { icon: Theater, label: 'Comedy' },
  { icon: Trophy, label: 'Sports' },
  { icon: Presentation, label: 'Webinar' },
  { icon: MoreHorizontal, label: 'Other Categories' },
];

export const EventsPage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const totalEvents = EVENTS_DATA.length;
  const visibleEvents = EVENTS_DATA.slice(0, visibleCount);
  const hasMore = visibleCount < totalEvents;
  const canShowLess = visibleCount > 6;

  // Show floating back to top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadMoreEvents = () => {
    setVisibleCount(prev => Math.min(prev + 6, totalEvents));
  };

  const showLess = () => {
    setVisibleCount(6);
    // Scroll to top of events
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex bg-white min-h-screen">
      {/* Category Sidebar */}
      <aside className="hidden lg:flex w-56 border-r border-gray-100 flex-col sticky top-0 h-screen bg-[#fafafa]">
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-3 space-y-0.5">
            {CATEGORIES.map((cat, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-colors hover:bg-white group"
              >
                <cat.icon className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">
                  {cat.label}
                </span>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 px-6 sm:px-10 py-8 space-y-10">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Type a keyword to search" 
                className="w-full bg-white border border-gray-200 rounded-md px-4 py-3 text-sm font-medium outline-none focus:border-gray-400 transition-colors"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            </div>
            <button className="bg-[#2d2d2d] hover:bg-black text-white px-8 py-3 rounded-md text-xs font-bold uppercase tracking-wide transition-colors">
              SEARCH
            </button>
          </div>
          
          <button className="bg-[#ff4500] hover:bg-orange-600 text-white px-10 py-3 rounded-md text-xs font-black uppercase tracking-wide transition-colors">
            CREATE EVENT
          </button>
        </div>

        {/* Featured Banner Section */}
        <section 
          className="relative rounded-lg overflow-hidden min-h-[440px] border border-gray-100"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1600&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute top-8 -left-10 w-48 bg-[#ff0000] text-white py-1 flex items-center justify-center -rotate-45 text-[10px] font-black uppercase tracking-tight shadow-md">
            TODAY'S EVENT
          </div>

          <div className="relative flex flex-col lg:flex-row h-full backdrop-brightness-75">
            <div className="w-full lg:w-[55%] p-12 lg:p-16 flex flex-col justify-center relative z-10 bg-white/90">
              <div className="mb-8">
                 <h2 className="text-7xl font-black text-[#2d2d2d] tracking-tighter leading-[0.9] mb-1 uppercase">MUSIC</h2>
                 <h2 className="text-7xl font-black text-[#2d2d2d] tracking-tighter leading-[0.9] mb-6 uppercase">EVENTS</h2>
                  <p className="text-sm font-bold uppercase tracking-[0.35em] text-gray-500">LIVE IN CONCERT</p>
              </div>

              <div className="flex flex-col gap-4 mb-10">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-[#111] uppercase">CANDLESTICK PARK</span>
                  <span className="text-lg font-medium text-gray-500">Sample Location, Lagos</span>
                </div>
              </div>

              <p className="text-base text-gray-600 leading-relaxed font-normal mb-10 max-w-lg">
                Lorem ipsum dolor sit amet, consectetuer adipiscing, sed diam nonummy nibh euismod tincidunt ut laoreet
              </p>

              <div className="flex flex-col gap-2">
                <span className="text-lg font-black italic text-gray-800">Ticket Info :</span>
                <span className="text-base font-medium text-gray-500 underline">www.yourinfo.com</span>
              </div>
            </div>

            <div className="relative w-full lg:w-[45%] h-[250px] lg:h-auto overflow-hidden">
               <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Featured Event" />
            </div>
          </div>
        </section>

        {/* Popular Events */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Popular Events In Lagos</h2>
              <p className="text-sm font-medium text-gray-400">Top events of the week</p>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <span className="font-southern text-3xl text-black">Scroll Down</span>
              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
                 <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>

          {/* Load More Section */}
          <div className="mt-14 text-center space-y-5">
            <p className="text-sm font-medium text-gray-600">
              You have viewed {visibleCount} out of {totalEvents}
            </p>
            <div className="max-w-sm mx-auto h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#2563eb] transition-all duration-500"
                style={{ width: `${(visibleCount / totalEvents) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-center gap-4 pt-2 pb-16">
              {canShowLess && (
                <button 
                  onClick={showLess}
                  className="px-10 py-3.5 border-2 border-gray-300 text-gray-600 rounded-full text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-all duration-300"
                >
                  SHOW LESS
                </button>
              )}
              {hasMore && (
                <button 
                  onClick={loadMoreEvents}
                  className="px-12 py-3.5 border-2 border-[#111] rounded-full text-xs font-black uppercase tracking-wider hover:bg-[#111] hover:text-white transition-all duration-300"
                >
                  LOAD MORE EVENTS
                </button>
              )}
            </div>
          </div>
        </section>
        
      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-[#2563eb] hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        >
          <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  price: string;
  img: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, date, location, price, img }) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-shadow duration-300">
    <div className="relative aspect-[1.35/1] overflow-hidden">
      <img src={img} className="w-full h-full object-cover" alt={title} />
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-400 shadow hover:text-blue-600 transition-colors">
          <BarChart2 className="w-3.5 h-3.5" />
        </div>
        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-400 shadow hover:text-red-500 transition-colors">
          <Heart className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-sm font-black text-gray-800 mb-3 line-clamp-2 min-h-[2.5rem] leading-snug">{title}</h3>
      <div className="space-y-1 text-[11px] font-medium text-gray-400 uppercase">
        <p>{date}</p>
        <p className="line-clamp-1">{location}</p>
        <div className="pt-3 border-t border-gray-100 mt-3 text-gray-700">
          Ticket Price : <span className={`font-bold ${price === 'Free' ? 'text-emerald-600' : 'text-[#ff4500]'}`}>{price}</span>
        </div>
      </div>
    </div>
  </div>
);
