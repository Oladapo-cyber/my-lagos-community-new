
import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  Loader2
} from 'lucide-react';
import type { Product } from '@mlc/shared-types';
import { getProduct, getAllProducts } from '../utils/apiClient';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

interface ProductDetailProps {
  productId?: number;
  onBack: () => void;
  onProductClick: (id: number) => void;
  onViewCart?: () => void;
  onViewFavorites?: () => void;
}

/** Format a number as ₦X,XXX */
function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`;
}

/** Favorite Button Component */
const FavoriteButton: React.FC<{ productId: number }> = ({ productId }) => {
  const { isFavorited, toggleFavorite } = useFavorites();
  const isLiked = isFavorited(productId);

  return (
    <button
      onClick={() => toggleFavorite(productId)}
      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-red-50 transition-colors"
    >
      <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
    </button>
  );
};

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop';

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack, onProductClick, onViewCart, onViewFavorites }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'additional' | 'reviews'>('description');
  const [activeThumb, setActiveThumb] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedMessage, setAddedMessage] = useState('');

  // Real product data from API
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem } = useCart();

  // Fetch product on mount / id change
  useEffect(() => {
    if (!productId || productId <= 0) return;
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      setActiveThumb(0);
      setQuantity(1);
      setAddedMessage('');
      try {
        const [prod, allProds] = await Promise.all([
          getProduct(productId),
          getAllProducts(),
        ]);
        if (cancelled) return;
        setProduct(prod);

        // Related = same category, excluding self (up to 4)
        const all: Product[] = Array.isArray(allProds) ? allProds : (allProds as any)?.items ?? [];
        const related = all
          .filter(p => p.id !== productId && p.category === prod.category)
          .slice(0, 4);
        // If not enough same-category products, fill with others
        if (related.length < 4) {
          const others = all.filter(p => p.id !== productId && !related.some(r => r.id === p.id)).slice(0, 4 - related.length);
          related.push(...others);
        }
        setRelatedProducts(related);
      } catch (err) {
        console.error('[ProductDetail] Failed to load product:', err);
        if (!cancelled) setError('Failed to load product details. Please try again.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [productId]);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addItem(product, quantity);
      setAddedMessage('Added to cart!');
      setTimeout(() => setAddedMessage(''), 2500);
    } catch (err) {
      console.error('[ProductDetail] Add to cart failed:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#f97316] animate-spin" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <p className="text-sm font-bold text-red-400 mb-4">{error || 'Product not found.'}</p>
        <button onClick={onBack} className="bg-[#f97316] hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-black text-xs uppercase tracking-widest transition-colors">
          Back to Shop
        </button>
      </div>
    );
  }

  const images = product.image && product.image.length > 0 ? product.image : [PLACEHOLDER_IMG];

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
             <h1 className="text-3xl font-black text-[#111] mb-8 tracking-tight">{product.name}</h1>
             
             <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 group mb-4">
                <img src={images[activeThumb]} className="w-full h-full object-contain" alt={product.name} />
                
                {/* Carousel Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveThumb(prev => (prev - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 transition-all z-10 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setActiveThumb(prev => (prev + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 transition-all z-10 opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
             </div>

             {/* Thumbnails */}
             {images.length > 1 && (
               <div className="grid grid-cols-3 gap-4">
                  {images.slice(0, 6).map((img, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setActiveThumb(idx)}
                      className={`aspect-[16/10] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${activeThumb === idx ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-200'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`${product.name} ${idx + 1}`} />
                    </div>
                  ))}
               </div>
             )}
          </div>

          {/* Right: Product Info Card */}
          <div className="w-full lg:w-[450px]">
             <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] h-full">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-black text-[#111] flex-1">{product.name}</h2>
                  <FavoriteButton productId={product.id} />
                </div>
                <div className="flex items-center gap-4 mb-6">
                   <span className="text-lg font-black text-gray-800">{formatPrice(product.price)}</span>
                </div>
                
                <p className="text-xs font-medium text-gray-500 leading-relaxed mb-8">
                  {product.description || 'No description available for this product.'}
                </p>

                <div className="flex items-center gap-2 mb-10">
                   <div className="flex gap-0.5">
                     {[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}
                   </div>
                   <span className="text-[11px] font-bold text-gray-400">4.0 (–)</span>
                </div>

                <div className="space-y-4 mb-10 text-[11px] font-bold">
                   <div className="flex items-center gap-2">
                      <span className="text-gray-400">In Stock:</span>
                      <span className={`uppercase ${product.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {product.quantity > 0 ? `${product.quantity} available` : 'Out of stock'}
                      </span>
                   </div>
                   {product.category && (
                     <div className="flex items-center gap-2">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-gray-700">{product.category}</span>
                     </div>
                   )}
                   {product.tag && product.tag.length > 0 && (
                     <div className="flex items-center gap-2">
                        <span className="text-gray-400">Tags:</span>
                        <span className="text-gray-700">{product.tag.join(', ')}</span>
                     </div>
                   )}
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
                      <select 
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-xs font-bold appearance-none outline-none focus:border-blue-500"
                      >
                         {Array.from({ length: Math.min(product.quantity || 10, 10) }, (_, i) => i + 1).map(q => (
                           <option key={q} value={q}>{q}</option>
                         ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                   </div>
                   
                   <button 
                     onClick={handleAddToCart}
                     disabled={addingToCart || product.quantity < 1}
                     className="w-full bg-[#1d70d1] hover:bg-blue-700 disabled:opacity-60 text-white py-4 rounded-lg font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all mt-4 flex items-center justify-center gap-2"
                   >
                      {addingToCart ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</>
                      ) : product.quantity < 1 ? (
                        'OUT OF STOCK'
                      ) : (
                        'ADD TO CART'
                      )}
                   </button>
                   {addedMessage && (
                     <p className="text-center text-sm font-bold text-green-600 mt-2">{addedMessage}</p>
                   )}

                   {/* View Cart & Favorites Buttons */}
                   <div className="flex gap-3 mt-6">
                     {onViewCart && (
                       <button
                         onClick={onViewCart}
                         className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
                       >
                         View Cart
                       </button>
                     )}
                     {onViewFavorites && (
                       <button
                         onClick={onViewFavorites}
                         className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
                       >
                         View Favorites
                       </button>
                     )}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-24 border-t border-gray-100 pt-10">
          <div className="flex gap-12 mb-10">
             {['Description', 'Additional Information', 'Reviews (–)'].map((tab) => {
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
            {activeTab === 'description' && (
              <p className="text-sm font-medium text-gray-400 leading-relaxed mb-6">
                {product.description || 'No description provided for this product.'}
              </p>
            )}
            {activeTab === 'additional' && (
              <div className="text-sm font-medium text-gray-400 leading-relaxed space-y-2">
                <p><span className="text-gray-600 font-bold">Category:</span> {product.category || '—'}</p>
                <p><span className="text-gray-600 font-bold">Tags:</span> {product.tag?.join(', ') || '—'}</p>
                <p><span className="text-gray-600 font-bold">Stock:</span> {product.quantity} units</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <p className="text-sm font-medium text-gray-400 leading-relaxed">No reviews yet.</p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-20">
             <h2 className="text-3xl font-black text-[#111] mb-10 tracking-tight">Related Products</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => onProductClick(p.id)}
                    className="bg-white rounded-lg overflow-hidden group border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50 p-6 flex items-center justify-center">
                      <img src={p.image?.[0] || PLACEHOLDER_IMG} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" alt={p.name} />
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
                        <span className="text-xs font-black text-gray-800">{formatPrice(p.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </section>
        )}

      </div>
    </div>
  );
};
