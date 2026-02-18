
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
  Pill
} from 'lucide-react';

// Sidebar categories
const SIDEBAR_CATEGORIES = [
  { icon: ShoppingCart, label: 'Supermarket' },
  { icon: Sparkles, label: 'Supermarket' },
  { icon: Pill, label: 'Health' },
  { icon: Scissors, label: 'Beauty' },
  { icon: Home, label: 'Home & Garden' },
  { icon: Gem, label: 'Jewellery' },
  { icon: Dog, label: 'Pet Care' },
  { icon: Baby, label: 'Baby Products' },
  { icon: Trophy, label: 'Sporting Goods' },
  { icon: Car, label: 'Automobile' },
  { icon: MoreHorizontal, label: 'Other Categories' },
];

// Shop by Category cards
const CATEGORY_CARDS = [
  { title: 'Gaming Accessories', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop' },
  { title: 'Ankara Shoes', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop' },
  { title: 'Handle Bags', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop' },
  { title: 'Home Theater', img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop' },
  { title: 'Toys & Games', img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop' },
  { title: 'Home Decor', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop' },
  { title: 'Furniture', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop' },
  { title: 'Computer Accessories', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop' },
];

// New Arrivals products
const NEW_ARRIVALS = [
  { id: 1, name: 'Stone Wash Denim Shorts', price: '₦20,000', discountPrice: '₦14,000', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&auto=format&fit=crop', discount: '30%' },
  { id: 2, name: 'Stone Wash Denim Shorts', price: '₦18,000', discountPrice: '', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&auto=format&fit=crop', discount: '' },
  { id: 3, name: 'Stone Wash Denim Shorts', price: '₦22,000', discountPrice: '₦18,200', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop', discount: '17%' },
  { id: 4, name: 'Stone Wash Denim Shorts', price: '₦20,000', discountPrice: '₦14,000', img: 'https://images.unsplash.com/photo-1524275539700-fb511b8ba3d1?w=400&auto=format&fit=crop', discount: '30%' },
];

// Deals of the week products
const DEALS_PRODUCTS = [
  { id: 10, name: 'Stone Wash Denim Shorts', price: '₦25,000', discountPrice: '', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop', discount: '' },
  { id: 11, name: 'Stone Wash Denim Shorts', price: '₦18,000', discountPrice: '₦15,400', img: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&auto=format&fit=crop', discount: '15%' },
  { id: 12, name: 'Stone Wash Denim Shorts', price: '₦22,000', discountPrice: '₦18,200', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop', discount: '17%' },
  { id: 13, name: 'Stone Wash Denim Shorts', price: '₦15,000', discountPrice: '', img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&auto=format&fit=crop', discount: '' },
];

// Trending Items
const TRENDING_ITEMS = [
  { id: 20, name: 'Stone Wash Denim Shorts', price: '₦20,000', discountPrice: '₦14,000', img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&auto=format&fit=crop', discount: '30%' },
  { id: 21, name: 'Stone Wash Denim Shorts', price: '₦18,000', discountPrice: '₦15,400', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop', discount: '15%' },
  { id: 22, name: 'Stone Wash Denim Shorts', price: '₦25,700', discountPrice: '', img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop', discount: '' },
  { id: 23, name: 'Stone Wash Denim Shorts', price: '₦20,000', discountPrice: '₦14,000', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop', discount: '30%' },
  { id: 24, name: 'Stone Wash Denim Shorts', price: '₦20,000', discountPrice: '₦14,000', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop', discount: '30%' },
  { id: 25, name: 'Stone Wash Denim Shorts', price: '₦18,000', discountPrice: '₦15,400', img: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&auto=format&fit=crop', discount: '15%' },
  { id: 26, name: 'Stone Wash Denim Shorts', price: '₦22,500', discountPrice: '₦18,200', img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&auto=format&fit=crop', discount: '19%' },
  { id: 27, name: 'Stone Wash Denim Shorts', price: '₦20,000', discountPrice: '₦14,000', img: 'https://images.unsplash.com/photo-1524275539700-fb511b8ba3d1?w=400&auto=format&fit=crop', discount: '30%' },
];

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

// Product Card Component
function ProductCard({ name, price, discountPrice, img, discount, onClick }: any) {
  return (
    <div onClick={onClick} className="bg-white rounded-xl overflow-hidden group cursor-pointer border border-gray-100 hover:shadow-lg transition-all">
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md">{discount}</span>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
          <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm text-gray-800 mb-2 truncate">{name}</h3>
        <div className="flex items-center gap-2">
          {discountPrice ? (
            <>
              <span className="text-xs text-gray-400 line-through">{price}</span>
              <span className="text-sm font-black text-red-500">{discountPrice}</span>
            </>
          ) : (
            <span className="text-sm font-black text-gray-800">{price}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export const ShopPage: React.FC<ShopPageProps> = ({ onProductClick }) => {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Supermarket');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="hidden lg:block w-56 bg-white border-r border-gray-100 py-6 px-4 shrink-0">
        <nav className="space-y-1">
          {SIDEBAR_CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat.label)}
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-[#111] tracking-tight">Shop By Category</h2>
              <p className="text-gray-400 text-xs font-bold mt-1">Top categories of the week</p>
            </div>
            <button className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-[#f97316] transition-colors font-southern text-2xl">
              See All →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORY_CARDS.map((cat, idx) => (
              <div key={idx} className="relative h-40 rounded-xl overflow-hidden group cursor-pointer">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end p-4">
                  <h3 className="text-white font-black text-sm">{cat.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shop New Arrivals */}
        <section className="px-6 pb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-[#111] tracking-tight">Shop New Arrivals</h2>
            <button className="flex items-center gap-1 font-southern text-2xl text-gray-500 hover:text-[#f97316] transition-colors">
              See All →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {NEW_ARRIVALS.map((p) => (
              <ProductCard key={p.id} {...p} onClick={() => onProductClick(p.id)} />
            ))}
          </div>

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
              <h2 className="text-2xl font-black text-white tracking-tight">Deals Of The Week!</h2>
              <CountdownTimer />
            </div>
            <button className="font-southern text-2xl text-white/80 hover:text-white transition-colors hidden sm:block">
              See All →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {DEALS_PRODUCTS.map((p) => (
              <ProductCard key={p.id} {...p} onClick={() => onProductClick(p.id)} />
            ))}
          </div>
        </section>

        {/* Trending Items */}
        <section className="px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-[#111] tracking-tight">Trending Items</h2>
            <button className="font-southern text-2xl text-gray-500 hover:text-[#f97316] transition-colors">
              See All →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {TRENDING_ITEMS.map((p) => (
              <ProductCard key={p.id} {...p} onClick={() => onProductClick(p.id)} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
