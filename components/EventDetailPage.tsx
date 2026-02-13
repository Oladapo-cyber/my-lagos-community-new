
import React from 'react';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  ArrowLeft, 
  Heart,
  Share2,
  ChevronRight,
  BarChart2,
  Ticket,
  Users,
  Star,
  ExternalLink
} from 'lucide-react';
import { EVENTS_DATA, EventData } from '../data/eventsData';

interface EventDetailPageProps {
  eventId: number;
  onBack: () => void;
  onEventClick?: (id: number) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ eventId, onBack, onEventClick }) => {
  const event = EVENTS_DATA.find(e => e.id === eventId);
  
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CalendarDays className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-500 mb-6">The event you're looking for doesn't exist.</p>
          <button onClick={onBack} className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-200">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const relatedEvents = EVENTS_DATA
    .filter(e => e.category === event.category && e.id !== event.id)
    .slice(0, 4);

  const additionalEvents = relatedEvents.length < 4 
    ? EVENTS_DATA.filter(e => e.id !== event.id && !relatedEvents.find(r => r.id === e.id)).slice(0, 4 - relatedEvents.length)
    : [];
  
  const allRelated = [...relatedEvents, ...additionalEvents];

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      
      {/* Immersive Hero Section */}
      <div className="relative h-[380px] sm:h-[460px] lg:h-[520px] overflow-hidden">
        <img 
          src={event.img} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl text-white text-sm font-semibold hover:bg-white/25 transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <button className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 hover:scale-105">
            <Heart className="w-5 h-5" />
          </button>
          <button className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 hover:scale-105">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-14">
          <div className="max-w-7xl mx-auto">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full mb-4">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-white/90 text-xs font-bold uppercase tracking-wider">{event.category}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 max-w-3xl drop-shadow-lg">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-5 text-white/80">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-300" />
                <span className="text-sm font-semibold">{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-300" />
                <span className="text-sm font-semibold">{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-300" />
                <span className="text-sm font-semibold">{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 -mt-8 relative z-10 mb-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Ticket Price</p>
                <p className={`text-xl font-black ${event.price === 'Free' ? 'text-emerald-500' : 'text-gray-900'}`}>
                  {event.price}
                </p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-100"></div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Attendees</p>
                <p className="text-xl font-black text-gray-900">150+</p>
              </div>
            </div>
          </div>
          <button className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5">
            Buy Ticket Now
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <div className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                <h2 className="text-xl font-black text-gray-900">About This Event</h2>
              </div>
              <p className="text-base text-gray-600 leading-[1.8] font-normal">{event.description}</p>
              <p className="text-base text-gray-600 leading-[1.8] font-normal mt-4">
                Join us for this amazing experience in the heart of Lagos. Don't miss out on what promises to be one of the most memorable events of the season. Whether you're a seasoned attendee or visiting for the first time, there's something for everyone.
              </p>
            </div>

            {/* Event Gallery Preview */}
            <div className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <h2 className="text-xl font-black text-gray-900">Event Gallery</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer">
                  <img src={event.img} alt="Gallery 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&auto=format&fit=crop" alt="Gallery 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="aspect-[4/3] rounded-xl overflow-hidden relative group cursor-pointer">
                  <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&auto=format&fit=crop" alt="Gallery 3" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-bold text-sm">View All</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
                <h2 className="text-xl font-black text-gray-900">Event Tags</h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {event.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-100/80 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-200 transition-all duration-300 cursor-pointer hover:shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
                <span className="px-5 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 rounded-xl text-xs font-bold border border-gray-200 hover:from-gray-100 hover:to-gray-150 transition-all duration-300 cursor-pointer hover:shadow-sm">
                  {event.category}
                </span>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-2xl p-7 sm:p-9 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 bg-gradient-to-b from-rose-500 to-red-500 rounded-full"></div>
                <h2 className="text-xl font-black text-gray-900">Share With Friends</h2>
              </div>
              <div className="flex items-center gap-3">
                <a href="#" className="w-12 h-12 rounded-xl bg-[#1877f2] flex items-center justify-center text-white hover:opacity-90 transition-all duration-300 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:-translate-y-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white hover:opacity-90 transition-all duration-300 shadow-lg shadow-pink-200/50 hover:shadow-xl hover:-translate-y-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white hover:opacity-90 transition-all duration-300 shadow-lg shadow-gray-300/50 hover:shadow-xl hover:-translate-y-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Date & Time Card */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <div className="p-6">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  Date & Time
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3.5 bg-blue-50/50 rounded-xl">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200/50">
                      <CalendarDays className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{event.date}</p>
                      <p className="text-xs text-gray-400 font-medium">Event Date</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3.5 bg-purple-50/50 rounded-xl">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-200/50">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{event.time}</p>
                      <p className="text-xs text-gray-400 font-medium">Start Time</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="h-1.5 bg-gradient-to-r from-rose-500 to-pink-500"></div>
              <div className="p-6">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  Location
                </h3>
                <div className="flex items-center gap-4 p-3.5 bg-rose-50/50 rounded-xl mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-200/50">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{event.location}</p>
                    <p className="text-xs text-gray-400 font-medium">Lagos, Nigeria</p>
                  </div>
                </div>
                {/* Map Placeholder */}
                <div className="rounded-xl overflow-hidden border border-gray-100 h-36 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 relative group cursor-pointer">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-xs font-bold text-blue-600 flex items-center gap-1">
                      View on Map <ExternalLink className="w-3 h-3" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
              <div className="p-6">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Organizer
                </h3>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200/50">
                    {event.organizer.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-900">{event.organizer}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                      <span className="text-xs text-gray-400 font-medium ml-1">5.0</span>
                    </div>
                  </div>
                </div>
                <button className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                  Contact Organizer
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200/50">
              <h3 className="font-black text-lg mb-2">Don't miss out!</h3>
              <p className="text-white/70 text-sm mb-5 leading-relaxed">Secure your spot before tickets sell out. Limited availability.</p>
              <button className="w-full py-3.5 bg-white text-blue-700 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-blue-50 transition-all duration-300 shadow-lg">
                Get Tickets Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Events */}
        {allRelated.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-7 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                <h2 className="text-2xl font-extrabold text-gray-900">You May Also Like</h2>
              </div>
              <button 
                onClick={onBack} 
                className="text-blue-600 hover:text-blue-700 text-sm font-bold transition-colors flex items-center gap-1 group"
              >
                See All
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {allRelated.map((relatedEvent) => (
                <div 
                  key={relatedEvent.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-xl hover:-translate-y-1.5 transition-all duration-400"
                  onClick={() => {
                    onEventClick?.(relatedEvent.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="relative aspect-[1.35/1] overflow-hidden">
                    <img src={relatedEvent.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={relatedEvent.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                    <h3 className="text-sm font-extrabold text-gray-800 mb-3 line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-blue-700 transition-colors">{relatedEvent.title}</h3>
                    <div className="space-y-1 text-[11px] font-medium text-gray-400 uppercase">
                      <p>{relatedEvent.date}</p>
                      <p className="line-clamp-1">{relatedEvent.location}</p>
                      <div className="pt-3 border-t border-gray-100 mt-3 text-gray-600">
                        Ticket Price : <span className={`font-bold ${relatedEvent.price === 'Free' ? 'text-emerald-500' : 'text-[#ff4500]'}`}>{relatedEvent.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
