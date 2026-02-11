
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ShoppingBag, 
  Facebook, 
  Instagram, 
  Twitter,
  Heart,
  BarChart2,
  Share2,
  ChevronDown
} from 'lucide-react';

interface ProductDetailProps {
  onBack: () => void;
  onProductClick: (id: number) => void;
}

const RELATED_PRODUCTS = [
  { id: 101, name: 'Wired and Wireless Mouse', price: 'N20,000', discountPrice: 'N14,000', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop', discount: '30%' },
  { id: 102, name: 'Stone Wash Denim Shorts', price: 'N20,000', discountPrice: '', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop', discount: '' },
  { id: 103, name: 'Stone Wash Denim Shorts', price: 'N20,000', discountPrice: '', img: 'https://images.unsplash.com/photo-1589578233976-96b63d767d4f?w=400&auto=format&fit=crop', discount: '' },
  { id: 104, name: 'Stone Wash Denim Shorts', price: 'N20,000', discountPrice: '', img: 'https://images.unsplash.com/photo-1524275539700-fb511b8ba3d1?w=400&auto=format&fit=crop', discount: '' },
];

export const ProductDetail: React.FC<ProductDetailProps> = ({ onBack, onProductClick }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'additional' | 'reviews'>('description');
  const [activeThumb, setActiveThumb] = useState(0);

  const thumbnails = [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542751110-97646afbf7de?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop'
  ];

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        
        {/* Search Bar Header */}
        <div className="flex gap-0 w-full mb-10">
          <input 
            type="text" 
            placeholder="Type a keyword to search" 
            className="flex-1 bg-white border border-gray-200 rounded-l-md px-6 py-4 text-sm font-medium outline-none shadow-sm"
          />
          <button className="bg-[#333] text-white px-12 py-4 rounded-r-md text-xs font-bold uppercase tracking-widest hover:bg-black transition-all">
            SEARCH
          </button>
        </div>

        {/* Product Summary Section */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20">
          
          {/* Left: Product Images */}
          <div className="flex-1">
             <h1 className="text-3xl font-black text-[#111] mb-8 tracking-tight">Product Name</h1>
             
             <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 group mb-4">
                <img src={thumbnails[activeThumb]} className="w-full h-full object-contain" alt="Product Main" />
                
                {/* Carousel Controls */}
                <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 transition-all z-10">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 transition-all z-10">
                  <ChevronRight className="w-6 h-6" />
                </button>
             </div>

             {/* Thumbnails */}
             <div className="grid grid-cols-3 gap-4">
                {thumbnails.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setActiveThumb(idx)}
                    className={`aspect-[16/10] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${activeThumb === idx ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                  </div>
                ))}
             </div>
          </div>

          {/* Right: Product Info Card */}
          <div className="w-full lg:w-[450px]">
             <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] h-full">
                <h2 className="text-2xl font-black text-[#111] mb-4">Product Name</h2>
                <div className="flex items-center gap-4 mb-6">
                   <span className="text-xs font-bold text-gray-300 line-through">N15,000.00</span>
                   <span className="text-xs font-black text-red-500">N10,000.00</span>
                </div>
                
                <p className="text-xs font-medium text-gray-500 leading-relaxed mb-8">
                  Product Description...Ut euismod ultricies sollicitudin. Curabitur sed dapibus nulla. Nulla eget iaculis lectus. Mauris ac maximus neque. Nam in mauris quis libero sodales eleifend. Morbi varius, nulla sit amet rutrum elementum, est elit finibus tellus, ut tristique elit risus at metus.
                </p>

                <div className="flex items-center gap-2 mb-10">
                   <div className="flex gap-0.5">
                     {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}
                   </div>
                   <span className="text-[11px] font-bold text-gray-400">4.5 (25 Rating)</span>
                </div>

                <div className="space-y-4 mb-10 text-[11px] font-bold">
                   <div className="flex items-center gap-2">
                      <span className="text-gray-400">SKU:</span>
                      <span className="text-gray-700 uppercase">A1355</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-gray-700">Gaming Accessories</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-gray-400">Tags:</span>
                      <span className="text-gray-700">Gaming, Accessories, Electronics</span>
                   </div>
                </div>

                <div className="flex items-center gap-4 mb-10">
                   <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Share:</span>
                   <div className="flex items-center gap-3">
                      <Facebook className="w-4 h-4 text-gray-800 hover:text-blue-600 cursor-pointer" />
                      <Instagram className="w-4 h-4 text-gray-800 hover:text-pink-600 cursor-pointer" />
                      <Twitter className="w-4 h-4 text-gray-800 hover:text-sky-500 cursor-pointer" />
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400">Quantity:</label>
                   <div className="relative">
                      <select className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-xs font-bold appearance-none outline-none focus:border-blue-500">
                         <option>Quantity</option>
                         {[1,2,3,4,5,6,7,8,9,10].map(q => <option key={q} value={q}>{q}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                   </div>
                   
                   <button className="w-full bg-[#1d70d1] hover:bg-blue-700 text-white py-4 rounded-lg font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all mt-4">
                      ADD TO CART
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-24 border-t border-gray-100 pt-10">
          <div className="flex gap-12 mb-10">
             {['Description', 'Additional Information', 'Reviews (1)'].map((tab) => {
               const id = tab.toLowerCase().split(' ')[0] as any;
               return (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(id)}
                   className={`text-lg font-bold transition-all relative pb-2 ${activeTab === id ? 'text-[#111]' : 'text-gray-300'}`}
                 >
                   {tab}
                   {activeTab === id && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-500 rounded-full"></div>}
                 </button>
               )
             })}
          </div>

          <div className="max-w-6xl">
             <p className="text-sm font-medium text-gray-400 leading-relaxed mb-6">
                Product Description...Ut euismod ultricies sollicitudin. Curabitur sed dapibus nulla. Nulla eget iaculis lectus. Mauris ac maximus neque. Nam in mauris quis libero sodales eleifend. Morbi varius, nulla sit amet rutrum elementum, est elit finibus tellus, ut tristique elit risus at metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporem dicant partem scripserit, doctus appetere interpretaris mea nold vix deseruisse repudiandae, sea accusam percipit te. Vim praesent maiestati. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis Theme natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.
             </p>
          </div>
        </div>

        {/* Related Products */}
        <section className="mb-20">
           <h2 className="text-3xl font-black text-[#111] mb-10 tracking-tight">Related Products</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {RELATED_PRODUCTS.map(p => (
                <div 
                  key={p.id}
                  onClick={() => onProductClick(p.id)}
                  className="bg-white rounded-lg overflow-hidden group border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50 p-6 flex items-center justify-center">
                    <img src={p.img} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" alt={p.name} />
                    {p.discount && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg">
                        -{p.discount}
                      </div>
                    )}
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                      <button className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-blue-600 shadow-md">
                        <BarChart2 className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-blue-600 shadow-md">
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-red-500 shadow-md">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xs font-black text-gray-800 mb-2 truncate uppercase tracking-wider">{p.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 line-through">{p.price}</span>
                      {p.discountPrice && <span className="text-xs font-black text-red-600">{p.discountPrice}</span>}
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
};
