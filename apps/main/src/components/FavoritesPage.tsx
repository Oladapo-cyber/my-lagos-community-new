import React, { useState, useEffect } from 'react';
import { ChevronLeft, Heart, Loader2, AlertCircle } from 'lucide-react';
import type { Product } from '@mlc/shared-types';
import { getProduct, getAllProducts } from '../utils/apiClient';
import { useFavorites } from '../context/FavoritesContext';

interface FavoritesPageProps {
  onBack: () => void;
  onProductClick: (id: number) => void;
}

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop';

function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onBack, onProductClick }) => {
  const { favorites } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all products and filter by favorites
  useEffect(() => {
    if (favorites.length === 0) {
      setFavoriteProducts([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const allProducts = await getAllProducts();
        if (cancelled) return;

        const allProds: Product[] = Array.isArray(allProducts)
          ? allProducts
          : (allProducts as any)?.items ?? [];

        const filtered = allProds.filter(p =>
          favorites.includes(p.id)
        );

        setFavoriteProducts(filtered);
      } catch (err) {
        console.error('[FavoritesPage] Failed to load favorites:', err);
        if (!cancelled) {
          setError('Failed to load your favorite products. Please try again.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [favorites]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-[#111] tracking-tight">My Favorites</h1>
            <p className="text-gray-400 text-sm font-bold mt-1">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Loading your favorites...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-6 flex items-center gap-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-900">Error</h3>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && favoriteProducts.length === 0 && (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-gray-400 mb-2">No favorites yet</h2>
            <p className="text-gray-400 font-medium mb-8">
              Start adding products to your favorites to see them here.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              Browse Products
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && favoriteProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteProducts.map(product => (
              <FavoriteProductCard
                key={product.id}
                product={product}
                onClick={() => onProductClick(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/** Favorite Product Card Component */
function FavoriteProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) {
  const { isFavorited, removeFavorite } = useFavorites();
  const img = product.image?.[0] || PLACEHOLDER_IMG;
  const isLiked = isFavorited(product.id);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFavorite(product.id);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden group cursor-pointer border border-gray-100 hover:shadow-lg transition-all"
    >
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        <img
          src={img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={handleRemove}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
        >
          <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm text-gray-800 mb-2 truncate">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-gray-800">
            {formatPrice(product.price)}
          </span>
        </div>
        {product.category && (
          <span className="text-[10px] text-gray-400 font-medium">
            {product.category}
          </span>
        )}
      </div>
    </div>
  );
}
