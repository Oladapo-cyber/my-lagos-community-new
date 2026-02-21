import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../utils/apiClient';
import { ArrowLeft, CreditCard, Building2, Banknote, CheckCircle2, Loader2 } from 'lucide-react';

interface ShopCheckoutProps {
  onBackToCart: () => void;
  onBackToShop: () => void;
}

export const ShopCheckout: React.FC<ShopCheckoutProps> = ({ onBackToCart, onBackToShop }) => {
  const { items, total, clearCart, cartCount } = useCart();
  const { isLoggedIn, user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'cash'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Lagos',
    state: 'Lagos',
  });

  const deliveryFee = 2500;
  const grandTotal = total + deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !user) {
      alert('Please log in to complete your order.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createOrder({
        user_id: Number(user.id) || 0,
        totalAmount: grandTotal,
        paymentMethod,
        paymentStatus: 'pending',
      });
      clearCart();
      setOrderSuccess(true);
    } catch (err) {
      console.error('[ShopCheckout] order failed:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---- Success Screen ---- */
  if (orderSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Order Placed!</h2>
        <p className="text-sm text-gray-500 font-medium text-center max-w-sm mb-8">
          Your order has been placed successfully. You will receive a confirmation email shortly.
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

  /* ---- Empty cart guard ---- */
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-black text-gray-800 mb-4">Your cart is empty</h2>
        <button
          onClick={onBackToShop}
          className="bg-[#f97316] hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-black text-xs uppercase tracking-widest transition-colors"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBackToCart}
          className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Billing Details */}
          <div className="flex-1 space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-black text-gray-900 mb-6">Billing Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">First Name</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#f97316] transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#f97316] transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#f97316] transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+234..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#f97316] transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">City</label>
                  <input name="city" value={form.city} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#f97316] transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Delivery Address</label>
                  <input name="address" value={form.address} onChange={handleChange} required placeholder="Street address"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-200 focus:border-[#f97316] transition-all" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-black text-gray-900 mb-6">Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'card' as const, label: 'Card', icon: CreditCard, desc: 'Debit / Credit' },
                  { id: 'bank' as const, label: 'Bank Transfer', icon: Building2, desc: 'Direct transfer' },
                  { id: 'cash' as const, label: 'Cash', icon: Banknote, desc: 'Pay on delivery' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                      paymentMethod === m.id
                        ? 'border-[#f97316] bg-orange-50 shadow-sm'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <m.icon className={`w-6 h-6 ${paymentMethod === m.id ? 'text-[#f97316]' : 'text-gray-400'}`} />
                    <span className={`text-xs font-black uppercase tracking-wider ${paymentMethod === m.id ? 'text-[#f97316]' : 'text-gray-600'}`}>{m.label}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-28">
              <h2 className="text-lg font-black text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.cartItemId} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <img
                        src={item.product.image?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-800 truncate">{item.product.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-black text-gray-800 shrink-0">₦{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="font-bold text-gray-800">₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Delivery Fee</span>
                  <span className="font-bold text-gray-800">₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-black text-gray-900">Total</span>
                  <span className="font-black text-xl text-[#f97316]">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-[#f97316] hover:bg-orange-600 disabled:opacity-60 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  `Place Order — ₦${grandTotal.toLocaleString()}`
                )}
              </button>

              {!isLoggedIn && (
                <p className="text-[10px] text-red-400 text-center mt-3 font-bold">
                  You must be logged in to place an order
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
