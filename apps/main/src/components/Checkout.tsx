import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '../context/AuthContext';

interface CheckoutState {
  eventId: number;
  eventName: string;
  ticketType: string;
  quantity: number;
  pricePerTicket: number;
  subtotal: number;
  vat: number;
  total: number;
  ticketLabel: string;
}

const formatNGN = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

type PaymentOption = 'bank' | 'cash' | 'card';

export const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const { isLoggedIn, logout } = useAuth();

  const state = location.state as CheckoutState | null;

  // Guard: redirect if no state
  if (!state) {
    navigate(`/events/${eventId}`, { replace: true });
    return null;
  }

  // Billing form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [coupon, setCoupon] = useState('');
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('card');
  const [createAccount, setCreateAccount] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [emailPrefs, setEmailPrefs] = useState(false);
  const [organizerUpdates, setOrganizerUpdates] = useState(false);
  const [formError, setFormError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = () => {
    setFormError('');

    if (!fullName.trim()) { setFormError('Full name is required.'); return; }
    if (!email.trim()) { setFormError('Email is required.'); return; }
    if (!phone.trim()) { setFormError('Contact number is required.'); return; }
    if (!agreeTerms) { setFormError('You must agree to the terms & conditions.'); return; }

    // In a real app, send order to API here
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        <Navbar
          onProfileClick={() => navigate('/dashboard')}
          onLogoClick={() => navigate('/')}
          onListingsClick={() => navigate('/listings')}
          onContactClick={() => navigate('/contact')}
          onEventsClick={() => navigate('/events')}
          onAddBusinessClick={() => navigate('/add-business')}
          onShopClick={() => navigate('/shop')}
          onCartClick={() => navigate('/cart')}
          onFavoritesClick={() => navigate('/favorites')}
          onLoginClick={() => navigate('/')}
          onSignupClick={() => navigate('/')}
          isLoggedIn={isLoggedIn}
          onLogoutClick={() => { logout(); navigate('/'); }}
        />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16l7 7 13-13" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-2 text-sm">
              Thank you, <strong>{fullName}</strong>. Your ticket for <strong>{state.ticketLabel}</strong> has been confirmed.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              A confirmation email will be sent to <strong>{email}</strong>.
            </p>
            <button
              onClick={() => navigate('/events')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 text-sm uppercase tracking-wide transition-colors"
            >
              Browse More Events
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar
        onProfileClick={() => navigate('/dashboard')}
        onLogoClick={() => navigate('/')}
        onListingsClick={() => navigate('/listings')}
        onContactClick={() => navigate('/contact')}
        onEventsClick={() => navigate('/events')}
        onAddBusinessClick={() => navigate('/add-business')}
        onShopClick={() => navigate('/shop')}
        onCartClick={() => navigate('/cart')}
        onFavoritesClick={() => navigate('/favorites')}
        onLoginClick={() => navigate('/')}
        onSignupClick={() => navigate('/')}
        isLoggedIn={isLoggedIn}
        onLogoutClick={() => { logout(); navigate('/'); }}
      />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
          <hr className="border-gray-200 mb-8" />

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Billing + Payment */}
            <div className="flex-1">
              {/* Billing Details */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Billing Details</h2>
                <p className="text-xs text-gray-500 mb-6">All fields are required, except marked optional.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-blue-500 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Company/business name (Optional)</label>
                    <input
                      type="text"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-blue-500 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-blue-500 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Contact Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-blue-500 bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-8">
                <label className="block text-xs text-gray-600 mb-2">Coupon:</label>
                <div className="flex gap-0 max-w-xs">
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    placeholder="Enter Coupon Code"
                    className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
                  />
                  <button className="bg-gray-900 text-white text-xs font-bold px-4 py-2 hover:bg-gray-700 transition-colors whitespace-nowrap">
                    APPLY COUPON
                  </button>
                </div>
              </div>

              {/* Payment Option */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Option</h2>
                <div className="space-y-3">
                  {/* Direct bank transfer */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentOption === 'bank'}
                      onChange={() => setPaymentOption('bank')}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">Direct bank transfer</span>
                  </label>

                  {/* Cash on delivery */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentOption === 'cash'}
                      onChange={() => setPaymentOption('cash')}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">Cash on delivery</span>
                  </label>

                  {/* Pay with Card */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentOption === 'card'}
                      onChange={() => setPaymentOption('card')}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-sm text-gray-700">Pay with Card</span>
                    {/* Card icons */}
                    <div className="flex gap-1 ml-1">
                      {/* Visa */}
                      <div className="w-8 h-5 bg-[#1a1f71] rounded flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold italic">VISA</span>
                      </div>
                      {/* Mastercard */}
                      <div className="w-8 h-5 rounded overflow-hidden flex items-center justify-center bg-gray-100">
                        <div className="flex">
                          <div className="w-3 h-3 rounded-full bg-[#eb001b] opacity-90" />
                          <div className="w-3 h-3 rounded-full bg-[#f79e1b] opacity-90 -ml-1.5" />
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <hr className="border-gray-200 mb-6" />

              {/* Checkboxes */}
              <div className="space-y-3 mb-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createAccount}
                    onChange={e => setCreateAccount(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">Create an account?</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    I have read and agree to the website{' '}
                    <a href="#" className="text-blue-600 hover:underline">terms &amp; conditions</a>,{' '}
                    <a href="#" className="text-blue-600 hover:underline">Community Guidelines</a>, and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>{' '}
                    of MLC. (Required)
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailPrefs}
                    onChange={e => setEmailPrefs(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    Send me emails about the best events happening nearby or online.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={organizerUpdates}
                    onChange={e => setOrganizerUpdates(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    Keep me updated on more events and news from this event organizer.
                  </span>
                </label>
              </div>

              <hr className="border-gray-200 mb-6" />

              {/* Form error */}
              {formError && (
                <p className="text-red-600 text-sm mb-4">{formError}</p>
              )}

              {/* Place Order */}
              <button
                onClick={handlePlaceOrder}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase px-8 py-3 transition-colors tracking-wide"
              >
                PLACE ORDER
              </button>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="border border-gray-200 rounded p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
                <hr className="border-gray-200 mb-4" />

                {/* Item line */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="text-sm text-gray-700 flex-1 leading-snug">
                    {state.ticketLabel} &times; {state.quantity}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {formatNGN(state.subtotal)}
                  </span>
                </div>

                <hr className="border-gray-100 mb-4" />

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{formatNGN(state.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Value Added Tax</span>
                    <span className="font-semibold">{formatNGN(state.vat)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-gray-400">--</span>
                  </div>
                </div>

                <hr className="border-gray-200 mb-4" />

                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">
                    {state.total.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NGN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
