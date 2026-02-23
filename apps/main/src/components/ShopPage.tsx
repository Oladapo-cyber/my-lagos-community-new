
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  ChevronRight, 
  Heart, 
  Eye, 
  ChevronLeft,
  Smartphone,
  Cpu,
  Gamepad2,
  Watch,
  Home,
  Utensils,
  Car,
  Baby,
  Shirt,
  Trophy,
  MoreHorizontal,
  Sparkles,
  Scissors,
  Gem,
  Dog,
  Wrench,
  ShoppingCart,
  Pill,
  Loader2
} from 'lucide-react';
import type { Product } from '@mlc/shared-types';
import { getAllProducts } from '../utils/apiClient';
import { useFavorites } from '../context/FavoritesContext';

// Sidebar categories
const SIDEBAR_CATEGORIES = [
  { icon: ShoppingCart, label: 'All' },
  { icon: Sparkles, label: 'Supermarket' },
  { icon: Pill, label: 'Health' },
  { icon: Scissors, label: 'Beauty' },
  { icon: Home, label: 'Home & Garden' },
  { icon: Gem, label: 'Jewellery' },
  { icon: Dog, label: 'Pet Care' },
  { icon: Baby, label: 'Baby Products' },
  { icon: Trophy, label: 'Sporting Goods' },
  { icon: Car, label: 'Automobile' },
  { icon: Cpu, label: 'Electronics' },
  { icon: Shirt, label: 'Fashion' },
  { icon: Gamepad2, label: 'Gaming' },
  { icon: MoreHorizontal, label: 'Other Categories' },
];

