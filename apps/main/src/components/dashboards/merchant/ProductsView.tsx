import React, { useState, useEffect } from 'react';
import { MoreVertical, Plus, Search, Filter, Download, Edit2, Trash2, Eye, Package, Loader2, AlertCircle } from 'lucide-react';
import { getMerchantProducts, parseApiResponseError } from '@mlc/api-client';
import { useAuth } from '../../../context/AuthContext';
import type { Product } from '@mlc/shared-types';

export const ProductsView = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchMerchantProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMerchantProducts(user.id, 'main');
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        const msg = parseApiResponseError(err);
        console.error('[ProductsView] Failed to fetch products:', err);
        setError(msg || 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchantProducts();
  }, [user?.id]);

  const filtered = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-3 pl-10 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex-1 sm:flex-none px-4 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex-1 sm:flex-none px-5 py-3 bg-[#2563eb] text-white rounded-lg text-sm font-bold uppercase tracking-wider shadow-lg shadow-blue-500/20 flex items-center gap-2 hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin mr-2" />
            <span className="text-sm font-bold text-gray-600">Loading products…</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm font-bold text-gray-600">{error}</p>
          </div>
        ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em]">
              <th className="px-4 py-4 rounded-tl-lg">Product</th>
              <th className="px-4 py-4">Category</th>
              <th className="px-4 py-4 text-center">Price</th>
              <th className="px-4 py-4 text-center">Stock</th>
              <th className="px-4 py-4 text-center">Sales</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 rounded-tr-lg text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-5">
                  <div className="flex items-center gap-3">
                    {product.image?.[0] ? (
                      <img src={product.image[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <span className="font-extrabold text-gray-900 text-sm">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-5 text-sm font-medium text-gray-600">{product.category}</td>
                <td className="px-4 py-5 text-sm font-bold text-gray-800 text-center">₦{product.price.toLocaleString()}</td>
                <td className="px-4 py-5 text-center">
                  <span className={`text-sm font-bold ${product.quantity === 0 ? 'text-red-500' : product.quantity < 25 ? 'text-yellow-500' : 'text-gray-600'}`}>
                    {product.quantity === 0 ? 'Out of Stock' : product.quantity}
                  </span>
                </td>
                <td className="px-4 py-5 text-sm font-bold text-gray-600 text-center">{product.no_of_sales || 0}</td>
                <td className="px-4 py-5">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                    Active
                  </span>
                </td>
                <td className="px-4 py-5">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {!isLoading && !error && filtered.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-sm font-bold text-gray-400">No products found</p>
        </div>
      )}
    </div>
  );
};
