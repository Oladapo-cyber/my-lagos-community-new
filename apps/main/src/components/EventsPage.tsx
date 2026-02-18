
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
  BarChart2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { EVENTS_DATA } from '../data/eventsData';

interface Category {
  icon: any;
  label: string;
  subcategories?: string[];
}

const CATEGORIES: Category[] = [
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
  { icon: Heart, label: 'Religious Events', subcategories: ['Christian', 'Islam'] },
  { icon: MoreHorizontal, label: 'Other Categories' },
];

interface EventsPageProps {
  onEventClick?: (id: number) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onEventClick }) => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const totalEvents = EVENTS_DATA.length;

  const filteredEvents = EVENTS_DATA.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (activeCategory) {
      if (activeCategory === 'Religious Events' && activeSubcategory) {
        matchesCategory = event.tags.includes(activeSubcategory);
      } else if (activeCategory !== 'Religious Events') {
        matchesCategory = event.category === activeCategory;
      } else {
        matchesCategory = event.category === activeCategory;
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEvents.length;
  const canShowLess = visibleCount > 8;

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadMoreEvents = () => {
    setVisibleCount(prev => Math.min(prev + 8, filteredEvents.length));
  };

  const showLess = () => {
    setVisibleCount(8);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = () => {
    setVisibleCount(8);
  };

  const handleCategoryClick = (categoryLabel: string, hasSubcategories: boolean) => {
    if (hasSubcategories) {
      // Toggle expansion for Religious Events
      setExpandedCategory(expandedCategory === categoryLabel ? null : categoryLabel);
      setActiveCategory(null);
      setActiveSubcategory(null);
    } else {
      // Normal category click
      setActiveCategory(activeCategory === categoryLabel ? null : categoryLabel);
      setExpandedCategory(null);
      setActiveSubcategory(null);
    }
  };

  const handleSubcategoryClick = (subcategory: string) => {
    setActiveSubcategory(activeSubcategory === subcategory ? null : subcategory);
    setActiveCategory('Religious Events');
  };

  return (
    <div className="flex bg-white min-h-screen">
      {/* Category Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-gray-100 flex-col sticky top-[72px] self-start max-h-[calc(100vh-72px)] bg-[#fafbfc]">
        <div className="p-5 border-b border-gray-100">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search For Listing" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-blue-400 transition-colors pr-10"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-0.5">
            {CATEGORIES.map((cat, idx) => (
              <div key={idx}>
                <div 
                  onClick={() => handleCategoryClick(cat.label, cat.subcategories ? cat.subcategories.length > 0 : false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group
                    ${(activeCategory === cat.label || expandedCategory === cat.label) 
                      ? 'bg-blue-50 border border-blue-100' 
                      : 'hover:bg-white hover:shadow-sm'
                    }`}
                >
                  <cat.icon className={`w-4 h-4 transition-colors
                    ${(activeCategory === cat.label || expandedCategory === cat.label) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}
                  `} />
                  <span className={`text-xs font-semibold transition-colors flex-1
                    ${(activeCategory === cat.label || expandedCategory === cat.label) ? 'text-blue-700' : 'text-gray-500 group-hover:text-gray-800'}
                  `}>
                    {cat.label}
                  </span>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedCategory === cat.label ? 'rotate-180' : ''} ${(activeCategory === cat.label || expandedCategory === cat.label) ? 'text-blue-600' : 'text-gray-400'}`} />
                  )}
                </div>
                
                {/* Subcategories */}
                {cat.subcategories && cat.subcategories.length > 0 && expandedCategory === cat.label && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {cat.subcategories.map((subcat, subIdx) => (
                      <div
                        key={subIdx}
                        onClick={() => handleSubcategoryClick(subcat)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 text-xs font-semibold
                          ${activeSubcategory === subcat
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${activeSubcategory === subcat ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                        {subcat}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 px-6 sm:px-10 py-8 space-y-10">
        
        {/* Mobile Search */}
        <div className="flex lg:hidden flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Type a keyword to search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:border-gray-400 transition-colors pr-10"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          </div>
          <button 
            onClick={handleSearch}
            className="bg-[#2d2d2d] hover:bg-black text-white px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"
          >
            SEARCH
          </button>
        </div>

        {/* Featured Banner Section */}
        <section 
          className="relative rounded-xl overflow-hidden min-h-[440px] border border-gray-100 shadow-sm"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1600&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute top-4 left-0 bg-[#ff0000] text-white px-5 py-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider shadow-lg z-20 rounded-r-md">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            TODAY'S EVENT
          </div>

          <div className="relative flex flex-col lg:flex-row h-full">
            <div className="w-full lg:w-[55%] p-10 lg:p-14 flex flex-col justify-center relative z-10 bg-white/95 backdrop-blur-sm">
              <div className="mb-6">
                 <h2 className="text-6xl lg:text-7xl font-black text-[#2d2d2d] tracking-tighter leading-[0.9] mb-1 uppercase">MUSIC</h2>
                 <h2 className="text-6xl lg:text-7xl font-black text-[#2d2d2d] tracking-tighter leading-[0.9] mb-5 uppercase">EVENTS</h2>
                  <p className="text-sm font-bold uppercase tracking-[0.35em] text-gray-400">LIVE IN CONCERT</p>
              </div>

              <div className="flex flex-col gap-3 mb-8">
                <div className="flex flex-col">
                  <span className="text-xl font-black text-[#111] uppercase">CANDLESTICK PARK</span>
                  <span className="text-base font-medium text-gray-400">Sample Location, Lagos</span>
                </div>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed font-normal mb-8 max-w-lg">
                Lorem ipsum dolor sit amet, consectetuer adipiscing, sed diam nonummy nibh euismod tincidunt ut laoreet
              </p>

              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-base font-black italic text-gray-700">Ticket Info :</span>
                  <span className="text-sm font-medium text-blue-500 underline">www.yourinfo.com</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <div className="w-8 h-8 rounded-full bg-[#1877f2] flex items-center justify-center text-white cursor-pointer hover:opacity-80 transition-opacity">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white cursor-pointer hover:opacity-80 transition-opacity">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white cursor-pointer hover:opacity-80 transition-opacity">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </div>
                </div>
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
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">Popular Events In Lagos</h2>
              <p className="text-sm font-medium text-gray-400">Top events of the week</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 group cursor-pointer">
              <span className="font-southern text-2xl lg:text-3xl text-black" style={{ fontFamily: "'Dancing Script', cursive" }}>Scroll Down</span>
              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-blue-400 transition-colors">
                 <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleEvents.map((event) => (
              <EventCard 
                key={event.id} 
                id={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                price={event.price}
                img={event.img}
                onClick={onEventClick}
              />
            ))}
          </div>

          {/* Load More Section */}
          <div className="mt-14 text-center space-y-5">
            <p className="text-sm font-medium text-gray-500">
              You have viewed {Math.min(visibleCount, filteredEvents.length)} out of {filteredEvents.length}
            </p>
            <div className="max-w-sm mx-auto h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${(Math.min(visibleCount, filteredEvents.length) / filteredEvents.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-center gap-4 pt-2 pb-16">
              {canShowLess && (
                <button 
                  onClick={showLess}
                  className="px-10 py-3.5 border-2 border-gray-200 text-gray-500 rounded-full text-xs font-black uppercase tracking-wider hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
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
          className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        >
          <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  location: string;
  price: string;
  img: string;
  onClick?: (id: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({ id, title, date, location, price, img, onClick }) => (
  <div 
    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    onClick={() => onClick?.(id)}
  >
    <div className="relative aspect-[1.35/1] overflow-hidden">
      <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={title} />
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-400 shadow-sm hover:text-blue-600 hover:bg-white transition-all">
          <BarChart2 className="w-3.5 h-3.5" />
        </div>
        <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-400 shadow-sm hover:text-red-500 hover:bg-white transition-all">
          <Heart className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-sm font-extrabold text-gray-800 mb-3 line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-blue-700 transition-colors">{title}</h3>
      <div className="space-y-1 text-[11px] font-medium text-gray-400 uppercase">
        <p>{date}</p>
        <p className="line-clamp-1">{location}</p>
        <div className="pt-3 border-t border-gray-100 mt-3 text-gray-600">
          Ticket Price : <span className={`font-bold ${price === 'Free' ? 'text-emerald-500' : 'text-[#ff4500]'}`}>{price}</span>
        </div>
      </div>
    </div>
  </div>
);