// Shop by Category cards — `category` must match backend ProductCategory enum
const CATEGORY_CARDS = [
  { title: 'Gaming Accessories', category: 'Gaming',        img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop' },
  { title: 'Ankara Shoes',       category: 'Fashion',       img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop' },
  { title: 'Handle Bags',        category: 'Fashion',       img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop' },
  { title: 'Home Theater',       category: 'Electronics',   img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop' },
  { title: 'Toys & Games',       category: 'Sporting Goods',img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop' },
  { title: 'Home Decor',         category: 'Home & Garden', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop' },
  { title: 'Furniture',          category: 'Home & Garden', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop' },
  { title: 'Computer Accessories',category: 'Electronics',  img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop' },
];

/** Format a number as ₦X,XXX */
function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`;
}

/** Placeholder image when product has no images */
const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop';

interface ShopPageProps {
  onProductClick: (id: number) => void;
}

// Countdown Timer Component
const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 15, mins: 43, secs: 22 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, mins, secs } = prev;
        secs--;
        if (secs < 0) { secs = 59; mins--; }
        if (mins < 0) { mins = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 0; hours = 0; mins = 0; secs = 0; }
        return { days, hours, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const blocks = [
    { val: timeLeft.days, label: 'D' },
    { val: timeLeft.hours, label: 'H' },
    { val: timeLeft.mins, label: 'M' },
    { val: timeLeft.secs, label: 'S' },
  ];

  return (
    <div className="flex items-center gap-2">
      {blocks.map((b, i) => (
        <div key={i} className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#f97316] font-black text-sm shadow-sm">
          {String(b.val).padStart(2, '0')}
        </div>
      ))}
    </div>
  );
};

// Product Card Component – works with real Product data
function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const img = product.image?.[0] || PLACEHOLDER_IMG;
  const { isFavorited, toggleFavorite } = useFavorites();
  const isLiked = isFavorited(product.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <div onClick={onClick} className="bg-white rounded-xl overflow-hidden group cursor-pointer border border-gray-100 hover:shadow-lg transition-all">
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
        >
          <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm text-gray-800 mb-2 truncate">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-gray-800">{formatPrice(product.price)}</span>
        </div>
        {product.category && (
          <span className="text-[10px] text-gray-400 font-medium">{product.category}</span>
        )}
      </div>
    </div>
  );
}

// Section view modes: 'browse' = normal sectioned layout; others = full flat list for that section
type ViewMode = 'browse' | 'arrivals' | 'trending' | 'deals';

export const ShopPage: React.FC<ShopPageProps> = ({ onProductClick }) => {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [searchQuery, setSearchQuery] = useState('');

  // Select a category from sidebar or a category card
  const selectCategory = (cat: string) => {
    setActiveCategory(cat);
    setViewMode('browse');
  };

  // ---- Real product data from API ----
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAllProducts();
        const products: Product[] = Array.isArray(response) ? response : (response as any)?.items ?? [];
        if (!cancelled) setAllProducts(products);
      } catch (err) {
        console.error('[ShopPage] Failed to load products:', err);
        if (!cancelled) setError('Failed to load products. Please try again.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Filter by sidebar category + search query
  const filteredProducts = allProducts.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tag?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort newest first (highest created_at)
  const sorted = [...filteredProducts].sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

  // Whether to show a flat product grid instead of the sectioned browse layout
  const showFlatGrid = viewMode !== 'browse' || activeCategory !== 'All';

  // Title + products for the flat grid
  const flatGridTitle =
    viewMode === 'arrivals' ? 'New Arrivals' :
    viewMode === 'trending' ? 'Trending Items' :
    viewMode === 'deals'    ? 'Deals Of The Week' :
    activeCategory !== 'All' ? activeCategory : 'All Products';
  const flatGridProducts = sorted; // always the full (filtered) set

  // Section slices (only used in browse mode)
  const newArrivals  = sorted.slice(0, 4);
  const dealsProducts = sorted.slice(4, 8);
  const trendingItems = sorted.slice(0, 8);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="hidden lg:block w-56 bg-white border-r border-gray-100 py-6 px-4 shrink-0">
        <nav className="space-y-1">
          {SIDEBAR_CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => selectCategory(cat.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-bold transition-all ${
                activeCategory === cat.label 
                  ? 'bg-[#f97316]/10 text-[#f97316]' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <cat.icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{cat.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {/* Search Bar */}
        <div className="px-6 py-4 bg-white border-b border-gray-100">
          <div className="max-w-xl flex items-center gap-3">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Type a keyword to search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-[#f97316]/30 focus:border-[#f97316] transition-all"
              />
            </div>
            <button className="bg-[#f97316] hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Banner Carousel Section */}
        <div className="px-6 py-6">
          <div className="flex gap-4">
            {/* Main Banner */}
            <div className="flex-1 relative h-56 sm:h-64 rounded-2xl overflow-hidden bg-gradient-to-r from-[#f97316] to-[#f59e0b]">
              <div className="absolute inset-0 flex items-center justify-between px-8">
                <div className="z-10">
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">Limited Time</p>
                  <h2 className="text-white text-3xl sm:text-4xl font-black leading-tight mb-3">SPECIAL<br/>OFFER</h2>
                  <button className="bg-white text-[#f97316] px-5 py-2 rounded-lg font-black text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors">
                    Shop Now
                  </button>
                </div>
                <div className="relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                    <span className="text-white text-5xl font-black block">50%</span>
                    <span className="text-white/90 text-sm font-bold uppercase tracking-widest">OFF</span>
                  </div>
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop" 
                alt="Special Offer" 
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
              />
            </div>

            {/* Side Ad Banners */}
            <div className="hidden md:flex flex-col gap-4 w-48">
              <div className="flex-1 rounded-xl overflow-hidden relative bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center p-4">
                <div className="text-center z-10">
                  <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1">Get Instant</p>
                  <p className="text-white text-lg font-black leading-tight">LOANS</p>
                  <p className="text-white/80 text-[10px] font-bold mt-1">Up to 50,000</p>
                </div>
              </div>
              <div className="flex-1 rounded-xl overflow-hidden relative bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
                <div className="text-center z-10">
                  <p className="text-white text-xs font-black uppercase">WOW</p>
                  <p className="text-yellow-300 text-2xl font-black leading-tight">SALE!</p>
                  <p className="text-white text-2xl font-black">70%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Banner subtitle */}
          <p className="text-gray-400 text-[11px] font-bold mt-3 italic">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut dolore magna aliqua.
          </p>
        </div>

        {/* Shop By Category */}
        <section className="px-6 pb-10">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-[#111] tracking-tight">Shop By Category</h2>
            <p className="text-gray-400 text-xs font-bold mt-1">Top categories of the week</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORY_CARDS.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => selectCategory(cat.category)}
                className={`relative h-40 rounded-xl overflow-hidden group cursor-pointer ring-2 transition-all ${
                  activeCategory === cat.category ? 'ring-[#f97316] shadow-lg' : 'ring-transparent'
                }`}
              >
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end p-4">
                  <h3 className="text-white font-black text-sm">{cat.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Flat filtered grid (category selected OR See All triggered) ─── */}
        {showFlatGrid ? (
          <section className="px-6 pb-16">
            {/* Back bar */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => { setActiveCategory('All'); setViewMode('browse'); }}
                className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-[#f97316] transition-colors"
              >
                <ChevronLeft size={16} /> All Products
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-black text-gray-800">{flatGridTitle}</span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#f97316] animate-spin" />
                  <p className="text-sm font-bold text-gray-400">Loading products...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-sm font-bold text-red-400 mb-3">{error}</p>
                <button onClick={() => window.location.reload()} className="text-sm font-bold text-[#f97316] hover:underline">Retry</button>
              </div>
            ) : flatGridProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm font-bold text-gray-400 mb-2">No products found in "{flatGridTitle}".</p>
                <button onClick={() => { setActiveCategory('All'); setViewMode('browse'); }} className="text-sm font-bold text-[#f97316] hover:underline">Browse all products</button>
              </div>
            ) : (
              <>
                <p className="text-xs font-bold text-gray-400 mb-5">{flatGridProducts.length} product{flatGridProducts.length !== 1 ? 's' : ''}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {flatGridProducts.map((p) => (
                    <ProductCard key={p.id} product={p} onClick={() => onProductClick(p.id)} />
                  ))}
                </div>
              </>
            )}
          </section>
        ) : (
          <>
            {/* ─── Sectioned browse layout (All + Browse mode) ─── */}

            {/* Shop New Arrivals */}
            <section className="px-6 pb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-[#111] tracking-tight">Shop New Arrivals</h2>
                <button
                  onClick={() => setViewMode('arrivals')}
                  className="flex items-center gap-1 font-southern text-2xl text-gray-500 hover:text-[#f97316] transition-colors"
                >
                  See All →
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#f97316] animate-spin" />
                    <p className="text-sm font-bold text-gray-400">Loading products...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="text-sm font-bold text-red-400 mb-3">{error}</p>
                  <button onClick={() => window.location.reload()} className="text-sm font-bold text-[#f97316] hover:underline">Retry</button>
                </div>
              ) : newArrivals.length === 0 ? (
                <p className="text-center py-12 text-sm font-medium text-gray-400">No products found.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {newArrivals.map((p) => (
                    <ProductCard key={p.id} product={p} onClick={() => onProductClick(p.id)} />
                  ))}
                </div>
              )}

              {/* Pagination Dots */}
              <div className="flex justify-center mt-8 gap-2">
                {[0,1,2,3,4,5,6].map(i => (
                  <button
                    key={i}
                    onClick={() => setActiveDot(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${activeDot === i ? 'bg-[#f97316] w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
                  />
                ))}
              </div>
            </section>

            {/* Deals Of The Week */}
            <section className="mx-6 mb-10 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-black text-black tracking-tight">Deals Of The Week!</h2>
                  <CountdownTimer />
                </div>
                <button
                  onClick={() => setViewMode('deals')}
                  className="font-southern text-2xl text-white/80 hover:text-white transition-colors hidden sm:block"
                >
                  See All →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {dealsProducts.length > 0 ? dealsProducts.map((p) => (
                  <ProductCard key={p.id} product={p} onClick={() => onProductClick(p.id)} />
                )) : (
                  <p className="col-span-full text-center py-8 text-sm font-medium text-white/70">No deals available right now.</p>
                )}
              </div>
            </section>

            {/* Trending Items */}
            <section className="px-6 pb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-[#111] tracking-tight">Trending Items</h2>
                <button
                  onClick={() => setViewMode('trending')}
                  className="font-southern text-2xl text-gray-500 hover:text-[#f97316] transition-colors"
                >
                  See All →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {trendingItems.length > 0 ? trendingItems.map((p) => (
                  <ProductCard key={p.id} product={p} onClick={() => onProductClick(p.id)} />
                )) : (
                  <p className="col-span-full text-center py-8 text-sm font-medium text-gray-400">No trending items yet.</p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};
