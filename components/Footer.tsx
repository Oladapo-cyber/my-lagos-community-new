
import React from 'react';
import { ChevronUp } from 'lucide-react';
import mlcLogo from '../assets/mlcviewer.png';

export const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* Main Dark Footer */}
      <footer className="bg-[#121010] text-white py-16 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <img src={mlcLogo} alt="My Lagos Community" className="h-10 w-[110px] self-center" />
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              We're proud to support businesses in the communities in which we work. 
              This directory is for local businesses wishing to advertise to our workforce. 
              Shop local and explore all that Lagos has to offer.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Explore</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors duration-200">All Inclusive</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Arts & Crafts</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Nightlife</a></li>
            </ul>
          </div>

          {/* Users */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Users</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Join MLC</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Sign In</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">How It Works</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors duration-200">About MLC</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Locations</a></li>
            </ul>
          </div>
        </div>

        {/* Floating Return to Top */}
        <button 
          onClick={scrollToTop}
          aria-label="Back to top"
          className="absolute bottom-8 right-8 sm:right-12 bg-blue-600 hover:bg-blue-700 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group shadow-lg"
        >
          <ChevronUp className="w-5 h-5 text-white group-hover:-translate-y-0.5 transition-transform duration-300" />
        </button>
      </footer>

      {/* Light Sub-Footer Bar */}
      <div className="bg-gray-100 px-4 sm:px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#303030] font-medium">
            © {new Date().getFullYear()} My Lagos Community, All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-[#303030] font-medium">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <span className="mx-1">|</span>
            <a href="#" className="hover:underline">Terms and Conditions</a>
          </div>
        </div>
      </div>
    </>
  );
};
