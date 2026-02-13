import React from 'react';
import { Search, Home, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onReturnHome: () => void;
}

/**
 * Generic 404 page. Does NOT mention admin, dashboard, or roles.
 * Used when unauthorized users hit protected routes — returns 404,
 * not "Access Denied", to prevent confirming that protected resources exist.
 */
export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onReturnHome }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f9fafb] px-6">
      <div className="max-w-md w-full text-center">
        {/* 404 Visual */}
        <div className="relative mb-8">
          <div className="text-[140px] md:text-[180px] font-black text-gray-100 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
              <Search className="w-10 h-10 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          <br />
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onReturnHome}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#2563eb] hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-gray-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
