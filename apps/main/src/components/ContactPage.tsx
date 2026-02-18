
import React from 'react';
import { 
  ArrowDown, 
  Facebook, 
  Instagram, 
  Twitter,
  Mail,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Contact Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1541447271487-09612b3f49f7?w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover" 
            alt="Lagos Night Skyline" 
          />
          <div className="absolute inset-0 bg-blue-900/40 backdrop-brightness-75"></div>
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
            Our doors are <br /> always open!
          </h1>
          <div className="flex flex-col items-center gap-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center">
                 <ArrowDown className="w-5 h-5 text-white animate-bounce" />
               </div>
               <span className="font-southern text-4xl text-white/90">Drop us a message</span>
             </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section 
        className="py-24 px-6 relative"
        style={{
          backgroundColor: '#f9fafb',
          backgroundImage: `url('https://communitycra.vercel.app/static/media/testimonial-bg.c8ade2e3b78e6414590c.png')`,
          backgroundSize: '800px',
          backgroundRepeat: 'repeat'
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[600px]">
            
            {/* Left Column: Contact Info */}
            <div className="w-full lg:w-[40%] bg-[#2d2d2d] p-12 lg:p-16 text-white flex flex-col">
              <h2 className="text-4xl font-southern italic mb-16">Contact Info</h2>
              
              <div className="space-y-12 flex-1">
                {/* Working Hours */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 flex items-center justify-center text-white/50">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight">Working Hours</h3>
                  </div>
                  <p className="text-white/60 text-sm font-medium pl-10 leading-relaxed">
                    Monday - Friday | 9:00AM - 6:00PM
                  </p>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 flex items-center justify-center text-white/50">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight">Address</h3>
                  </div>
                  <p className="text-white/60 text-sm font-medium pl-10 leading-relaxed max-w-xs">
                    Unit 6, Business Complex, 189, Sample Road-State, Nigeria. 102110
                  </p>
                </div>

                {/* Contact */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 flex items-center justify-center text-white/50">
                      <Mail className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight">Contact</h3>
                  </div>
                  <div className="pl-10 space-y-1">
                    <p className="text-white/60 text-sm font-medium">Email: hello@waleslistings.com</p>
                    <p className="text-white/60 text-sm font-medium">+234123456853</p>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="flex items-center gap-4 mt-16 pt-8 border-t border-white/10">
                <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#2d2d2d] transition-all">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#2d2d2d] transition-all">
                  <Instagram className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#2d2d2d] transition-all">
                  <Twitter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="w-full lg:w-[60%] p-12 lg:p-16 bg-white">
              <h2 className="text-3xl font-extrabold text-[#111] mb-4">How can we help?</h2>
              <p className="text-gray-500 text-sm font-medium mb-12 max-w-md">
                Fill out this form so that we can learn more about you and your needs...
              </p>

              <form className="space-y-8" onSubmit={e => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Full Name *</label>
                  <input 
                    type="text" 
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all placeholder:text-gray-200" 
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Email Address *</label>
                  <input 
                    type="email" 
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all placeholder:text-gray-200" 
                    placeholder="example@mail.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Phone Number *</label>
                  <input 
                    type="tel" 
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all placeholder:text-gray-200" 
                    placeholder="+234..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Subject *</label>
                  <input 
                    type="text" 
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all placeholder:text-gray-200" 
                    placeholder="What is this about?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Message *</label>
                  <textarea 
                    className="w-full border-b border-gray-100 py-3 text-sm font-bold outline-none focus:border-blue-600 transition-all min-h-[100px] resize-none placeholder:text-gray-200" 
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <div className="pt-8">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all transform active:scale-95">
                    SEND MESSAGE
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
