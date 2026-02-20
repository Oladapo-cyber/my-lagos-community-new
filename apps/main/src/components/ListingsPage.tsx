import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Phone,
  Heart,
  Maximize2,
  ShoppingBag,
  ChevronDown,
  Utensils,
  ChevronUp,
  Loader2,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { getAllBusinesses, getAllLGAs } from '../utils/apiClient';
import type { Business, GetAllBusinessesParams, LGA } from '../types';

// Category values must match the Xano enum exactly
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
  'Bars & Cafes',
];

const ITEMS_PER_PAGE = 20;

interface ListingsPageProps {
  onListingClick: (id: number) => void;
}

export const ListingsPage: React.FC<ListingsPageProps> = ({ onListingClick }) => {
  const [searchParams] = useSearchParams();

  // ── API state ────────────────────────────────────────────────────────────
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Pagination state ─────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [prevPage, setPrevPage] = useState<number | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  // ── Filter state ─────────────────────────────────────────────────────────
  // Initialise from URL query params so hero search flows straight through
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') ?? '');
  const [selectedLgaId, setSelectedLgaId] = useState<number | ''>(() => {
    const v = searchParams.get('lga_id');
    return v && !isNaN(Number(v)) ? Number(v) : '';
  });
  const [keyword, setKeyword] = useState(() => searchParams.get('keyword') ?? '');

  // ── LGA list for the sidebar ─────────────────────────────────────────────
  const [lgas, setLgas] = useState<LGA[]>([]);

  useEffect(() => {
    getAllLGAs()
      .then((resp) => {
        const raw = resp as unknown;
        const list =
          raw && typeof raw === 'object' && 'items' in (raw as object)
            ? (raw as { items: LGA[] }).items
            : Array.isArray(raw)
            ? (raw as LGA[])
            : [];
        setLgas(list);
      })
      .catch(() => {});
  }, []);

  // ── UI helpers ────────────────────────────────────────────────────────────
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Fetch businesses whenever page or filters change ─────────────────────
  const fetchBusinesses = useCallback(async (page: number, category: string, lgaId: number | '') => {
    setIsLoading(true);
    setError(null);

    try {
      const params: GetAllBusinessesParams = {
        page,
        per_page: ITEMS_PER_PAGE,
        ...(category ? { category } : {}),
        ...(lgaId !== '' ? { lga_id: lgaId } : {}),
      };

      const response = await getAllBusinesses(params, 'main');

      setBusinesses(response.items);
      setNextPage(response.nextPage);
      setPrevPage(response.prevPage);
      setTotalItems(response.itemsReceived);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load businesses.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses(currentPage, selectedCategory, selectedLgaId);
  }, [currentPage, selectedCategory, selectedLgaId, fetchBusinesses]);

  // ── Filter / pagination handlers ──────────────────────────────────────────
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleLgaChange = (lgaId: number | '') => {
    setSelectedLgaId(lgaId);
    setCurrentPage(1);
  };

  const handleFilterSubmit = () => {
    setCurrentPage(1);
    fetchBusinesses(1, selectedCategory, selectedLgaId);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // ── Client-side keyword filter applied on top of server results ───────────
  const displayedBusinesses = keyword.trim()
    ? businesses.filter(
        (b) =>
          b.name.toLowerCase().includes(keyword.toLowerCase()) ||
          b.description.toLowerCase().includes(keyword.toLowerCase()) ||
          b.address.toLowerCase().includes(keyword.toLowerCase()),
      )
    : businesses;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('restaurant') || lower.includes('bar') || lower.includes('cafe')) {
      return <Utensils className="w-3 h-3" />;
    }
    return <ShoppingBag className="w-3 h-3" />;
  };

  const getStatusStyle = (status: string) => {
    const lower = (status || '').toLowerCase();
    if (['open', 'open now'].includes(lower)) return 'bg-[#10b981]';
    if (['closed'].includes(lower)) return 'bg-[#ef4444]';
    return 'bg-gray-500';
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Listings Content (Left Side) ── */}
          <main className="w-full lg:w-[68%] order-2 lg:order-1">
            {/* Top Searchbar */}
            <div className="mb-8">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search listings by name, category, or location…"
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
              />
            </div>

            <h1 className="text-5xl font-extrabold text-[#111] mb-12 tracking-tight">Listings</h1>

            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 text-[#2563eb] animate-spin" />
                <span className="ml-3 text-sm font-bold text-gray-500">Loading businesses…</span>
              </div>
            )}

            {/* ── Error state ── */}
            {!isLoading && error && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <p className="text-sm font-bold text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => fetchBusinesses(currentPage, selectedCategory, selectedLgaId)}
                  className="px-8 py-3 bg-[#2563eb] text-white text-xs font-black uppercase tracking-wider rounded-full hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && displayedBusinesses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Building2 className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-sm font-bold text-gray-500">No businesses found.</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your filters.</p>
              </div>
            )}

            {/* Business cards grid */}
            {!isLoading && !error && displayedBusinesses.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedBusinesses.map((biz) => (
                    <div
                      key={biz.id}
                      onClick={() => onListingClick(biz.id)}
                      className="bg-white rounded-lg overflow-hidden shadow-sm group/card cursor-pointer border border-gray-100 hover:shadow-md transition-shadow duration-300"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        {biz.images && biz.images.length > 0 ? (
                          <img
                            src={biz.images[0]}
                            alt={biz.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="w-12 h-12 text-gray-300" />
                          </div>
                        )}

                        {/* Status ribbon — only when status is provided */}
                        {biz.status && (
                          <div
                            className={`absolute top-5 -left-8 w-36 py-1 flex items-center justify-center -rotate-45 text-[10px] font-black text-white uppercase tracking-tight shadow-sm ${getStatusStyle(biz.status)}`}
                          >
                            {biz.status}
                          </div>
                        )}

                        {/* Category badge */}
                        {biz.category && (
                          <div className="absolute top-3 right-3 bg-[#2563eb] text-white px-3 py-1.5 rounded-md text-[10px] font-black flex items-center gap-1.5 shadow-md uppercase tracking-wide">
                            {getCategoryIcon(biz.category)}
                            {biz.category}
                          </div>
                        )}
                      </div>

                      {/* Card body */}
                      <div className="p-5">
                        <h3 className="text-lg font-extrabold text-[#111] mb-1 line-clamp-1">{biz.name}</h3>
                        <p className="text-xs text-gray-400 font-medium mb-4 line-clamp-2">{biz.description}</p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-start gap-2 text-[11px] text-gray-500 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{biz.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                            <Phone className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                            <span>{biz.phoneNumber}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          {/* Approval badge */}
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              biz.approved
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            {biz.approved ? 'Verified' : 'Pending'}
                          </span>

                          <div className="flex items-center gap-4">
                            <Maximize2 className="w-4 h-4 text-gray-300 hover:text-[#2563eb] transition-colors cursor-pointer" />
                            <Heart className="w-4 h-4 text-gray-300 hover:text-red-500 transition-colors cursor-pointer" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Server-side pagination */}
                <div className="mt-16 text-center space-y-6">
                  <p className="text-sm font-bold text-gray-600">
                    Page {currentPage} · {totalItems} result{totalItems !== 1 ? 's' : ''}
                  </p>

                  <div className="flex items-center justify-center gap-4 pt-2 pb-16">
                    {prevPage !== null && (
                      <button
                        onClick={() => { setCurrentPage(prevPage!); scrollToTop(); }}
                        className="px-10 py-3.5 border-2 border-gray-300 text-gray-600 rounded-full text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-all duration-300"
                      >
                        ← Previous
                      </button>
                    )}
                    {nextPage !== null && (
                      <button
                        onClick={() => { setCurrentPage(nextPage!); scrollToTop(); }}
                        className="px-12 py-3.5 border-2 border-[#111] rounded-full text-xs font-black uppercase tracking-wider hover:bg-[#111] hover:text-white transition-all duration-300"
                      >
                        Load More →
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </main>

          {/* ── Filter Sidebar ── */}
          <aside className="w-full lg:w-[32%] space-y-6 order-1 lg:order-2">
            <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm sticky top-24">
              <h2 className="text-xl font-black text-[#111] mb-8">What are you looking for</h2>

              <div className="space-y-6">
                {/* Category Dropdown */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    CHOOSE CATEGORY
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 appearance-none focus:outline-none focus:border-[#2563eb] transition-colors cursor-pointer"
                    >
                      <option value="">All Categories</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Location Picker — LGA dropdown */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    CHOOSE LOCATION
                  </label>
                  <div className="relative">
                    <select
                      value={selectedLgaId}
                      onChange={(e) => handleLgaChange(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 appearance-none focus:outline-none focus:border-[#2563eb] transition-colors cursor-pointer"
                    >
                      <option value="">All Locations</option>
                      {lgas.map((lga) => (
                        <option key={lga.id} value={lga.id}>
                          {lga.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Open Toggle */}
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-bold text-[#111]">Open?</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
                  </label>
                </div>

                {/* Tags Checklist */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[#111]">Filter By Tags</label>
                  <div className="space-y-3">
                    {['Accessories', 'Agro', 'Arts', 'Bar', 'Breakfast', 'Brunch'].map((tag) => (
                      <label key={tag} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb] cursor-pointer"
                        />
                        <span className="text-xs font-medium text-gray-600">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleFilterSubmit}
                  disabled={isLoading}
                  className="w-full bg-[#2563eb] hover:bg-blue-700 disabled:opacity-60 text-white py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all mt-4 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching…
                    </>
                  ) : (
                    'FILTER RESULT'
                  )}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Back to Top */}
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