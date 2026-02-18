import React, { useState, useEffect, useCallback } from 'react';
import { 
  Utensils, 
  MapPin, 
  Phone, 
  Share2, 
  Heart, 
  MessageSquare, 
  Facebook, 
  Instagram, 
  Twitter,
  ChevronRight,
  ChevronLeft,
  Star,
  Upload,
  Check
} from 'lucide-react';
import { ClaimBusiness } from './ClaimBusiness';

interface ListingDetailProps {
  onBack: () => void;
}

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490474418645-177b35242d5f?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1574096079513-d8259312b785?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544145945-f904253d0c7b?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550966841-3ee3228186f7?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&auto=format&fit=crop',
];

export const ListingDetail: React.FC<ListingDetailProps> = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
  }, []);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const AMENITIES = [
    { name: 'Card Payment', available: true },
    { name: 'Wheelchair Accessibility', available: true },
    { name: 'Free Parking', available: false },
    { name: 'Science Museum', available: true },
    { name: 'Wi-Fi', available: true },
    { name: 'Retail and Dining', available: true },
    { name: 'Group Visits', available: false },
    { name: 'Pet Friendly', available: true },
    { name: 'Guided Tours', available: false },
    { name: 'Reservations', available: true },
    { name: 'Free Admission', available: true },
  ];

  const HOURS = [
    { day: 'Monday', time: 'Closed' },
    { day: 'Tuesday', time: '4:00am - 10:00pm' },
    { day: 'Wednesday', time: '4:00am - 10:00pm', current: true },
    { day: 'Thursday', time: '4:00am - 10:00pm' },
    { day: 'Friday', time: '4:00am - 10:00pm' },
    { day: 'Saturday', time: '4:00am - 7:30pm' },
    { day: 'Sunday', time: '6:30am - 7:30pm' },
  ];

  if (isClaiming) {
    return <ClaimBusiness onBack={() => setIsClaiming(false)} />;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Dynamic Hero Gallery Carousel */}
      <div 
        className="relative h-[500px] w-full overflow-hidden bg-gray-900 group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className="flex h-full transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1))}%)` }}
        >
          {GALLERY_IMAGES.map((img, idx) => (
            <div 
              key={idx} 
              className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] h-full border-r border-white/10 relative overflow-hidden"
            >
              <img 
                src={img} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                alt={`Gallery Image ${idx + 1}`} 
              />
              <div className="absolute inset-0 bg-black/5"></div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-4 rounded-full transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-4 rounded-full transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicator Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {GALLERY_IMAGES.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 transition-all duration-300 rounded-full ${currentIndex === idx ? 'w-8 bg-blue-500' : 'w-2 bg-white/40'}`}
            ></div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content (Left) */}
          <div className="w-full lg:w-[68%]">
            
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h1 className="text-5xl font-extrabold text-[#111] mb-6 tracking-tight">Oshey's Cafe & Bar</h1>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <Utensils className="w-4 h-4" />
                    <span>Bar & Cafe</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>1, Real Address, Lagos, Nigeria</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>08012345678</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:opacity-70 transition-all">
                  <Share2 className="w-4 h-4" /> share
                </button>
                <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-500 hover:opacity-70 transition-all">
                  <Heart className="w-4 h-4" /> save listing
                </button>
                <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#f59e0b] hover:opacity-70 transition-all">
                  <MessageSquare className="w-4 h-4" /> Leave a Review
                </button>
              </div>
            </div>

            {/* About Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-black text-[#111] mb-6">About Oshey's</h2>
              <p className="text-sm font-medium text-gray-500 leading-relaxed mb-4">
                Listing Description...Ut euismod ultricies sollicitudin. Curabitur sed dapibus nulla. Nulla eget iaculis lectus. Mauris ac maximus neque. Nam in mauris quis libero sodales eleifend. Morbi varius, nulla sit amet rutrum elementum, est elit finibus tellus, ut tristique elit risus at metus. 
              </p>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis Theme natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-16">
              <h2 className="text-2xl font-black text-[#111] mb-8">Available Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                {AMENITIES.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${item.available ? 'bg-blue-600 border-blue-600' : 'border-gray-200'}`}>
                      {item.available && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
                    </div>
                    <span className="text-xs font-bold text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-16">
              <h2 className="text-2xl font-black text-[#111] mb-6">Tags</h2>
              <div className="flex flex-wrap gap-4">
                {['Music', 'Bar', 'Cafe'].map((tag) => (
                  <span key={tag} className="bg-gray-100 px-6 py-2 rounded-lg text-xs font-bold text-gray-600">{tag}</span>
                ))}
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="mb-20">
              <h2 className="text-2xl font-black text-[#111] mb-8">Photo & Video Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-lg group">
                  <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Gallery Large" />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden shadow-lg group">
                    <img src="https://images.unsplash.com/photo-1574096079513-d8259312b785?w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Gallery Med 1" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="aspect-square rounded-xl overflow-hidden shadow-lg group">
                      <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Gallery Small 1" />
                    </div>
                    <div className="aspect-square rounded-xl overflow-hidden shadow-lg group">
                      <img src="https://images.unsplash.com/photo-1544145945-f904253d0c7b?w=400&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Gallery Small 2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-[#fcfcfc] border border-gray-100 rounded-2xl p-10">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                
                {/* Existing Review */}
                <div className="bg-[#2d2d2d] rounded-2xl p-8 text-white relative">
                  <div className="absolute top-6 left-6 font-serif italic text-2xl opacity-50">Patron's Review</div>
                  <div className="pt-12 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop" className="w-full h-full object-cover" alt="User" />
                      </div>
                      <div>
                        <div className="font-black">Customer Name</div>
                        <div className="text-xs text-white/50 font-bold">customername@sample.com</div>
                      </div>
                    </div>

                    {/* Ratings Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                       {['Ambience', 'Location', 'Service', 'Price'].map(m => (
                         <div key={m} className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-white/60">
                           <span>{m}</span>
                           <div className="flex gap-0.5">
                             {[1,2,3,4,5].map(s => <Star key={s} className={`w-2.5 h-2.5 ${s <= 4 ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-white/20'}`} />)}
                           </div>
                         </div>
                       ))}
                    </div>

                    <p className="text-sm font-medium text-white/70 leading-relaxed italic">
                      "Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Etiam ultricies nisi vel augue."
                    </p>
                    
                    <div className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 pt-4 border-t border-white/10">
                      September 1, 2022
                    </div>
                  </div>
                </div>

                {/* Write a Review Form */}
                <div>
                  <h3 className="text-2xl font-black text-[#111] mb-8">Write a Review</h3>
                  
                  {/* Rating Scales */}
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6 mb-12">
                    {['Ambience', 'Location', 'Service', 'Price'].map((label) => (
                      <div key={label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-widest text-gray-400">{label}</span>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-gray-200 cursor-pointer hover:text-amber-400" />)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                    <input type="text" placeholder="Title of your Review" className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all placeholder:text-gray-300" />
                    <input type="text" placeholder="Full Name" className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all placeholder:text-gray-300" />
                    <input type="email" placeholder="Email Address" className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all placeholder:text-gray-300" />
                    
                    <textarea placeholder="Your Review" className="w-full bg-white border border-gray-100 rounded-xl p-5 text-sm font-bold h-32 outline-none focus:border-blue-600 transition-all placeholder:text-gray-300"></textarea>

                    <div className="border-2 border-dashed border-blue-600 rounded-xl p-6 flex items-center justify-center gap-4 cursor-pointer hover:bg-blue-50/50 transition-all">
                      <Upload className="w-6 h-6 text-blue-600" />
                      <span className="text-xs font-bold text-gray-500">
                        <span className="text-blue-600 underline">Upload</span> or Drag & Drop images
                      </span>
                    </div>

                    <div className="flex items-center gap-3 py-2">
                      <input type="checkbox" id="save-info" className="w-4 h-4 rounded text-blue-600 border-gray-200" />
                      <label htmlFor="save-info" className="text-xs font-bold text-gray-500">Save my name and email for the next time I comment.</label>
                    </div>

                    <button className="bg-[#2563eb] hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all">
                      SUBMIT REVIEW
                    </button>
                  </form>
                </div>

              </div>
            </div>

          </div>

          {/* Sidebar (Right) */}
          <aside className="w-full lg:w-[32%] space-y-8">
            
            {/* Contact Information */}
            <div className="bg-[#fcfcfc] border border-gray-100 rounded-2xl p-10">
              <h3 className="text-xl font-black text-[#111] mb-8">Contact Information</h3>
              <div className="space-y-8">
                <div className="text-sm font-bold text-gray-500 leading-relaxed">
                  #1, Sample Address, Location, Lagos
                </div>
                <div className="text-sm font-black text-[#111]">0903456532</div>
                <div className="text-sm font-bold text-gray-500">info@email.com</div>
                <div className="text-sm font-bold text-blue-600 underline">https://www.mylagoscommunity.com</div>
                
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all">
                    <Instagram className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all">
                    <Twitter className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-[#fcfcfc] border border-gray-100 rounded-2xl p-10">
              <h3 className="text-xl font-black text-[#111] mb-8">Business Hours</h3>
              <div className="space-y-4">
                {HOURS.map((h, i) => (
                  <div key={i} className={`flex items-center justify-between text-xs font-bold ${h.current ? 'text-blue-600' : 'text-gray-500'}`}>
                    <span>{h.day}</span>
                    <span>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-[#fcfcfc] border border-gray-100 rounded-2xl p-10">
              <h3 className="text-xl font-black text-[#111] mb-4">Price range</h3>
              <div className="text-sm font-bold text-gray-500">N5,000.00 - N25,000</div>
              
              <div className="space-y-4 mt-8">
                <button className="w-full bg-[#2563eb] hover:bg-blue-700 text-white py-4 rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-500/10 transition-all">
                  CONTACT THIS BUSINESS
                </button>
                <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-[#111] py-4 rounded-lg font-black text-xs uppercase tracking-[0.2em] transition-all">
                  GET DIRECTION
                </button>
              </div>
            </div>

            {/* Ratings Summary */}
            <div className="bg-[#fcfcfc] border border-gray-100 rounded-2xl p-10 text-center">
              <h3 className="text-xl font-black text-[#111] mb-8 text-left">Business Ratings</h3>
              <div className="mb-8">
                <div className="text-5xl font-black text-blue-600 mb-2">8.7</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">superb</div>
                <div className="text-xs font-bold text-gray-400">21 Reviews</div>
              </div>

              <div className="space-y-6">
                {[
                  { label: 'Ambience', score: 84 },
                  { label: 'Service', score: 90 },
                  { label: 'Location', score: 85 },
                  { label: 'Ambience', score: 84 },
                  { label: 'Price', score: 90 },
                ].map((metric, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-black text-[#111] uppercase tracking-wider">
                      <span>{metric.label}</span>
                      <span>{metric.score}%</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${metric.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-100 text-left">
                <p className="text-sm font-bold text-gray-900 mb-4 leading-relaxed">Claim your free business page to have your changes published immediately.</p>
                <button onClick={() => setIsClaiming(true)} className="text-sm font-black text-blue-600 hover:underline">Claim this business</button>
              </div>
            </div>

            {/* Sponsored Ad */}
            <div className="bg-[#fcfcfc] border border-gray-100 rounded-2xl p-10">
              <h3 className="text-xl font-black text-[#111] mb-8">Sponsored Ads</h3>
              <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm group cursor-pointer">
                <div className="relative h-40">
                  <img src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=400&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="Ad" />
                  <div className="absolute top-4 -left-8 w-32 py-1 flex items-center justify-center -rotate-45 text-[10px] font-black text-white bg-red-500 uppercase tracking-tighter shadow-sm">CLOSED</div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-black text-[#111] mb-2">Listing Name</h4>
                  <p className="text-[11px] font-bold text-gray-400 leading-relaxed">
                    Aliquam lorem ante, dapibus in viverra quis, feugiat tellus nulla ut metus varius.
                  </p>
                </div>
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
};
