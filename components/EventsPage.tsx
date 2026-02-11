
import React from 'react';
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
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowRight,
  Heart,
  BarChart2,
  ArrowDown,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';

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

const EVENT_DATA = Array(8).fill(null).map((_, i) => ({
  id: i,
  title: 'Feng Shui Monthly Energy Shift Workshop',
  date: '10 sept, 2002',
  location: 'Lagos, Nigeria',
  price: i === 1 ? 'Free' : 'Starts At N30,000',
  img: [
    'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop'
  ][i % 4]
}));

export const EventsPage: React.FC = () => {
  return (
    <div className="flex bg-[#fcfcfc] min-h-screen">
      {/* Category Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-gray-100 bg-[#f9fafb] flex-col sticky top-24 h-[calc(100vh-96px)]">
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4 space-y-1">
            {CATEGORIES.map((cat, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-4 px-6 py-4 rounded-lg cursor-pointer transition-all hover:bg-white hover:shadow-sm group"
              >
                <cat.icon className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors">
                  {cat.label}
                </span>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-8 lg:px-12 py-6 sm:py-10 space-y-8 sm:space-y-12">
        
        {/* Header Row - Stacked on Mobile */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-12">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 flex-1">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Type a keyword to search" 
                className="w-full bg-white border border-gray-200 rounded-lg px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium outline-none focus:border-gray-400 transition-all shadow-sm"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 sm:hidden" />
            </div>
            <button className="bg-[#2d2d2d] hover:bg-black text-white px-6 sm:px-10 py-3 sm:py-4 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-lg transition-all">
              SEARCH
            </button>
          </div>
          
          <button className="bg-[#ff4500] hover:bg-orange-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 transform active:scale-95 transition-all">
            CREATE EVENT
          </button>
        </div>

        {/* Featured Banner Section */}
        <section 
          className="relative rounded-2xl overflow-hidden shadow-sm min-h-[400px] sm:min-h-[500px] border border-gray-100"
          style={{
            backgroundImage: `url('https://communitycra.vercel.app/static/media/banner.232e74bf9e2c596c4201.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute top-6 sm:top-10 -left-12 w-48 bg-[#ff0000] text-white py-1.5 flex items-center justify-center -rotate-45 text-[9px] sm:text-[11px] font-black uppercase tracking-tighter shadow-md z-20">
            TODAY'S EVENT
          </div>

          <div className="relative flex flex-col lg:flex-row h-full">
            <div className="w-full lg:w-[60%] p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative z-10">
              <div className="mb-6 sm:mb-8">
                 <img src="https://via.placeholder.com/150x50?text=COMPANY+LOGO" className="h-4 sm:h-6 opacity-30 mb-6 sm:mb-10" alt="Logo" />
                 <h2 className="text-4xl sm:text-8xl font-black text-[#2d2d2d] tracking-tighter leading-[0.85] mb-1 sm:mb-2 uppercase">MUSIC</h2>
                 <h2 className="text-4xl sm:text-8xl font-black text-[#2d2d2d] tracking-tighter leading-[0.85] mb-4 sm:mb-6 uppercase">EVENTS</h2>
                 <p className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] text-gray-500 mb-8 sm:mb-12">LIVE IN CONCERT</p>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-6 sm:gap-10 mb-8 sm:mb-10">
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black text-[#111] uppercase">CANDLESTICK PARK</span>
                  <span className="text-sm sm:text-xl font-bold text-gray-400">Sample Location, Lagos</span>
                </div>
                <div className="hidden md:block h-12 w-[2px] bg-gray-200"></div>
                <div className="flex flex-col">
                  <span className="text-base sm:text-xl font-black italic text-gray-800">Ticket Info :</span>
                  <span className="text-sm sm:text-lg font-medium text-gray-500 underline decoration-gray-300">www.yourinfo.com</span>
                </div>
              </div>

              <p className="text-sm sm:text-lg text-gray-500 leading-relaxed font-medium mb-8 sm:mb-12 max-w-lg">
                Lorem ipsum dolor sit amet, consectetuer adipiscing, nonummy nibh euismod tincidunt ut laoreet
              </p>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#333] flex items-center justify-center text-white cursor-pointer hover:bg-black transition-all">
                   <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white"></div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 flex items-center justify-center text-white cursor-pointer hover:bg-blue-700 transition-all">
                   <Facebook className="w-3 h-3 sm:w-4 sm:h-4 fill-white" />
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-sky-500 flex items-center justify-center text-white cursor-pointer hover:bg-sky-600 transition-all">
                   <Twitter className="w-3 h-3 sm:w-4 sm:h-4 fill-white" />
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-600 flex items-center justify-center text-white cursor-pointer hover:bg-black transition-all">
                   <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
            </div>

            <div className="relative w-full lg:w-[40%] h-[200px] sm:h-[300px] lg:h-auto overflow-hidden">
               <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop" className="w-full h-full object-cover grayscale-[0.1]" alt="Featured Event" />
               <button className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-all">
                 <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
               </button>
               <button className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-all">
                 <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
               </button>
            </div>
          </div>
        </section>

        {/* Popular Events */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Popular Events In Lagos</h2>
              <p className="text-xs sm:text-sm font-bold text-gray-400 mt-0.5 sm:mt-1">Top events of the week</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer self-start sm:self-auto">
              <span className="font-southern text-2xl sm:text-4xl text-black">Scroll Down</span>
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-blue-500 flex items-center justify-center group-hover:bg-blue-500 transition-all">
                 <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 group-hover:text-white animate-bounce" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {EVENT_DATA.map((event, idx) => <EventCard key={idx} {...event} />)}
          </div>
        </section>

        {/* webinars, this weekend etc... simplified padding for mobile */}
        {/* ... similar patterns applied for consistency ... */}
        
      </main>
    </div>
  );
};

const EventCard = ({ title, date, location, price, img }: any) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100/50 group cursor-pointer hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-500">
    <div className="relative aspect-[1.4/1] overflow-hidden">
      <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={title} />
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-2">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-gray-400 shadow-sm hover:text-blue-600 transition-all">
          <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-gray-400 shadow-sm hover:text-red-500 transition-all">
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
      </div>
    </div>
    <div className="p-4 sm:p-6">
      <h3 className="text-sm sm:text-base font-black text-gray-800 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.4rem] sm:min-h-[2.8rem] leading-snug">{title}</h3>
      <div className="space-y-1 text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
        <p>{date}</p>
        <p>{location}</p>
        <div className="pt-2 sm:pt-3 border-t border-gray-50 mt-3 sm:mt-4 text-gray-800">
          Ticket Price : <span className={`${price === 'Free' ? 'text-emerald-500' : 'text-[#ff4500]'}`}>{price}</span>
        </div>
      </div>
    </div>
  </div>
);
