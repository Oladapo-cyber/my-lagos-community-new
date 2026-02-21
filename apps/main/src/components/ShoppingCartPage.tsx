import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';

interface ShoppingCartPageProps {
  onBackToShop: () => void;
  onCheckout: () => void;
}

export const ShoppingCartPage: React.FC<ShoppingCartPageProps> = ({ onBackToShop, onCheckout }) => {
  const { items, cartCount, isLoading, removeItem, updateQuantity, total } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-sm text-gray-400 font-medium mb-8 text-center max-w-sm">
          Looks like you haven't added any products yet. Browse our shop to find great deals!
        </p>
        <button
          onClick={onBackToShop}
          className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-black text-xs uppercase tracking-widest transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const deliveryFee = 2500;
  const grandTotal = total + deliveryFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>
        </div>
        <button
          onClick={onBackToShop}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#f97316] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-[1fr_120px_140px_80px] gap-4 px-6 py-3 bg-gray-50 rounded-lg text-[11px] font-black text-gray-400 uppercase tracking-widest">
            <span>Product</span>
            <span className="text-center">Price</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
          </div>

          {items.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 sm:grid sm:grid-cols-[1fr_120px_140px_80px] sm:gap-4 sm:items-center shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Product info */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                  <img
                    src={item.product.image?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-gray-800 truncate">{item.product.name}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-1">{item.product.category}</p>
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-bold mt-2 sm:hidden transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-center mt-3 sm:mt-0">
                <span className="text-sm font-black text-gray-800">₦{item.product.price.toLocaleString()}</span>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-center gap-2 mt-3 sm:mt-0">
                <button
                  onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-3 h-3 text-gray-500" />
                </button>
                <span className="w-10 text-center text-sm font-black text-gray-800">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-3 h-3 text-gray-500" />
                </button>
                <button
                  onClick={() => removeItem(item.cartItemId)}
                  className="hidden sm:flex w-8 h-8 rounded-lg text-gray-300 hover:text-red-500 items-center justify-center transition-colors ml-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Line Total */}
              <div className="text-right mt-3 sm:mt-0">
                <span className="text-sm font-black text-[#f97316]">
                  ₦{(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-28">
            <h2 className="text-lg font-black text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Subtotal ({cartCount} items)</span>
                <span className="font-bold text-gray-800">₦{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Delivery Fee</span>
                <span className="font-bold text-gray-800">₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between">
                <span className="font-black text-gray-900">Total</span>
                <span className="font-black text-xl text-[#f97316]">₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full mt-6 bg-[#f97316] hover:bg-orange-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-gray-400 text-center mt-4 font-medium">
              Taxes and shipping calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
