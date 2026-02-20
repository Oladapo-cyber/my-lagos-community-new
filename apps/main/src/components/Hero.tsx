
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllBusinesses, getAllLGAs } from '../utils/apiClient';
import type { Business, GetAllBusinessesParams, LGA } from '../types';

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

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  // ── Dropdown open/close ──────────────────────────────────────────────────
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // ── Filter values ────────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLga, setSelectedLga] = useState<LGA | null>(null);
  const [keyword, setKeyword] = useState('');
  const [lgaSearch, setLgaSearch] = useState('');

  // ── LGA list from API ────────────────────────────────────────────────────
  const [lgas, setLgas] = useState<LGA[]>([]);

  // ── Autocomplete ─────────────────────────────────────────────────────────
  const [autocompleteResults, setAutocompleteResults] = useState<Business[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const categoryRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const keywordRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch LGAs on mount
  useEffect(() => {
    getAllLGAs()
      .then((resp) => {
        // getAllLGAs returns LGAListResponse – unwrap items
        const raw = resp as unknown;
        const list =
          raw && typeof raw === 'object' && 'items' in (raw as object)
            ? (raw as { items: LGA[] }).items
            : (Array.isArray(raw) ? raw : []);
        setLgas(list);
      })
      .catch(() => {});
  }, []);

  // Close all dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node))
        setIsCategoryOpen(false);
      if (locationRef.current && !locationRef.current.contains(e.target as Node))
        setIsLocationOpen(false);
      if (keywordRef.current && !keywordRef.current.contains(e.target as Node))
        setShowAutocomplete(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced autocomplete: fires 350 ms after the user stops typing
  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const params: GetAllBusinessesParams = { per_page: 8 };
        if (selectedCategory) params.category = selectedCategory;
        if (selectedLga) params.lga_id = selectedLga.id;
        const res = await getAllBusinesses(params, 'main');
        const q = value.toLowerCase();
        const matched = res.items.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.description.toLowerCase().includes(q) ||
            b.address.toLowerCase().includes(q),
        );
        setAutocompleteResults(matched.slice(0, 6));
        setShowAutocomplete(matched.length > 0);
      } catch {
        setAutocompleteResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  // Navigate to listings page with applied filters
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedLga) params.set('lga_id', String(selectedLga.id));
    if (keyword.trim()) params.set('keyword', keyword.trim());
    navigate(`/listings?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clicking an autocomplete result navigates to listings filtered to that business name
  const handleAutocompleteSelect = (biz: Business) => {
    setShowAutocomplete(false);
    const params = new URLSearchParams();
    const cat = selectedCategory || biz.category;
    if (cat) params.set('category', cat);
    if (selectedLga) params.set('lga_id', String(selectedLga.id));
    params.set('keyword', biz.name);
    navigate(`/listings?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredLgas = lgaSearch.trim()
    ? lgas.filter((l) => l.name.toLowerCase().includes(lgaSearch.toLowerCase()))
    : lgas;

  return (
    <section className="relative min-h-screen lg:h-[90vh] w-full flex items-center justify-center xs:pt-1 md:pt-20 pb-10 md:pb-28 overflow-hidden">
      {/* Background Image with Deep Blue Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://communitycra.vercel.app/static/media/banner.232e74bf9e2c596c4201.webp"
          className="w-full h-full object-cover"
          alt="Lagos Banner"
        />
        <div className="absolute inset-0 bg-[#0a192f]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a192f]/20 to-[#0a192f]/80" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl w-full">
        {/* Heading */}
        <h1 className="text-[32px] sm:text-3xl md:text-[44px] mt-[10px] md:mt-[130px] p-[40px] font-black text-white mb-3 sm:mb-6 tracking-tighter leading-tight drop-shadow-2xl">
          Welcome to <span className="text-[#f59e0b]">Lagos!</span>
        </h1>

        {/* Sub-heading */}
        <p className="text-xs sm:text-lg md:text-[22px] md:whitespace-nowrap text-white/95 font-bold mb-8 sm:mb-14 tracking-tight leading-relaxed max-w-xl mx-auto drop-shadow-lg px-4">
          Let's discover some great adventures, explore all the popular
          <br className="hidden md:block" /> places, and discover the best spots in town.
        </p>

        {/* Search Bar Card */}
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl mx-auto w-full border border-white/20 p-2 md:p-1.5 mb-4 relative z-50">
          <div className="flex flex-col md:flex-row items-stretch md:items-center">

            {/* ── Category Dropdown ── */}
            <div ref={categoryRef} className="relative flex-1 w-full border-b md:border-b-0 md:border-r border-gray-100">
              <div
                onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsLocationOpen(false); }}
                className="p-2 sm:p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors h-full"
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-[7px] sm:text-[9px] uppercase font-black tracking-widest text-gray-400">Category</span>
                  <span className={`text-[10px] sm:text-xs font-bold truncate max-w-[120px] ${selectedCategory ? 'text-gray-900' : 'text-gray-500'}`}>
                    {selectedCategory || 'All Categories'}
                  </span>
                </div>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180 text-blue-500' : ''}`} />
              </div>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-[200px] overflow-y-auto z-[100] py-1 text-left">
                  <div
                    onClick={() => { setSelectedCategory(''); setIsCategoryOpen(false); }}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <span className={`text-[10px] font-bold ${!selectedCategory ? 'text-blue-600' : 'text-gray-500'}`}>All Categories</span>
                  </div>
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setIsCategoryOpen(false); }}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <span className={`text-[10px] font-bold ${selectedCategory === cat ? 'text-blue-600' : 'text-gray-500'}`}>{cat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Location / LGA Dropdown ── */}
            <div ref={locationRef} className="relative flex-1 w-full border-b md:border-b-0 md:border-r border-gray-100">
              <div
                onClick={() => { setIsLocationOpen(!isLocationOpen); setIsCategoryOpen(false); }}
                className="p-2 sm:p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors h-full"
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-[7px] sm:text-[9px] uppercase font-black tracking-widest text-gray-400">Location</span>
                  <span className={`text-[10px] sm:text-xs font-bold truncate max-w-[120px] ${selectedLga ? 'text-gray-900' : 'text-gray-500'}`}>
                    {selectedLga ? selectedLga.name : 'Pick a location'}
                  </span>
                </div>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isLocationOpen ? 'rotate-180 text-blue-500' : ''}`} />
              </div>

              {isLocationOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-[100] py-1 text-left">
                  {/* LGA search filter */}
                  <div className="px-3 pt-2 pb-1">
                    <input
                      type="text"
                      value={lgaSearch}
                      onChange={(e) => setLgaSearch(e.target.value)}
                      placeholder="Search LGA…"
                      className="w-full text-[10px] font-bold bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 placeholder:text-gray-300"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-[180px] overflow-y-auto">
                    <div
                      onClick={() => { setSelectedLga(null); setIsLocationOpen(false); setLgaSearch(''); }}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <span className={`text-[10px] font-bold ${!selectedLga ? 'text-blue-600' : 'text-gray-500'}`}>All Locations</span>
                    </div>
                    {lgas.length === 0 && (
                      <p className="px-3 py-2 text-[10px] text-gray-400">Loading locations…</p>
                    )}
                    {filteredLgas.map((lga) => (
                      <div
                        key={lga.id}
                        onClick={() => { setSelectedLga(lga); setIsLocationOpen(false); setLgaSearch(''); }}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <span className={`text-[10px] font-bold ${selectedLga?.id === lga.id ? 'text-blue-600' : 'text-gray-500'}`}>
                          {lga.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Keyword input + Autocomplete ── */}
            <div ref={keywordRef} className="relative flex-[1.5] w-full p-2 sm:p-3 flex items-center gap-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                onFocus={() => { if (autocompleteResults.length > 0) setShowAutocomplete(true); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                placeholder="Type a keyword…"
                className="w-full bg-transparent outline-none px-1 text-[10px] sm:text-xs font-bold text-gray-700 placeholder:text-gray-300"
              />
              {isSearching && <Loader2 className="w-3 h-3 text-gray-400 animate-spin flex-shrink-0" />}

              {/* Autocomplete dropdown */}
              {showAutocomplete && autocompleteResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-[100] py-1 text-left overflow-hidden">
                  <p className="px-3 pt-1 pb-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">Suggestions</p>
                  {autocompleteResults.map((biz) => (
                    <div
                      key={biz.id}
                      onClick={() => handleAutocompleteSelect(biz)}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors flex items-center gap-3"
                    >
                      {biz.images?.[0] ? (
                        <img src={biz.images[0]} alt={biz.name} className="w-7 h-7 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded bg-gray-100 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-gray-900 truncate">{biz.name}</p>
                        <p className="text-[8px] text-gray-400 truncate">{biz.category} · {biz.address}</p>
                      </div>
                    </div>
                  ))}
                  {/* View all results option */}
                  <div
                    onClick={handleSearch}
                    className="px-3 py-2 border-t border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors text-center"
                  >
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-wider">View all results →</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── Search Button ── */}
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-[#303030] hover:bg-black text-white px-6 py-3 sm:py-4 rounded-lg font-black transition-all uppercase tracking-[0.2em] text-[8px] sm:text-[10px] shadow-lg mt-1.5 md:mt-0 md:ml-1 text-center flex justify-center items-center"
            >
              Search
            </button>
          </div>
        </div>

        {/* Sub-label */}
        <div className="relative inline-block mt-4 sm:mt-12">
          <p className="font-southern text-xl sm:text-2xl md:text-3xl text-white leading-tight drop-shadow-lg px-8 sm:px-12">
            Or select a category below to find the best places
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-10 sm:mt-16 flex justify-center">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full md:mb-[20px] border border-white/20 flex items-center justify-center animate-bounce hover:border-white transition-colors cursor-pointer group">
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/50 group-hover:text-white" />
          </div>
        </div>
      </div>
    </section>
  );
};
