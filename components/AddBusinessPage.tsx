import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  Mail, 
  Clock, 
  Camera, 
  Check,
  ChevronDown,
  Info
} from 'lucide-react';

const AMENITIES = [
  'Free Wi-Fi', 'Parking', 'Wheelchair Accessible', 'Card Payments', 
  'Pet Friendly', 'Outdoor Seating', 'Reservations', 'Delivery', 
  'Live Music', 'Smoking Area', 'Family Friendly', 'Bar'
];

const CATEGORIES = [
  'Medical Emergency',
  'Instant Loan',
  'Arts & Culture',
  'Restaurants',
  'Health & Beauty',
  'Shopping',
  'Hotels & Travel',
  'Nightlife',
  'Real Estate',
  'Automotive',
  'Services',
  'Bars & Cafes'
];

export const AddBusinessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://communitycra.vercel.app/static/media/banner.232e74bf9e2c596c4201.webp" 
            className="w-full h-full object-cover grayscale-[0.3] brightness-50" 
            alt="Lagos Business" 
          />
        </div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            List Your Business
          </h1>
          <p className="text-white/80 text-lg font-medium max-w-2xl mx-auto">
            Reach thousands of potential customers in the My Lagos Community. 
            Grow your brand with us.
          </p>
        </div>
      </section>

      {/* Form Content */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          
          <div className="p-10 md:p-16 space-y-16">
            
            {/* Section 1: Basic Information */}
            <div>
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Business Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter your business name"
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Business Category *</label>
                  <div className="relative">
                    <select className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer bg-transparent">
                      <option value="">Choose a category</option>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Business Description *</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us about your business, what makes you unique?"
                    className="w-full border border-gray-50 bg-gray-50/30 rounded-xl p-5 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Section 2: Contact Details */}
            <div>
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <Phone className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Contact Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="hello@business.com"
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Phone Number *</label>
                  <input 
                    type="tel" 
                    placeholder="+234..."
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Website URL (Optional)</label>
                  <input 
                    type="url" 
                    placeholder="https://www.yoursite.com"
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Address / Location *</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. Victoria Island, Lagos"
                      className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all pr-8"
                    />
                    <MapPin className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Media & Graphics */}
            <div>
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Camera className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Media & Graphics</h2>
              </div>

              <div className="space-y-6">
                <p className="text-xs font-bold text-gray-400 flex items-center gap-2">
                  <Info className="w-4 h-4" /> 
                  Upload high-quality images to showcase your business (Logo, Interior, Exterior).
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 hover:border-blue-200 transition-all group">
                      <Camera className="w-6 h-6 text-gray-300 group-hover:text-blue-500" />
                      <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-blue-500">
                        {i === 1 ? 'LOGO' : `PHOTO ${i-1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Amenities & Hours */}
            <div>
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-gray-50">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Amenities & Extras</h2>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 block mb-6">Select Available Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                    {AMENITIES.map(item => (
                      <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-200 bg-white checked:bg-blue-600 checked:border-blue-600 transition-all" />
                          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                            <Check className="w-3 h-3 stroke-[4px]" />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-500 group-hover:text-blue-600 transition-colors">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Opening Hours</label>
                    <input type="text" placeholder="e.g. 9:00 AM" className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Closing Hours</label>
                    <input type="text" placeholder="e.g. 10:00 PM" className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-10">
              <button 
                type="button"
                className="w-full bg-[#ff4500] hover:bg-orange-700 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.25em] shadow-2xl shadow-orange-500/30 transform active:scale-[0.98] transition-all"
              >
                SUBMIT BUSINESS LISTING
              </button>
              <p className="text-center text-[10px] font-bold text-gray-400 mt-6 uppercase tracking-widest">
                By submitting, you agree to our terms of service and privacy policy.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};